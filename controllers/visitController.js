const Visit = require("../models/Visit");

const bookVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const data = {
      name: req.name,
      email: req.email,
      phone: req.phone,
      message: req.message,
      visitDate: req.visitDate,
    };

    const newVisit = new Visit(data);
    await newVisit.save();
    res.status(201).json(newVisit)
  } catch (error) {
    res.status(400).json({ costumError: `error in booking visit`, error });
  }
  res.json({ booked: "booked" });
};

const getAvaliableTime = async (req, res) => {
  try{
    const { id } = req.params;

    const visits =  await Visit.find();
    res.status(200).json(visits)

  }catch(error) {
    res.status(500).json({costumError: `error in geting info in visitRouter`, error})
  }
};

module.exports = {
  bookVisit,
  getAvaliableTime,
};
