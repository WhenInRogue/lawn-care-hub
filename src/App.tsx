import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute, AdminRoute } from "./services/Guard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import SupplyPage from "./pages/SupplyPage";
import AddEditSupplyPage from "./pages/AddEditSupplyPage";
import EquipmentPage from "./pages/EquipmentPage";
import AddEditEquipmentPage from "./pages/AddEditEquipmentPage";
import CheckInSupplyPage from "./pages/CheckInSupplyPage";
import CheckOutSupplyPage from "./pages/CheckOutSupplyPage";
import CheckInEquipmentPage from "./pages/CheckInEquipmentPage";
import CheckOutEquipmentPage from "./pages/CheckOutEquipmentPage";
import SupplyTransactionsPage from "./pages/SupplyTransactionsPage";
import SupplyTransactionDetailsPage from "./pages/SupplyTransactionDetailsPage";
import EquipmentTransactionsPage from "./pages/EquipmentTransactionsPage";
import MaintenanceRecordPage from "./pages/MaintenanceRecordPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
          
          {/* Supply Routes */}
          <Route path="/supply" element={<AdminRoute element={<SupplyPage />} />} />
          <Route path="/supply/add" element={<AdminRoute element={<AddEditSupplyPage />} />} />
          <Route path="/supply/edit/:supplyId" element={<AdminRoute element={<AddEditSupplyPage />} />} />
          <Route path="/checkInSupply" element={<ProtectedRoute element={<CheckInSupplyPage />} />} />
          <Route path="/checkOutSupply" element={<ProtectedRoute element={<CheckOutSupplyPage />} />} />
          <Route path="/supplyTransactions" element={<ProtectedRoute element={<SupplyTransactionsPage />} />} />
          <Route path="/supplyTransactions/:supplyTransactionId" element={<ProtectedRoute element={<SupplyTransactionDetailsPage />} />} />
          
          {/* Equipment Routes */}
          <Route path="/equipment" element={<AdminRoute element={<EquipmentPage />} />} />
          <Route path="/equipment/add" element={<AdminRoute element={<AddEditEquipmentPage />} />} />
          <Route path="/equipment/edit/:equipmentId" element={<AdminRoute element={<AddEditEquipmentPage />} />} />
          <Route path="/checkInEquipment" element={<ProtectedRoute element={<CheckInEquipmentPage />} />} />
          <Route path="/checkOutEquipment" element={<ProtectedRoute element={<CheckOutEquipmentPage />} />} />
          <Route path="/equipmentTransactions" element={<ProtectedRoute element={<EquipmentTransactionsPage />} />} />
          
          {/* Maintenance Routes */}
          <Route path="/maintenanceRecords" element={<AdminRoute element={<MaintenanceRecordPage />} />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
