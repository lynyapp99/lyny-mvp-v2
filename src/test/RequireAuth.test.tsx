import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { RequireAuth } from "@/components/RequireAuth";

// --- Mocks ---
const authState: { session: unknown; loading: boolean } = { session: null, loading: false };
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => authState,
}));

let onboardingValue: boolean | null = false;
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () =>
            Promise.resolve({
              data: onboardingValue === null ? null : { onboarding_completed: onboardingValue },
              error: null,
            }),
        }),
      }),
    }),
  },
}));

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/home"
          element={
            <RequireAuth>
              <div>HOME_CONTENT</div>
            </RequireAuth>
          }
        />
        <Route path="/auth" element={<div>AUTH_PAGE</div>} />
        <Route path="/onboarding" element={<div>ONBOARDING_PAGE</div>} />
      </Routes>
    </MemoryRouter>,
  );

describe("RequireAuth routing logic", () => {
  beforeEach(() => {
    authState.session = null;
    authState.loading = false;
    onboardingValue = false;
  });

  it("redirects unauthenticated users from /home to /auth", async () => {
    renderAt("/home");
    expect(await screen.findByText("AUTH_PAGE")).toBeInTheDocument();
    expect(screen.queryByText("HOME_CONTENT")).not.toBeInTheDocument();
  });

  it("renders protected content for an onboarded session", async () => {
    authState.session = { user: { id: "u1" } };
    onboardingValue = true;
    renderAt("/home");
    expect(await screen.findByText("HOME_CONTENT")).toBeInTheDocument();
  });

  it("redirects a logged-in user without onboarding to /onboarding", async () => {
    authState.session = { user: { id: "u2" } };
    onboardingValue = false;
    renderAt("/home");
    expect(await screen.findByText("ONBOARDING_PAGE")).toBeInTheDocument();
    expect(screen.queryByText("HOME_CONTENT")).not.toBeInTheDocument();
  });

  it("shows a spinner while auth is loading", async () => {
    authState.session = null;
    authState.loading = true;
    const { container } = renderAt("/home");
    expect(container.querySelector(".animate-spin")).not.toBeNull();
    expect(screen.queryByText("AUTH_PAGE")).not.toBeInTheDocument();
  });

  it("does not bounce a logged-in user back to /auth (regression)", async () => {
    authState.session = { user: { id: "u3" } };
    onboardingValue = true;
    renderAt("/home");
    await waitFor(() => expect(screen.getByText("HOME_CONTENT")).toBeInTheDocument());
    expect(screen.queryByText("AUTH_PAGE")).not.toBeInTheDocument();
  });
});