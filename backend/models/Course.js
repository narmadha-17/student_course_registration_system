const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  year: String,
  department: String,
  semester: String,
  courseCode: String,
  courseName: String,
  totalCredits: Number,
  facultyNames: [String], // ✅ NEW
  totalStudents: Number,   // ✅ NEW
});

// ✅ Prevent duplicate model compilation
const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

module.exports = Course;
