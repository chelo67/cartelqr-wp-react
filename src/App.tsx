import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Productos from "./pages/Productos";
import ProductoDetalle from "./pages/ProductoDetalle";
import ComoFunciona from "./pages/ComoFunciona";
import FAQ from "./pages/FAQ";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyAccount from "./pages/MyAccount";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/producto/:id" element={<ProductoDetalle />} />
              <Route path="/como-funciona" element={<ComoFunciona />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/mi-cuenta" element={<MyAccount />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
