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
    const { date } = req.query; // Expecting a query parameter 'date' in 'YYYY-MM-DD' format
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(7, 0, 0, 0); // 11:00 AM in Georgia time (UTC+4)

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(15, 0, 0, 0); // 7:00 PM in Georgia time (UTC+4)

    // Find visits within the given date range
    const visits = await Visits.find({
      visitDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    res.status(200).json({ bookedVisits: visits });
  } catch (error) {
    res
      .status(500)
      .json({ customError: "Error in retrieving visit information", error });
  }
};

module.exports = {
  bookVisit,
  getAvailableTime,
};
