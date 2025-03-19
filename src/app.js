import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './database/dbconnection.js';
import contactsRoute from './routes/contactsRoute.js';
import projectsRoute from './routes/projectsRoute.js';
import adminRoutes from './routes/adminRoute.js';
import path from 'path';
import fs from 'fs';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Ensure the uploads directory exists
const uploadsDir = path.resolve('uploads'); // Use a relative path for simplicity
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true }); // Create the directory if it doesn't exist
}

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadsDir));

app.use('/api/contacts', contactsRoute);
app.use('/api/projects', projectsRoute);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));