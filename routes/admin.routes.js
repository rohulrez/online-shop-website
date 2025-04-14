const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin-controller');
const imageUplaodMiddleware = require('../middlewares/upload-image')


router.get('/products' ,adminController.getProducts);

router.get('/products/new',adminController.getNewProduct);

router.post('/products',imageUplaodMiddleware ,adminController.createNewProduct);

router.get('/products/:id',adminController.getUpdateProduct);

router.post('/products/:id', imageUplaodMiddleware , adminController.updateProduct);

// router.post('/products/:id', adminController.deleteProduct);





module.exports = router;