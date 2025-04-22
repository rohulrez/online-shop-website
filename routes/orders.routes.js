const express = require('express');
const orderController =  require('../controllers/orders.controller');
const { route } = require('./auth-routes');


const router = express.Router();

router.get('/', orderController.getOrdrs);

router.post('/', orderController.addOrder);


module.exports = router;