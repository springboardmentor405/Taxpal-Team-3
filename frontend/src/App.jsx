import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyMail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Sidebar from "./layouts/Sidebar";
import DashboardLayout from "./layouts/DashboardLayout";
import TransactionsLayout from "./layouts/TransactionsLayout";
import Transactions from "./pages/Transactions";
import TaxEstimatorLayout from "./layouts/TaxEstimatorLayout";
import TaxEstimator from "./pages/TaxEstimator";
import ReportsLayout from "./layouts/ReportsLayout";
import Reports from "./pages/Reports";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-mail" element={<VerifyMail />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/transactions"
          element={
            <TransactionsLayout>
              <Transactions />
            </TransactionsLayout>
          }
        />
        <Route
          path="/tax-estimator"
          element={
            <TaxEstimatorLayout>
              <TaxEstimator />
            </TaxEstimatorLayout>
          }
        />
        <Route
          path="/reports"
          element={
            <ReportsLayout>
              <Reports />
            </ReportsLayout>
          }
        />
          
        <Route
          path="/settings"
          element={
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;