const mongoose = require('mongoose');

const RegisteredStudentSchema = new mongoose.Schema({
  name: String,
  studentId: String,
  year: String,
  department: String,
  semester: String,
  selectedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]

  // selectedCourses: [String], // store course _ids or codes
});

module.exports = mongoose.model('RegisteredStudent', RegisteredStudentSchema);
