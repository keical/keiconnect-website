import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/index.css";
import App from "@/App.tsx";
import TanstackProvider from "@/helpers/tanstack-provider";
import RootLayout from "@/layouts/root";
import DashboardLayout from "@/layouts/dashboard";
import HomePage from "@/pages/home";
import SignupPage from "@/pages/signup";
import ResendVerificationPage from "@/pages/resend-verification";
import ForgotPasswordPage from "@/pages/forgot-password";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import ProfilePage from "@/pages/dashboard/profile";
import SecurityPage from "@/pages/dashboard/security";
import AttendancePage from "@/pages/dashboard/attendance";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TanstackProvider>
        <App>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route index element={<HomePage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/resend-verification" element={<ResendVerificationPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Route>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="/dashboard/attendance" element={<AttendancePage />} />
              <Route path="/dashboard/security" element={<SecurityPage />} />
              <Route path="/dashboard/profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </App>
      </TanstackProvider>
    </BrowserRouter>
  </StrictMode>
)
