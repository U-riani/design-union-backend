const express = require("express");
const {bookVisit, getAllVisits } = require('../controllers/visitController')

const router = express.Router();

router.post('/visit', bookVisit)

router.get('/visit', getAllVisits )

module.exports = router;