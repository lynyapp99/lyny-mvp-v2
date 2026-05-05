## Root cause

The `handle_new_user()` function exists but **no trigger is attached** to `auth.users`. New signups never get a `profiles` row, so:
- `RequireAuth` reads `onboarding_completed` → `null` → treats as false → sends user to `/onboarding`.
- `Onboarding.finish()` runs `UPDATE profiles … WHERE id = user.id` → **0 rows** affected → flag never persists → loop back to `/onboarding` on every navigation.

Session is already the source of truth; the bug is that the profile row required to read the flag doesn't exist.

## Changes

### 1. SQL migration
- Create the missing trigger:
  ```sql
  create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
  ```
- Make `handle_new_user()` idempotent: append `on conflict (id) do nothing` to the insert (safe for re-runs and OAuth edge cases).
- Backfill profiles for the 7 existing users that don't have one, generating a unique username from email + short id suffix.

### 2. `src/pages/Onboarding.tsx`
- Replace `update profiles set onboarding_completed = true` with `upsert({ id: user.id, onboarding_completed: true })` so the flag persists even if the row is missing.

### 3. `src/hooks/useAuth.tsx`
- Same change: when consuming the `onboarding_pending_complete` localStorage flag after a new session, use `upsert` instead of `update`.

### 4. `src/components/RequireAuth.tsx`
- If `session` exists but the profile select returns `null`, perform a one-shot `upsert({ id, onboarding_completed: false })` and use the new value to decide. Prevents the loop for any user that somehow lacks a row.

### 5. `src/pages/Auth.tsx`
- After `signUp`, branch on `data.session`:
  - If a session was created (email confirmation off) → let the existing `useEffect` redirect (`/onboarding` for new accounts because the trigger sets the flag to false).
  - If no session (confirmation required) → show a "verifique seu e-mail" screen instead of the temporary success splash, no redirect.
- Drop the artificial 1.8 s timeout that hides the success screen; the redirect happens naturally as soon as the session arrives.

### 6. Tests (`src/test/RequireAuth.test.tsx`)
- Add a regression case: session present + profile row missing → component upserts and renders `/onboarding`, not a redirect loop.
- Add a case for the auth-page bounce: simulate a logged-in user landing on `/auth` and assert they get sent to `/home` (onboarded) or `/onboarding` (not). Extract the redirect-target decision into a small `useAuthRedirectTarget` hook so it's testable in isolation, and reuse it in both `Auth.tsx` and `Splash.tsx`.

## Mental verification
- New signup (no email confirm): trigger creates profile (flag=false) → session redirect → `/onboarding` → finish upserts true → `/home`. ✓
- New signup (email confirm on): no session → "check your email" screen, no redirect. After confirm + sign-in: same as above. ✓
- Existing user without profile row: backfill adds it; if backfill missed someone, `RequireAuth` upserts on the fly. ✓
- Onboarded user opens app: `Splash` reads flag true → `/home`. ✓
- Logged-in user hits `/auth`: `useEffect` redirects to `/home` or `/onboarding`. ✓
- Anonymous user hits `/home`: `RequireAuth` redirects to `/auth`. ✓

## Files touched
- `supabase/migrations/<new>.sql`
- `src/pages/Onboarding.tsx`
- `src/hooks/useAuth.tsx`
- `src/components/RequireAuth.tsx`
- `src/pages/Auth.tsx`
- `src/pages/Splash.tsx` (use shared hook)
- `src/hooks/useAuthRedirectTarget.ts` (new)
- `src/test/RequireAuth.test.tsx`
