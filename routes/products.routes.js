const path = require('path')
const express = require('express');


const router = express.Router();

router.get('/products' , (req, res) => {
    res.render('products/all-products');
})





module.exports = router;