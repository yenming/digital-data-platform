const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../app/middleware/auth');

// 使用者儀表板
router.get('/dashboard', requireAuth, (req, res) => {
  res.render('users/dashboard', {
    title: '使用者儀表板',
    user: req.session.user
  });
});

// 使用者設定
router.get('/profile', requireAuth, (req, res) => {
  res.render('users/profile', {
    title: '個人資料',
    user: req.session.user
  });
});

// 更新個人資料
router.post('/profile', requireAuth, (req, res) => {
  // 這裡可以添加更新個人資料的邏輯
  req.flash('success_msg', '個人資料已更新');
  res.redirect('/users/profile');
});

// 管理員面板
router.get('/admin', requireAdmin, (req, res) => {
  res.render('users/admin', {
    title: '管理員面板',
    user: req.session.user
  });
});

module.exports = router;
