const express = require('express');
const router = express.Router();
const product = require('../controllers/product')

router.put('/products/gallery-images/:id',product.upload.array('images'),product.galleryImages);
router.post('/products',product.upload.single("image"),product.createProduct);
router.get('/products',product.getAllProduct);
router.get('/products/:id',product.getOnePoductDetail);
router.put('/products/:id',product.updateProduct);
router.delete('/products/:id',product.deleteProduct);
router.get('/products/get/count',product.countProduct);
router.get('/products/get/feature/:count',product.featuredProduct);





module.exports = router;