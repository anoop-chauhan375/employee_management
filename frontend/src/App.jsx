import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import EmployeesList from './pages/EmployeesList';
import EmployeeForm from './pages/EmployeeForm';
import EmployeeDetails from './pages/EmployeeDetails';
import SalaryInsights from './pages/SalaryInsights';
import Login from './pages/Login';
import MainLayout from './layouts/MainLayout';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, title }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout title={title}>{children}</MainLayout>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <ProtectedRoute title="Dashboard Overview">
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/employees" element={
            <ProtectedRoute title="Employees">
              <EmployeesList />
            </ProtectedRoute>
          } />
          <Route path="/employees/new" element={
            <ProtectedRoute title="Create Employee">
              <EmployeeForm />
            </ProtectedRoute>
          } />
          <Route path="/employees/:id" element={
            <ProtectedRoute title="Employee Details">
              <EmployeeDetails />
            </ProtectedRoute>
          } />
          <Route path="/employees/:id/edit" element={
            <ProtectedRoute title="Edit Employee">
              <EmployeeForm />
            </ProtectedRoute>
          } />
          <Route path="/insights" element={
            <ProtectedRoute title="Salary Insights">
              <SalaryInsights />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
