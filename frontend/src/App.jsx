import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import WorkerProfile from "./pages/WorkerProfile";
import WorkerRegister from "./pages/WorkerRegister";
import CustomerRegister from "./pages/CustomerRegister";
import Login from "./pages/Login";
import WorkerDashboard from "./pages/WorkerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const App = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/worker/:id" element={<WorkerProfile />} />
        <Route path="/register/worker" element={<WorkerRegister />} />
        <Route path="/register/customer" element={<CustomerRegister />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/worker/dashboard"
          element={
            <ProtectedRoute allow={["worker"]}>
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allow={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <Footer />
  </div>
);

export default App;
