import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  demoLink: { type: String, required: false }, // Link to the live demo
  githubLink: { type: String, required: false }, // Link to the GitHub repository
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Project', projectSchema);