const express = require('express');
const router = express.Router();
const category = require('../controllers/category');


router.get('/category',category.getAllCategory)
router.get('/category/:id',category.getOneCategoryDetail)
router.post('/category',category.createCategory)
router.delete('/category/:id',category.deleteCategory)
router.put('/category/:id',category.updateCategory)




module.exports = router;
