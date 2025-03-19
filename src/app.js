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
app.use(cors({
    origin: ['http://localhost:5173', 'https://rajeshpandey10.com.np', 'https://rajesh-pandey.vercel.app/'], // Replace with your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json());

// Ensure the uploads directory exists
const uploadsDir = path.resolve('uploads'); // Use a relative path for simplicity
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true }); // Create the directory if it doesn't exist
}

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadsDir));

// Middleware to serve .jsx files with the correct MIME type
app.use((req, res, next) => {
  if (req.url.endsWith('.jsx')) {
    res.setHeader('Content-Type', 'application/javascript');
  }
  next();
});

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; font-src 'self' https://fonts.gstatic.com; style-src 'self' https://fonts.googleapis.com; script-src 'self';"
  );
  next();
});

app.use('/api/contacts', contactsRoute);
app.use('/api/projects', projectsRoute);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));