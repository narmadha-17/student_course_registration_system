const mongoose = require("mongoose");


const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  semester: { type: String, required: true },
  year: { type: String, required: true }, // ✅ Added to match the request body
  selectedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});


const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);

module.exports = Student;
