import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { RequireAuth } from "@/components/RequireAuth";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import Relationships from "./pages/Relationships";
import Create from "./pages/Create";
import EventCreate from "./pages/EventCreate";
import EventDetail from "./pages/EventDetail";
import EventAlbum from "./pages/EventAlbum";
import EventInvite from "./pages/EventInvite";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import TimelineDetail from "./pages/TimelineDetail";
import HiddenTimelineDemo from "./pages/HiddenTimelineDemo";
import TimelinePublic from "./pages/TimelinePublic";
import InviteAccept from "./pages/InviteAccept";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/convite/:eventId" element={<EventInvite />} />
          <Route path="/t/:timelineId" element={<TimelinePublic />} />
          <Route path="/invite/:token" element={<InviteAccept />} />
          <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/relationships" element={<RequireAuth><Relationships /></RequireAuth>} />
          <Route path="/create" element={<RequireAuth><Create /></RequireAuth>} />
          <Route path="/event/create" element={<RequireAuth><EventCreate /></RequireAuth>} />
          <Route path="/event/:eventId" element={<RequireAuth><EventDetail /></RequireAuth>} />
          <Route path="/event/:eventId/album" element={<RequireAuth><EventAlbum /></RequireAuth>} />
          <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/timeline/:timelineId" element={<RequireAuth><TimelineDetail /></RequireAuth>} />
          <Route path="/hidden-timelines" element={<RequireAuth><HiddenTimelineDemo /></RequireAuth>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
