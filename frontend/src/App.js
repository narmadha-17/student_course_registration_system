// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage"; // ⬅️ add this import

import "./styles/tailwind.css"; // Ensure this path is correct


import FacultyDashboard from "./pages/FacultyDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import CoursePage from "./pages/CoursePage";
import EnrollmentPage from "./pages/EnrollmentPage";
import LoginPage from "./pages/LoginPage"; // Import LoginPage
import { AuthProvider, useAuth } from "./context/AuthContext"; // Import AuthContext

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Navigation Bar */}
        <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold">
              Student Course Registration System
            </h1>
            <ul className="flex space-x-6 text-white">
              <li>
                <Link to="/" className="hover:text-gray-200 transition duration-300">
                  Home
                </Link>
              </li>
              
              <li>
                <Link to="/login" className="hover:text-gray-200 transition duration-300">
                  Faculty Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-gray-200 transition duration-300">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-gray-200 transition duration-300">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/enrollment" className="hover:text-gray-200 transition duration-300">
                  Enrollment
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <div className="bg-gray-50 min-h-screen py-8">
          <div className="container mx-auto p-6 bg-white rounded-lg shadow-xl">
            {/* <Routes>
              <Route
                path="/"
                element={
                  <div className="text-center text-3xl font-semibold text-gray-800">
                    Welcome to the Student Course Registration System
                  </div>
                }
              />
              
              <Route path="/login" element={<LoginPage />} />
              <Route path="/courses" element={<CoursePage />} />
              <Route path="/enrollment" element={<EnrollmentPage />} />

              {/* Protected Routes */}
              {/* <Route
                path="/admin"
                element={<PrivateRoute><AdminDashboard /></PrivateRoute>}
              />
              
               <Route path="/faculty" element={<PrivateRoute><FacultyDashboard /></PrivateRoute>}
              />
              <Route
                path="/student"
                element={<PrivateRoute><StudentDashboard /></PrivateRoute>}
              />
            </Routes> */}

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/courses" element={<CoursePage />} />
              <Route path="/enrollment" element={<EnrollmentPage />} />
              
              {/* Protected Routes */}
             
              <Route
                path="/faculty"
                element={<PrivateRoute><FacultyDashboard /></PrivateRoute>}
              />
              <Route
                path="/student"
                element={<PrivateRoute><StudentDashboard /></PrivateRoute>}
              />
            </Routes>

          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Protected Route Component
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  console.log("Auth Status:", isAuthenticated); // Debugging
  return isAuthenticated ? children : <Navigate to="/login" />;
}


export default App;