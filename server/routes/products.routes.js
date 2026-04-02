const express = require('express');
const Product = require('../models/product.model.js');
const router = express.Router();
const {getProducts,getProduct,createProduct,deleteProduct,updateProduct} = require('../controllers/product.controller')




router.get('/' ,getProducts )
router.get('/:id' ,getProduct )
router.put('/:id' ,updateProduct  )
router.delete('/:id' ,deleteProduct )
router.post('/' , createProduct);

module.exports = router ;
