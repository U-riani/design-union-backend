const express = require('express');
const { getAllPartners, getSinglePartner, createPartner, deletePartner, updatePartner } = require('../controllers/partnersController');
const { handleImageUpload } = require('../middleware/imageMiddleware');

const router = express.Router();

router.get('/', getAllPartners);

router.get('/:id', getSinglePartner);

router.post('/', handleImageUpload,  createPartner);

router.delete('/:id', deletePartner);

router.patch('/:id', handleImageUpload, updatePartner)


module.exports = router;