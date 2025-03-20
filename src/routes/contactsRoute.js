import express from 'express';
import ContactForm from '../models/contactForm.js';
import { sendEmail } from '../config/emailService.js';

const router = express.Router();

// Handle contact form submissions
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const contact = new ContactForm({ name, email, message });
    await contact.save();
    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Error saving contact form:', error);
    res.status(500).json({ message: 'Failed to submit contact form' });
  }
});

// Get all contact form submissions
router.get('/', async (req, res) => {
  try {
    const contacts = await ContactForm.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Respond to a contact form submission
router.put('/:id', async (req, res) => {
  try {
    const { response } = req.body;
    const contact = await ContactForm.findByIdAndUpdate(
      req.params.id,
      { response },
      { new: true }
    );
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Respond to a contact form submission
router.post('/reply', async (req, res) => {
  try {
    const { email, response } = req.body;

    // Find the contact form entry by email
    const contact = await ContactForm.findOneAndUpdate(
      { email },
      { response },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Send an email reply
    const subject = 'Reply to your contact form submission';
    const text = `Hello ${contact.name},\n\n${response}\n\nBest regards,\nRajesh`;

    await sendEmail(email, subject, text);

    res.json({ message: 'Reply sent successfully', contact });
  } catch (error) {
    console.error('Error sending reply:', error);
    res.status(500).json({ message: 'Failed to send reply' });
  }
});

// Delete a contact by ID
router.delete('/:id', async (req, res) => {
  try {
    const contact = await ContactForm.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Failed to delete contact' });
  }
});

export default router;