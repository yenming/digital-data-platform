const express = require('express');
const router = express.Router();
const ProductsController = require('../app/controllers/ProductsController');

// 產品中心首頁
router.get('/', ProductsController.index);

// 產品分類頁面
router.get('/category/:category', ProductsController.category);

// 產品詳情頁面
router.get('/:id', ProductsController.detail);

module.exports = router;
