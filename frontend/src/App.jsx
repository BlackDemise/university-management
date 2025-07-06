import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import NavigationInitializer from "./components/NavigationInitializer.jsx";
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
import DepartmentList from "./components/academic/department/DepartmentList.jsx";
import DepartmentDetails from "./components/academic/department/DepartmentDetails.jsx";
import DepartmentUpdate from "./components/academic/department/DepartmentUpdate.jsx";
import MajorList from "./components/academic/major/MajorList.jsx";
import MajorDetails from "./components/academic/major/MajorDetails.jsx";
import MajorUpdate from "./components/academic/major/MajorUpdate.jsx";
import CourseList from "./components/academic/course/CourseList.jsx";
import CourseDetails from "./components/academic/course/CourseDetails.jsx";
import CourseUpdate from "./components/academic/course/CourseUpdate.jsx";
import ProgramCurriculumList from "./components/academic/program-curriculum/ProgramCurriculumList.jsx";
import ProgramCurriculumDetails from "./components/academic/program-curriculum/ProgramCurriculumDetails.jsx";
import ProgramCurriculumUpdate from "./components/academic/program-curriculum/ProgramCurriculumUpdate.jsx";
import DepartmentMemberList from "./components/academic/department-member/DepartmentMemberList.jsx";
import DepartmentMemberDetails from "./components/academic/department-member/DepartmentMemberDetails.jsx";
import DepartmentMemberUpdate from "./components/academic/department-member/DepartmentMemberUpdate.jsx";
import ClassroomList from "./components/facility/classroom/ClassroomList.jsx";
import ClassroomDetails from "./components/facility/classroom/ClassroomDetails.jsx";
import ClassroomUpdate from "./components/facility/classroom/ClassroomUpdate.jsx";
import PrerequisiteCourseList from "./components/academic/prerequisite-course/PrerequisiteCourseList.jsx";
import PrerequisiteCourseDetails from "./components/academic/prerequisite-course/PrerequisiteCourseDetails.jsx";
import PrerequisiteCourseUpdate from "./components/academic/prerequisite-course/PrerequisiteCourseUpdate.jsx";
import SemesterUpdate from "./components/enrollment/semester/SemesterUpdate.jsx";
import SemesterDetails from "./components/enrollment/semester/SemesterDetails.jsx";
import SemesterList from "./components/enrollment/semester/SemesterList.jsx";
import CourseOfferingList from "./components/enrollment/course-offering/CourseOfferingList.jsx";
import CourseOfferingDetails from "./components/enrollment/course-offering/CourseOfferingDetails.jsx";
import CourseOfferingUpdate from "./components/enrollment/course-offering/CourseOfferingUpdate.jsx";
import CourseRegistrationSummaryList from "./components/enrollment/course-registration/CourseRegistrationSummaryList.jsx";
import CourseOfferingRegistrationDetails from "./components/enrollment/course-registration/CourseOfferingRegistrationDetails.jsx";
import CourseRegistrationDetails from "./components/enrollment/course-registration/CourseRegistrationDetails.jsx";
import CourseRegistrationUpdate from "./components/enrollment/course-registration/CourseRegistrationUpdate.jsx";

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
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Teacher Routes */}
            <Route
              path="/teacher-dashboard"
              element={
                <ProtectedRoute requiredRole="TEACHER">
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            {/* User Management Routes */}
            <Route
              path="/admin/users/all"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <UsersList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users/details/:id"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <UserDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users/edit/:id"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <UserUpdate />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users/create"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <UserUpdate />
                </ProtectedRoute>
              }
            />

            {/* Department Management Routes */}
            <Route
              path="/admin/academic/departments"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <DepartmentList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/academic/departments/details/:id"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <DepartmentDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/academic/departments/edit/:id"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <DepartmentUpdate />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/academic/departments/create"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <DepartmentUpdate />
                </ProtectedRoute>
              }
            />

            {/* Major Management Routes */}
            <Route
              path="/admin/academic/majors"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <MajorList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/academic/majors/details/:id"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <MajorDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/academic/majors/edit/:id"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <MajorUpdate />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/academic/majors/create"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <MajorUpdate />
                </ProtectedRoute>
              }
            />

            {/* Course Management Routes */}
            <Route
              path="/admin/academic/courses"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <CourseList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/academic/courses/details/:id"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <CourseDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/academic/courses/edit/:id"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <CourseUpdate />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/academic/courses/create"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <CourseUpdate />
                </ProtectedRoute>
              }
            />

            {/* Program Curriculum Management Routes */}
            <Route
              path="/admin/academic/program-curriculum"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <ProgramCurriculumList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/academic/program-curriculum/details/:id"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <ProgramCurriculumDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/academic/program-curriculum/edit/:id"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <ProgramCurriculumUpdate />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/academic/program-curriculum/create"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <ProgramCurriculumUpdate />
                </ProtectedRoute>
              }
            />

            {/* Department Member Management Routes */}
            <Route
              path="/admin/academic/department-members"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <DepartmentMemberList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/academic/department-members/details/:id"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <DepartmentMemberDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/academic/department-members/edit/:id"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <DepartmentMemberUpdate />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/academic/department-members/create"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <DepartmentMemberUpdate />
                </ProtectedRoute>
              }
            />

            {/* Classroom Management Routes */}
            <Route
              path="/admin/facility/classrooms"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <ClassroomList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/facility/classrooms/details/:id"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <ClassroomDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/facility/classrooms/edit/:id"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <ClassroomUpdate />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/facility/classrooms/create"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <ClassroomUpdate />
                </ProtectedRoute>
              }
            />

            {/* Prerequisite Course Management Routes */}
            <Route
              path="/admin/academic/prerequisite-courses"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <PrerequisiteCourseList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/academic/prerequisite-courses/details/:courseId"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <PrerequisiteCourseDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/academic/prerequisite-courses/edit/:courseId"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <PrerequisiteCourseUpdate />
                </ProtectedRoute>
              }
            />

            {/* Semester Routes */}
            <Route
              path="/admin/enrollment/semesters"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <SemesterList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/enrollment/semesters/details/:id"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <SemesterDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/enrollment/semesters/edit/:id"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <SemesterUpdate />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/enrollment/semesters/create"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <SemesterUpdate />
                </ProtectedRoute>
              }
            />

            {/* Course Offering Routes */}
            <Route
              path="/admin/enrollment/course-offerings"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <CourseOfferingList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/enrollment/course-offerings/details/:id"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <CourseOfferingDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/enrollment/course-offerings/edit/:id"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <CourseOfferingUpdate />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/enrollment/course-offerings/create"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <CourseOfferingUpdate />
                </ProtectedRoute>
              }
            />

            {/* Course Registration Management Routes */}
            <Route
              path="/admin/enrollment/course-registrations"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <CourseRegistrationSummaryList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/enrollment/course-registrations/course-offering/:courseOfferingId"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <CourseOfferingRegistrationDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/enrollment/course-registrations/details/:id"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <CourseRegistrationDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/enrollment/course-registrations/edit/:id"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <CourseRegistrationUpdate />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/enrollment/course-registrations/create"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <CourseRegistrationUpdate />
                </ProtectedRoute>
              }
            />

            {/* Default redirect to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </NavigationInitializer>
      </Router>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;
