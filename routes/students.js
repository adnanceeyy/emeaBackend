const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const authMiddleware = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Student Login
router.post('/login', async (req, res) => {
  const { studentId, password } = req.body;
  try {
    const student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, studentId: student.studentId, id: student._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all students (Names only for public list)
router.get('/', async (req, res) => {
  try {
    const students = await Student.find({}, 'childName std _id');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single student details (Requires Token)
router.get('/:id', async (req, res) => {
  try {
    // Basic verification of token (either admin or the specific student)
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.role !== 'admin' && decoded.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    
    // Don't send password
    const studentData = student.toObject();
    delete studentData.password;
    res.json(studentData);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Create student (Admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update student (Admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password; // Don't overwrite with empty
    }
    
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete student (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
