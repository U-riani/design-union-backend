const express = require('express');
const { getAllDesigners, getSingleDesigner, createDesigner, deleteDesigner, updateDesigner } = require('../controllers/designersController');
const { handleImageUpload } = require('../middleware/imageMiddleware');

const router = express.Router();

router.get('/', getAllDesigners);

router.get('/:id', getSingleDesigner);

router.post('/', handleImageUpload,  createDesigner);

router.delete('/:id', deleteDesigner);

router.patch('/:id', handleImageUpload, updateDesigner)


module.exports = router;