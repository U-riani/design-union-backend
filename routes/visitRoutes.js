const express = require("express");
const {bookVisit, getAvaliableTime} = require('../controllers/visitController')

const router = express.Router();

router.post('/visit', bookVisit)

router.get('/visit', getAvaliableTime)
