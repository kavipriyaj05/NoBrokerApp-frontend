// App.jsx — Kavi's file (updated by Jeyanth)
// Root component with all routes

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { USER_ROLES } from './utils/constants';

// Auth pages — Kavi
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OtpPage from './pages/OtpPage';
import GoogleCallback from './pages/GoogleCallback';

// Property pages — Kavi
import PropertyListPage from './pages/PropertyListPage';
import PropertyDetailPage from './pages/PropertyDetailPage';

// Jeyanth's pages
import AddPropertyPage from './pages/AddPropertyPage';
import MyPropertiesPage from './pages/MyPropertiesPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: 'toast-custom',
          style: {
            background: '#fff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
            padding: '12px 16px',
            fontSize: '0.875rem',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PropertyListPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<OtpPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/properties/:id" element={<PropertyDetailPage />} />

        {/* Protected USER routes — Jeyanth's pages */}
        <Route
          path="/add-property"
          element={
            <PrivateRoute>
              <AddPropertyPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-properties"
          element={
            <PrivateRoute>
              <MyPropertiesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <PrivateRoute>
              <MyBookingsPage />
            </PrivateRoute>
          }
        />

        {/* Protected ADMIN route — Jeyanth's page */}
        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRole={USER_ROLES.ADMIN}>
              <AdminDashboardPage />
            </PrivateRoute>
          }
        />

        {/* 404 fallback */}
        <Route
          path="*"
          element={
            <div className="page-wrapper" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 'calc(100vh - var(--navbar-height))',
              textAlign: 'center',
              padding: '2rem',
            }}>
              <div>
                <h1 className="heading-1" style={{ fontSize: '5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>404</h1>
                <h2 className="heading-3" style={{ marginBottom: '0.5rem' }}>Page not found</h2>
                <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>
                  The page you're looking for doesn't exist.
                </p>
                <a href="/" className="btn btn-primary">Go Home</a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
