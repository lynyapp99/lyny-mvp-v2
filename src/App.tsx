import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PWAInstallPrompt />
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/relationships" element={<Relationships />} />
        <Route path="/create" element={<Create />} />
        <Route path="/event/create" element={<EventCreate />} />
        <Route path="/event/:eventId" element={<EventDetail />} />
        <Route path="/event/:eventId/album" element={<EventAlbum />} />
        <Route path="/convite/:eventId" element={<EventInvite />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/timeline/:timelineId" element={<TimelineDetail />} />
        <Route path="/hidden-timelines" element={<HiddenTimelineDemo />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
