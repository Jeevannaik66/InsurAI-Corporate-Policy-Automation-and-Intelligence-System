import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import VerifyOtp from "./components/VerifyOtp";
import ForgotPassword from "./components/ForgotPassword";  // ✅ Import ForgotPassword
import ResetPassword from "./components/ResetPassword";    // ✅ Import ResetPassword
import Dashboard from "./components/Dashboard";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />  {/* ✅ Forgot Password Route */}
          <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* ✅ Reset Password Route */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
