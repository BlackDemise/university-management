import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext.jsx';
import NavigationInitializer from './components/NavigationInitializer.jsx';
import Unauthorized from "./components/error/Unauthorized.jsx";
import Unauthenticated from "./components/error/Unauthenticated.jsx";
import Login from "./components/auth/Login.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import AdminDashboard from "./components/dashboard/AdminDashboard.jsx";
import TeacherDashboard from "./components/dashboard/TeacherDashboard.jsx";
import StudentDashboard from "./components/dashboard/StudentDashboard.jsx";
import UsersList from "./components/user/UserList.jsx";
import UserDetails from "./components/user/UserDetails.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavigationInitializer>
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/unauthenticated" element={<Unauthenticated />} />

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Teacher Routes */}
          <Route path="/teacher-dashboard" element={
            <ProtectedRoute requiredRole="TEACHER">
              <TeacherDashboard />
            </ProtectedRoute>
          } />

          {/* Student Routes */}
          <Route path="/student-dashboard" element={
            <ProtectedRoute requiredRole="STUDENT">
              <StudentDashboard />
            </ProtectedRoute>
          } />

          {/* User Management Routes */}
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRole="ADMIN">
              <UsersList />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/users/all" element={
            <ProtectedRoute requiredRole="ADMIN">
              <UsersList />
            </ProtectedRoute>
          } />

          <Route path="/admin/users/details/:id" element={
            <ProtectedRoute requiredRole="ADMIN">
              <UserDetails />
            </ProtectedRoute>
          } />

          {/* Default redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </NavigationInitializer>
      </Router>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App
