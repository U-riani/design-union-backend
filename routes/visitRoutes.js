const express = require('express');
const { bookVisit, getAllVisits, getBookedTimes } = require('../controllers/visitController'); // Adjust the path as necessary

const router = express.Router();

// Route for booking a visit
router.post('/book', bookVisit);

// Route for getting all booked visits
router.get('/', getAllVisits);

// Route for getting booked times for a specific date
router.get('/booked-times', getBookedTimes); // Add this line

module.exports = router;
