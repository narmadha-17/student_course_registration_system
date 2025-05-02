import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FacultyDashboard = () => {
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    year: "",
    department: "",
    semester: "",
    courseCode: "",
    courseName: "",
    totalCredits: "",
    facultyNames: ["", ""], // Minimum 2 faculty
    totalStudents: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingCourse, setPendingCourse] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || role !== "faculty") navigate("/login");
    fetchCourses();
  }, [isAuthenticated, role, navigate]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  const handleFacultyChange = (index, value) => {
    const updatedFaculty = [...newCourse.facultyNames];
    updatedFaculty[index] = value;
    setNewCourse({ ...newCourse, facultyNames: updatedFaculty });
  };

  const addFacultyField = () => {
    if (newCourse.facultyNames.length < 3) {
      setNewCourse({ ...newCourse, facultyNames: [...newCourse.facultyNames, ""] });
    }
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (Object.values(newCourse).some(field => field === "" || (Array.isArray(field) && field.some(name => name === "")))) {
      alert("Please fill in all required fields.");
      return;
    }
    setIsModalOpen(true);
    setPendingCourse(newCourse);
  };

  const confirmAddCourse = async (confirmed) => {
    if (confirmed && pendingCourse) {
      try {
        const response = await axios.post("http://localhost:5000/api/courses", pendingCourse, {
          headers: { "Content-Type": "application/json" },
        });
        fetchCourses();
      } catch (error) {
        console.error("Error adding course:", error.response ? error.response.data : error.message);
        alert("Failed to add course. Check console for details.");
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Faculty Course Management</h2>
        <button onClick={logout} className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700">Logout</button>
      </div>

      {/* Add Course Form */}
      <form onSubmit={handleAddCourse} className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Add New Course</h3>
        {['year', 'department', 'semester', 'courseCode', 'courseName'].map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-gray-700 font-medium">{field}</label>
            <input type="text" name={field} value={newCourse[field]} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
          </div>
        ))}

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Total Credits</label>
          <input type="number" name="totalCredits" value={newCourse.totalCredits} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
        </div>

        {/* Faculty Fields */}
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Faculty Names</h3>
        {newCourse.facultyNames.map((faculty, index) => (
          <div key={index} className="mb-4">
            <label className="block text-gray-700 font-medium">Faculty {index + 1}</label>
            <input
              type="text"
              value={faculty}
              onChange={(e) => handleFacultyChange(index, e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
        ))}
        {newCourse.facultyNames.length < 3 && (
          <button type="button" onClick={addFacultyField} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            + Add Another Faculty
          </button>
        )}

        {/* Total Students */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Total Students</label>
          <input type="number" name="totalStudents" value={newCourse.totalStudents} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">Add Course</button>
      </form>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Confirm Course Addition</h3>
            <p>{pendingCourse?.courseCode} - {pendingCourse?.courseName}</p>
            <div className="flex justify-between mt-4">
              <button onClick={() => confirmAddCourse(true)} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Confirm</button>
              <button onClick={() => confirmAddCourse(false)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
