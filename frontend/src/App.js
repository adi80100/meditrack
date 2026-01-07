import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './contexts/AuthContext';
import Box from '@mui/material/Box';
import PatientDetailPage from './pages/PatientDetailPage';

function App() {
  const { user } = useContext(AuthContext);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {user && <Navbar />}
        <Box display="flex">
          {user && <Sidebar />}
          <Box flexGrow={1} sx={{ ml: user ? '220px' : 0, mt: user ? 2 : 0, p: 2 }}>
            <Routes>
              <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients"
                element={
                  <ProtectedRoute>
                    <PatientsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients/:id"
                element={
                  <ProtectedRoute>
                    <PatientDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <ProtectedRoute>
                    <AppointmentsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
