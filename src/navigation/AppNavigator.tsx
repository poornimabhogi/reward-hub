import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Shop from "@/pages/Shop";
import Games from "@/pages/Games";
import Social from "@/pages/Social";
import Health from "@/pages/Health";
import Sell from "@/pages/Sell";
import Payment from "@/pages/Payment";
import PaymentSuccess from "@/pages/PaymentSuccess";
import ProductDetail from "@/pages/ProductDetail";

export const AppNavigator = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/shop/product/:id" element={<ProductDetail />} />
      <Route path="/games" element={<Games />} />
      <Route path="/social" element={<Social />} />
      <Route path="/health" element={<Health />} />
      <Route path="/sell" element={<Sell />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
    </Routes>
  );
};