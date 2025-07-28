import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import MainHeader from "@/components/layout/MainHeader";
import Index from "./pages/Index";
import ForStudents from "./pages/ForStudents";
import ForEmployers from "./pages/ForEmployers";
import Roadmap from "./pages/Roadmap";
import NotFound from "./pages/NotFound";
import { Projects } from "./pages/Projects";
import { PostProject } from "./pages/PostProject";
import { ProjectDetail } from "./pages/ProjectDetail";

const queryClient = new QueryClient();

const AppLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  
  return (
    <div className="min-h-screen bg-background">
      {!isHomePage && <MainHeader />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/for-students" element={<ForStudents />} />
        <Route path="/for-employers" element={<ForEmployers />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/new" element={<PostProject />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
