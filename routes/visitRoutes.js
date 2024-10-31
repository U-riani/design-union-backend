const express = require("express");
const {bookVisit, getAvailableTime} = require('../controllers/visitController')

const router = express.Router();

router.post('/visit', bookVisit)

router.get('/visit', getAvailableTime)

module.exports = router;