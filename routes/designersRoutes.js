const express = require('express');
const { getAllDesigners, getSingleDesigner, createDesigner, deleteDesigner, updateDesigner, getSomeDesigners, getAllDesignersInfo } = require('../controllers/designersController');
const { handleImageUpload } = require('../middleware/imageMiddleware');
const rateLimitMiddleware = require('../middleware/rateLimitMiddleware');


const router = express.Router();

router.get('/', getAllDesigners);

router.get('/allDesignersInfo', getAllDesignersInfo);

// router.get('/getAllDesignersJsonFile', getAllDesignersJsonFile);

// router.get('/migrateDesignerImages', migrateDesignerImages);

router.get('/paginated', getSomeDesigners);

router.get('/:id', getSingleDesigner);

router.post('/', rateLimitMiddleware, handleImageUpload,  createDesigner);

router.delete('/:id', deleteDesigner);

router.patch('/:id', handleImageUpload, updateDesigner)


module.exports = router;