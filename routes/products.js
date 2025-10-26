const express = require('express');
const router = express.Router();
const ProductsController = require('../app/controllers/ProductsController');

// 產品中心首頁
router.get('/', ProductsController.index);


module.exports = router;
