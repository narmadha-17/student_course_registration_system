import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const EnrollmentPage = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [facultyAssignments, setFacultyAssignments] = useState({});

  useEffect(() => {
    fetchRegisteredStudents();
    fetchCourses();
  }, []);

  const fetchRegisteredStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/registered_details");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching registered students:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const prepareFacultyAssignments = () => {
    const assignments = {};
    const courseStudentMap = {};

    // Group students by courseCode
    students.forEach((student) => {
      student.selectedCourses.forEach((course) => {
        if (!courseStudentMap[course.courseCode]) {
          courseStudentMap[course.courseCode] = [];
        }
        courseStudentMap[course.courseCode].push({
          studentName: student.name,
          studentId: student.studentId,
          department: student.department,
          courseName: course.courseName,
          courseCode: course.courseCode,
        });
      });
    });

    // Assign faculty to students based on course
    Object.entries(courseStudentMap).forEach(([courseCode, enrolledStudents]) => {
      const courseInfo = courses.find((c) => c.courseCode === courseCode);

      if (courseInfo && courseInfo.facultyNames && courseInfo.facultyNames.length > 0) {
        const facultyCount = courseInfo.facultyNames.length;
        const maxStudentsPerFaculty = Math.ceil(enrolledStudents.length / facultyCount);

        let facultyIndex = 0;
        assignments[courseCode] = enrolledStudents.map((student, idx) => {
          const assignedFaculty = courseInfo.facultyNames[facultyIndex];
          if ((idx + 1) % maxStudentsPerFaculty === 0 && facultyIndex < facultyCount - 1) {
            facultyIndex++;
          }
          return {
            ...student,
            assignedFaculty,
            year: courseInfo.year || "N/A",
            semester: courseInfo.semester || "N/A",
          };
        });
      }
    });

    return assignments;
  };

  useEffect(() => {
    if (students.length > 0 && courses.length > 0) {
      const assignments = prepareFacultyAssignments();
      setFacultyAssignments(assignments);
    }
  }, [students, courses]);

  const registerStudent = async (studentData) => {
    try {
      const response = await axios.post("http://localhost:5000/api/registered_details", studentData);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Student registered successfully!",
      });

      fetchRegisteredStudents();
    } catch (error) {
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

  const groupedData = () => {
    const allStudents = Object.entries(facultyAssignments)
      .flatMap(([courseCode, assignedStudents]) =>
        assignedStudents.map((student) => ({
          ...student,
          courseCode,
        }))
      );

    const grouped = {};

    allStudents.forEach((student) => {
      if (!grouped[student.department]) {
        grouped[student.department] = {};
      }
      if (!grouped[student.department][student.courseCode]) {
        grouped[student.department][student.courseCode] = [];
      }
      grouped[student.department][student.courseCode].push(student);
    });

    return grouped;
  };

  const groupedStudents = groupedData();

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Enrolled Students</h2>

      {Object.entries(groupedStudents).map(([department, courses]) => (
        <div key={department} className="mb-10">
          <h3 className="text-2xl font-bold text-blue-700 mb-4">{department}</h3>

          {Object.entries(courses).map(([courseCode, students]) => (
            <div key={courseCode} className="mb-6">
              <h4 className="text-xl font-semibold text-green-700 mb-2">Course Code: {courseCode}</h4>

              <table className="w-full border-collapse border border-gray-300 mb-">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-400 px-4 py-2">Year</th>
                    <th className="border border-gray-400 px-4 py-2">Semester</th>
                    <th className="border border-gray-400 px-4 py-2">Student Name</th>
                    <th className="border border-gray-400 px-4 py-2">Student ID</th>
                    <th className="border border-gray-400 px-4 py-2">Course Name</th>
                    <th className="border border-gray-400 px-4 py-2">Assigned Faculty</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => (
                    <tr key={`${courseCode}-${idx}`} className="text-center">
                      <td className="border border-gray-400 px-4 py-2">{student.year}</td>
                      <td className="border border-gray-400 px-4 py-2">{student.semester}</td>
                      <td className="border border-gray-400 px-4 py-2">{student.studentName}</td>
                      <td className="border border-gray-400 px-4 py-2">{student.studentId}</td>
                      <td className="border border-gray-400 px-4 py-2">{student.courseName}</td>
                      <td className="border border-gray-400 px-4 py-2">{student.assignedFaculty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default EnrollmentPage;
