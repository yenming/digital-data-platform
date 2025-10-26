const express = require('express');
const router = express.Router();
const HomeController = require('../app/controllers/HomeController');

// 首頁
router.get('/', HomeController.index);


// 健康檢查
router.get('/health', HomeController.health);

module.exports = router;
