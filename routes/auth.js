const express = require('express');
const router = express.Router();
const AuthController = require('../app/controllers/AuthController');
const { validateLogin, validateRegister } = require('../app/middleware/validation');
const { redirectIfAuthenticated } = require('../app/middleware/auth');

// 登入頁面
router.get('/login', redirectIfAuthenticated, AuthController.loginPage);

// 處理登入
router.post('/login', validateLogin, AuthController.login);

// 註冊頁面
router.get('/register', redirectIfAuthenticated, AuthController.registerPage);

// 處理註冊
router.post('/register', validateRegister, AuthController.register);

// 登出
router.post('/logout', AuthController.logout);
router.get('/logout', AuthController.logout);

// 忘記密碼頁面
router.get('/forgot-password', AuthController.forgotPasswordPage);

// 處理忘記密碼
router.post('/forgot-password', AuthController.forgotPassword);

module.exports = router;
