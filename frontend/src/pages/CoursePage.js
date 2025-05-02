import React, { useState, useEffect } from "react";
import axios from "axios";

const CoursePage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Group courses by Year -> Semester -> Department
  const groupedCourses = courses.reduce((acc, course) => {
    const { year, semester, department } = course;

    if (!acc[year]) acc[year] = {};
    if (!acc[year][semester]) acc[year][semester] = {};
    if (!acc[year][semester][department]) acc[year][semester][department] = [];

    acc[year][semester][department].push(course);
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Course List</h2>

      {Object.entries(groupedCourses).map(([year, semesters]) => (
        <div key={year} className="mb-6 border rounded-lg shadow-md p-4 bg-white">
          <h3 className="text-2xl font-bold text-blue-700 mb-3">Year: {year}</h3>

          {Object.entries(semesters).map(([semester, departments]) => (
            <div key={semester} className="ml-6 mb-4 p-4 border rounded-lg bg-gray-100">
              <h4 className="text-xl font-semibold text-gray-800">Semester: {semester}</h4>

              {Object.entries(departments).map(([department, courses]) => (
                <div key={department} className="ml-6 p-4 border rounded-lg bg-gray-200">
                  <h5 className="text-lg font-medium text-gray-700">Department: {department}</h5>

                  <table className="w-full mt-2 border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-300">
                        <th className="border border-gray-400 px-4 py-2">Course ID</th>
                        <th className="border border-gray-400 px-4 py-2">Course Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((course) => (
                        <tr key={course.courseCode} className="text-center">
                          <td className="border border-gray-400 px-4 py-2">{course.courseCode}</td>
                          <td className="border border-gray-400 px-4 py-2">{course.courseName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CoursePage;

