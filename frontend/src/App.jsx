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
import UserUpdate from "./components/user/UserUpdate.jsx";
import DepartmentList from "./components/academic/DepartmentList.jsx";
import DepartmentDetails from "./components/academic/DepartmentDetails.jsx";
import DepartmentUpdate from "./components/academic/DepartmentUpdate.jsx";

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

          <Route path="/admin/users/edit/:id" element={
            <ProtectedRoute requiredRole="ADMIN">
              <UserUpdate />
            </ProtectedRoute>
          } />

          <Route path="/admin/users/create" element={
            <ProtectedRoute requiredRole="ADMIN">
              <UserUpdate />
            </ProtectedRoute>
          } />

          {/* Department Management Routes */}
          <Route path="/admin/academic/departments" element={
            <ProtectedRoute requiredRole="ADMIN">
              <DepartmentList />
            </ProtectedRoute>
          } />

          <Route path="/admin/academic/departments/details/:id" element={
            <ProtectedRoute requiredRole="ADMIN">
              <DepartmentDetails />
            </ProtectedRoute>
          } />

          <Route path="/admin/academic/departments/edit/:id" element={
            <ProtectedRoute requiredRole="ADMIN">
              <DepartmentUpdate />
            </ProtectedRoute>
          } />

          <Route path="/admin/academic/departments/create" element={
            <ProtectedRoute requiredRole="ADMIN">
              <DepartmentUpdate />
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
