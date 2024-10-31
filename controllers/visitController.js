const Visits = require("../models/Visit");

const bookVisit = async (req, res) => {
  try {
    const { name, email, phone, message, visitDate } = req.body;

    const newVisit = new Visits({ name, email, phone, message, visitDate });
    await newVisit.save();
    
    res.status(201).json({ message: "Visit successfully booked", newVisit });
  } catch (error) {
    res.status(400).json({ customError: "Error in booking visit", error });
  }
};

const getAvailableTime = async (req, res) => {
  try {
    const visits = await Visits.find();
    res.status(200).json(visits);
  } catch (error) {
    res.status(500).json({ customError: "Error in retrieving visit information", error });
  }
};

module.exports = {
  bookVisit,
  getAvailableTime,
};
