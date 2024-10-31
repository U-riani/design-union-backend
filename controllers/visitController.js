const Visit = require('../models/Visit'); // Adjust the path to your Visit model

// Create a new visit
const bookVisit = async (req, res) => {
  try {
    const { name, email, phone, message, visitDate } = req.body;

    // Check for existing bookings at the same time
    const existingVisit = await Visit.findOne({ visitDate });
    if (existingVisit) {
      return res.status(400).json({ customError: 'This time slot is already booked.' });
    }

    const newVisit = new Visit({
      name,
      email,
      phone,
      message,
      visitDate,
    });

    await newVisit.save();
    return res.status(201).json({ message: 'Visit booked successfully!', visit: newVisit });
  } catch (error) {
    console.error('Error booking visit:', error);
    return res.status(500).json({ customError: 'An unexpected error occurred. Please try again.' });
  }
};

// Get all booked visits
const getAllVisits = async (req, res) => {
  try {
    const visits = await Visit.find({});
    return res.status(200).json(visits);
  } catch (error) {
    console.error('Error retrieving visits:', error);
    return res.status(500).json({ customError: 'Failed to retrieve visits.' });
  }
};

module.exports = {
  bookVisit,
  getAllVisits,
};
