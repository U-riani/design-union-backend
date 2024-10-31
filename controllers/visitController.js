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

// Fetch booked times for a specific date
const getBookedTimes = async (req, res) => {
  try {
    const { date } = req.query;
    
    // Ensure the date is in valid format (string to Date object)
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1); // Set end date to the next day

    // Find all visits within the specified date
    const visits = await Visit.find({
      visitDate: {
        $gte: startDate,
        $lt: endDate
      }
    });

    // Extract booked times from visits
    const bookedTimes = visits.map(visit => {
      const visitTime = visit.visitDate.toISOString().split('T')[1].slice(0, 5); // Format: HH:MM
      return visitTime;
    });

    return res.status(200).json({ bookedTimes });
  } catch (error) {
    console.error("Error fetching booked times:", error);
    return res.status(500).json({ customError: 'Failed to fetch booked times.' });
  }
};

module.exports = {
  bookVisit,
  getAllVisits,
  getBookedTimes,
};
