const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// Get all courses
router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// Add a course
router.post("/courses", async (req, res) => {
  try {
    console.log("Received Data:", req.body);
    const { year, department, semester, courseCode, courseName, totalCredits, facultyNames, totalStudents } = req.body;

    if (!year || !department || !semester || !courseCode || !courseName || !totalCredits || !facultyNames || !totalStudents) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newCourse = new Course({ year, department, semester, courseCode, courseName, totalCredits, facultyNames, totalStudents });
    await newCourse.save();
    console.log("Course added:", newCourse);
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a course
router.delete("/:id", async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Failed to delete course" });
  }
});

module.exports = router;
