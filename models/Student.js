const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const StudentSchema = new mongoose.Schema({
  childName: { type: String, required: true },
  parentName: { type: String, required: true },
  std: { type: String, required: true },
  caseHistory: { type: String },
  assessment: { type: String },
  suggestions: { type: String },
  followUp: { type: String },
  improvements: { type: String },
  studentId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
StudentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('Student', StudentSchema);
