require('dotenv').config();
const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// General rate limiting for all routes (prevents abuse of static file serving)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false
});
app.use(generalLimiter);

// Rate limiting for appointment endpoint
const appointmentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per window
  message: { success: false, message: 'Too many appointment requests. Please try again later.' }
});

// Appointment form submission endpoint
app.post('/api/appointment', appointmentLimiter, async (req, res) => {
  const { name, phone, email, service, date, time, message } = req.body;

  // Basic validation
  if (!name || !phone || !service) {
    return res.status(400).json({
      success: false,
      message: 'Please provide your name, phone number, and service type.'
    });
  }

  const smsBody = [
    '🦷 NEW APPOINTMENT REQUEST - Weekend & Emergency Dental',
    `Name: ${name}`,
    `Phone: ${phone}`,
    email ? `Email: ${email}` : null,
    `Service: ${service}`,
    date ? `Preferred Date: ${date}` : null,
    time ? `Preferred Time: ${time}` : null,
    message ? `Message: ${message}` : null
  ]
    .filter(Boolean)
    .join('\n');

  // Send SMS via Twilio if credentials are configured
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER) {
    try {
      const twilio = require('twilio');
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: smsBody,
        from: process.env.TWILIO_FROM_NUMBER,
        to: '+15013131616'
      });
    } catch (err) {
      console.error('Twilio SMS error:', err.message);
      // Still return success to the patient — the form was submitted
    }
  } else {
    // Log the appointment details when Twilio is not configured
    console.log('--- New Appointment Request ---');
    console.log(smsBody);
    console.log('------------------------------');
    console.log('(Configure TWILIO_* environment variables to enable SMS notifications)');
  }

  res.json({
    success: true,
    message: "Thank you! We've received your appointment request and will contact you shortly."
  });
});

// Serve the main HTML page for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Weekend & Emergency Dental server running on http://localhost:${PORT}`);
});
