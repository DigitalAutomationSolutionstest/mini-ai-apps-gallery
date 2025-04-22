
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import Gallery from "./pages/Gallery";
import Workshop from "./pages/Workshop";
import Documentation from "./pages/Documentation";
import Dashboard from "./pages/Dashboard";
import Quote from "./pages/Quote";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import PdfGenerator from "./pages/dashboard/PdfGenerator";
import ImageGenerator from "./pages/dashboard/ImageGenerator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/workshop" element={<Workshop />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/pdf" element={<PdfGenerator />} />
            <Route path="/dashboard/image" element={<ImageGenerator />} />
            <Route path="/quote" element={<Quote />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
