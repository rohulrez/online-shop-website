const express = require('express');
const orderController =  require('../controllers/orders.controller');
const { route } = require('./auth-routes');


const router = express.Router();

router.get('/', orderController.getOrders);

router.post('/', orderController.addOrder);

router.get('/success', orderController.getSuccess);

router.get('/failure', orderController.getFailure);


module.exports = router;