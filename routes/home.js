const express = require('express');
const router = express.Router();
const HomeController = require('../app/controllers/HomeController');
const { validateSearch, validateContact } = require('../app/middleware/validation');

// 首頁
router.get('/', HomeController.index);

// 關於我們
router.get('/about', HomeController.about);

// 聯絡我們
router.get('/contact', HomeController.contact);
router.post('/contact', validateContact, HomeController.contact);

// 搜尋
router.get('/search', validateSearch, HomeController.search);

// 健康檢查
router.get('/health', HomeController.health);

module.exports = router;
