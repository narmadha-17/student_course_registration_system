const mongoose = require("mongoose");

const pendingCourseSchema = new mongoose.Schema({
  year: { type: String, required: true },
  department: { type: String, required: true },
  semester: { type: String, required: true },
  courseCode: { type: String, required: true },
  courseName: { type: String, required: true },
  totalCredits: { type: Number, required: true },
  subject_handling_faculty: [{ type: String, required: true }],
  max_students: { type: Number, required: true },
  enrolled_students: { type: Number, default: 0 }, // This will help you track capacity
  status: { type: String, default: "pending" }, // For admin to approve/reject
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PendingCourse", pendingCourseSchema);
