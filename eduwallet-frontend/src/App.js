import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import WalletPage from './pages/WalletPage';
import './styles/app.css';

// PrivateRoute component to protect routes
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const isAuthenticated = user?.token;
  const hasAccess = allowedRoles.includes(user?.role);

  if (!isAuthenticated || !hasAccess) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Main App component
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <AnimatePresence mode="wait">
              <motion.div
                key={window.location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Private Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute allowedRoles={['admin', 'school', 'parent']}>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/wallet"
                    element={
                      <PrivateRoute allowedRoles={['parent']}>
                        <WalletPage />
                      </PrivateRoute>
                    }
                  />

                  {/* Default Route */}
                  <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;