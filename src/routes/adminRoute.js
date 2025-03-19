import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin.js';
import Project from '../models/projects.js';
import { protectAdmin } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`); // Add a timestamp to the file name
  },
});

const upload = multer({ storage });

// Create Admin (for backend use only)
router.post('/create', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    const admin = new Admin({ username, password });
    await admin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (admin && (await admin.matchPassword(password))) {
      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ message: 'Login successful', token });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Admin Details (protected)
router.get('/profile', protectAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new project (protected, with file upload)
router.post('/projects', protectAdmin, upload.single('image'), async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Log the request body
    console.log('Uploaded File:', req.file); // Log the uploaded file

    const { title, description, demoLink, githubLink } = req.body;
    const image = req.file ? req.file.path : ''; // Get the uploaded file path
    const project = new Project({ title, description, image, demoLink, githubLink });
    await project.save();
    res.json(project);
  } catch (error) {
    console.error('Error adding project:', error); // Log the error
    res.status(500).json({ message: error.message });
  }
});

// Delete a project (protected)
router.delete('/projects/:id', protectAdmin, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;