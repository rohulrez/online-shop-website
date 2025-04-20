const express = require('express');
const cartContoller =  require('../controllers/cart.controller');


const router = express.Router();

router.post('/items', cartContoller.addCartItem);



module.exports = router;