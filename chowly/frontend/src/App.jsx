import React from "react";
import { Routes, Route } from "react-router-dom";
import { SessionProvider } from "./context/SessionContext.jsx";

import Landing from "./pages/Landing.jsx";
import CustomerStart from "./pages/CustomerStart.jsx";
import Menu from "./pages/Menu.jsx";
import Cart from "./pages/Cart.jsx";
import OrderStatus from "./pages/OrderStatus.jsx";
import WaiterDashboard from "./pages/WaiterDashboard.jsx";
import WaiterOrderDetail from "./pages/WaiterOrderDetail.jsx";

export default function App() {
  return (
    <SessionProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/customer/start" element={<CustomerStart />} />
        <Route path="/customer/menu" element={<Menu />} />
        <Route path="/customer/cart" element={<Cart />} />
        <Route path="/customer/order/:orderId" element={<OrderStatus />} />
        <Route path="/waiter" element={<WaiterDashboard />} />
        <Route path="/waiter/order/:orderId" element={<WaiterOrderDetail />} />
      </Routes>
    </SessionProvider>
  );
}
