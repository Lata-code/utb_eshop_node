const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');

router.post('/order', orderController.createOrder )
router.get('/order', orderController.getAllOrder )
router.get('/order/:id', orderController.oneOrderDetail )
router.delete('/order/:id', orderController.deleteOrder )
router.put('/order/:id', orderController.updateOrder )
router.get('/get/totalsales', orderController.totalSales )
router.get('/get/count', orderController.orderCount )
router.get('/get/userorders/:userid', orderController.userOrders )




module.exports = router;