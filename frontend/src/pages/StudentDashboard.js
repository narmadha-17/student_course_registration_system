import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const StudentDashboard = () => {
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [name, setname] = useState("");
  const [studentId, setstudentId] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    if (!isAuthenticated || role !== "student") navigate("/login");
    fetchDepartmentsAndSemesters();
  }, [isAuthenticated, role, navigate]);

  const fetchDepartmentsAndSemesters = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/courses");
      const coursesData = response.data;
      const uniqueDepartments = [...new Set(coursesData.map(course => course.department))];
      setDepartments(uniqueDepartments);
    } catch (error) {
      console.error("Error fetching departments and semesters:", error);
    }
  };

  const handleDepartmentChange = (e) => {
    const selectedDept = e.target.value;
    setDepartment(selectedDept);
    setSemester("");
    setCourses([]);

    axios.get("http://localhost:5000/api/courses").then((response) => {
      const filteredSemesters = [...new Set(
        response.data.filter(course => course.department === selectedDept).map(course => course.semester)
      )];
      setSemesters(filteredSemesters);
    });
  };

  const fetchCourses = async () => {
    if (!department || !semester) return;
    try {
      const response = await axios.get("http://localhost:5000/api/courses");
      const filteredCourses = response.data.filter(
        (course) => course.department === department && course.semester === semester
      );
      setCourses(filteredCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleRegister = async () => {
    if (!name || !studentId || !year || !department || !semester || selectedCourses.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Details",
        text: "Please fill all fields and select at least one course.",
      });
      return;
    }

    try {
      const requestData = {
        name,
        studentId,
        year,
        department,
        semester,
        selectedCourses,
      };

      const response = await axios.post("http://localhost:5000/api/registered_details", requestData);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Student registered successfully!",
      });

      // You can clear the form here if you want
      setname("");
      setstudentId("");
      setYear("");
      setDepartment("");
      setSemester("");
      setCourses([]);
      setSelectedCourses([]);

    } catch (error) {
      console.error("Error registering student:", error.response?.data || error.message);

      if (error.response && error.response.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: error.response.data.error,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Something went wrong while registering.",
        });
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Student Course Registration</h2>
        <button onClick={logout} className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700">Logout</button>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Student Information</h3>
        <input type="text" className="w-full p-2 border rounded-lg mb-4" placeholder="Student Name" value={name} onChange={(e) => setname(e.target.value)} />
        <input type="text" className="w-full p-2 border rounded-lg mb-4" placeholder="Roll Number" value={studentId} onChange={(e) => setstudentId(e.target.value)} />
        <input type="text" className="w-full p-2 border rounded-lg mb-4" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Select Department & Semester</h3>
        <select className="w-full p-2 border rounded-lg mb-4" value={department} onChange={handleDepartmentChange}>
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        <select className="w-full p-2 border rounded-lg mb-4" value={semester} onChange={(e) => setSemester(e.target.value)}>
          <option value="">Select Semester</option>
          {semesters.map((sem) => (
            <option key={sem} value={sem}>{sem}</option>
          ))}
        </select>
        <button onClick={fetchCourses} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">Fetch Courses</button>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Available Courses</h3>
        {courses.length === 0 ? (
          <p>No courses available for the selected department and semester.</p>
        ) : (
          courses.map((course) => (
            <div key={course._id} className="flex justify-between items-center p-3 border rounded-lg mb-2">
              <span>{course.courseCode} - {course.courseName}</span>
              <input type="checkbox" onChange={(e) => {
                if (e.target.checked) {
                  setSelectedCourses([...selectedCourses, course._id]);
                } else {
                  setSelectedCourses(selectedCourses.filter(id => id !== course._id));
                }
              }} />
            </div>
          ))
        )}
        {courses.length > 0 && (
          <button onClick={handleRegister} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 mt-4">Submit Registration</button>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
