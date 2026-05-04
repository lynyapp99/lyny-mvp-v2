## Context

The backend already exists in Lovable Cloud:
- Tables: `profiles`, `sectors`, `timelines`, `memories`, `memory_media`, `connections`, `connection_requests` — all with RLS
- Storage bucket: `memories` (public)
- Trigger `handle_new_user` auto-creates a profile on signup

What's missing: authentication UI and replacing `src/data/mockData.ts` / `profileData.ts` with real Supabase queries.

## Plan

### 1. Authentication
- Add `/auth` page with email + password (sign up / sign in) and Google sign-in
- Create `useAuth` hook wrapping `onAuthStateChange` + `getSession`
- Protect routes (`/home`, `/profile`, `/create`, etc.) — redirect to `/auth` when signed out
- Add sign-out action in Profile/Settings
- Enable auto-confirm email so testing doesn't require inbox access (can disable later)

### 2. Replace mock data with real queries
Build a small data layer (`src/lib/api/`) using `@tanstack/react-query`:
- `useSectors()` — list/create/update/delete from `sectors`
- `useTimelines(sectorId?)` — from `timelines`, filtered by sector
- `useMemories(timelineId)` — from `memories` + joined `memory_media`
- `useProfile(userId)` — from `profiles`
- `useConnections()` — from `connections` / `connection_requests`

Update these screens to consume the hooks instead of `mockData`/`profileData`:
- `Home.tsx`, `SectorRail.tsx`, `SectorCarouselPage.tsx`
- `TimelineDetail.tsx`, `TimelineCard.tsx`
- `Relationships.tsx`
- `Profile.tsx`, `PublicProfileView.tsx`

### 3. Media uploads
- Wire `AddMemoryFlow` to upload images to the `memories` storage bucket, then insert rows into `memories` + `memory_media` with the public URL

### 4. Empty states + seeding
- Add empty-state UI for new users (no sectors/timelines yet)
- Optional: a "Create starter sectors" button that inserts a few default sectors so the home screen isn't blank

### 5. Keep mocks as fallback (optional)
- Leave `mockData.ts` as a reference but stop importing it from screens

## Technical notes

- Auth state: subscribe with `supabase.auth.onAuthStateChange` BEFORE calling `getSession()` to avoid race conditions
- All queries rely on existing RLS — no new policies needed
- `connection_requests` already has insert/update/select policies; no schema changes
- `Profile` table doesn't currently have public/private profile fields (`tagline`, `public_profile_enabled`, `public_timeline_ids`). For now, derive "public" from `timelines.privacy = 'public'` and skip the public-profile-toggle feature, or add a follow-up migration to extend `profiles`

## Out of scope (can do next)
- Hidden timeline biometric/password gating (needs schema additions)
- Realtime subscriptions for collaborative timelines
- Public profile customization beyond what fits in current `profiles` table
