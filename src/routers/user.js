const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/user/register', userController.signUp )
router.get('/user', userController.getAllUser )
router.get('/user/:id', userController.oneUserDetail )
router.post('/user/login', userController.signIn )
router.delete('/user/:id', userController.deleteUser )
router.put('/user/:id', userController.updateUser )




module.exports = router;
