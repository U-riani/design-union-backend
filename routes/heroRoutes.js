const express = require('express');
const { getAllHeros, getSingleHero, createHero, deleteHero, updateHero } = require('../controllers/heroController');
const { handleImageUpload } = require('../middleware/imageMiddleware');

const router = express.Router();

router.get('/', getAllHeros);

router.get('/:id', getSingleHero);

router.post('/', handleImageUpload,  createHero);

router.delete('/:id', deleteHero);

router.patch('/:id', handleImageUpload, updateHero)


module.exports = router;