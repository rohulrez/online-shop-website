const Product = require('../models/product.model');

async function addCartItem (req, res, next){
    let product
    try {
        product = await Product.findById(req.body.productId);;

    } catch(error) {
        next(error);
    }

    const cart = res.locals.cart;
    res.locals.cart.addItem(product);
    req.session.cart = cart;
}


module.exports = {
    addCartItem,
}