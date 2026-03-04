import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataProvider } from "@/context/DataContext";
import Dashboard from "./pages/Dashboard";
import TrendDetail from "./pages/TrendDetail";
import Methodology from "./pages/Methodology";
import UploadPage from "./pages/UploadPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DataProvider>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <div className="flex-1 flex flex-col min-w-0">
                <header className="h-10 flex items-center border-b border-border px-2 shrink-0 lg:hidden">
                  <SidebarTrigger />
                </header>
                <main className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/trend/:id" element={<TrendDetail />} />
                    <Route path="/upload" element={<UploadPage />} />
                    <Route path="/methodology" element={<Methodology />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </DataProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
