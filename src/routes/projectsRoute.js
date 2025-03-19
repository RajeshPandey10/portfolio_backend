import express from 'express';
import Project from '../models/projects.js';
import upload from '../config/multer.js';

const router = express.Router();

// Get all projects (for users)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new project (for admin)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, demoLink, githubLink } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : ''; // Save the relative path to the image
    const project = new Project({ title, description, image, demoLink, githubLink });
    await project.save();
    res.json(project);
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete a project (for admin)
router.delete('/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;