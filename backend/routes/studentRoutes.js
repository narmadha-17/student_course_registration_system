const express = require('express');
const router = express.Router();
const RegisteredStudent = require('../models/RegisteredStudent');
const Course = require('../models/Course');

router.post('/registered_details', async (req, res) => {
  try {
    const { name, studentId, year, department, semester, selectedCourses } = req.body;

    // Check for each selected course
    for (const courseId of selectedCourses) {
      // Get course details
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({ error: `Course not found for ID: ${courseId}` });
      }

      // Count how many students have already registered for this course
      const count = await RegisteredStudent.countDocuments({
        department,
        semester,
        selectedCourses: courseId,
      });

      // Compare with the allowed totalStudents
      if (count >= course.totalStudents) {
        return res.status(400).json({ 
          error: `Maximum count reached for the course "${course.courseName}". You cannot register for this course.` 
        });
      }
    }

    // If all checks pass, register the student
    const newStudent = new RegisteredStudent({
      name,
      studentId,
      year,
      department,
      semester,
      selectedCourses,
    });

    await newStudent.save();
    res.status(201).json({ message: 'Student registered successfully!' });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get("/registered_details", async (req, res) => {
  try {
    const students = await RegisteredStudent.find()
      .populate("selectedCourses", "courseName courseCode department");
    
    if (!students || students.length === 0) {
      return res.status(404).json({ message: "No registered students found" });
    }

    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch registered students" });
  }
});

module.exports = router;
