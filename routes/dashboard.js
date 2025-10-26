const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const auth = require('../app/middleware/auth');
const DashboardController = require('../app/controllers/DashboardController');

// 所有路由都需要認證
router.use(auth.requireAuth);

// 儀表板首頁
router.get('/', DashboardController.index);

// 平台管理
router.get('/platforms', DashboardController.platforms);
router.post('/platforms/connect', [
  body('platformId').notEmpty().withMessage('請選擇平台'),
  body('accountId').notEmpty().withMessage('請輸入帳戶ID'),
  body('accountName').notEmpty().withMessage('請輸入帳戶名稱'),
  body('accessToken').notEmpty().withMessage('請輸入存取權杖')
], DashboardController.connectPlatform);

router.delete('/platforms/:connectionId', [
  param('connectionId').isInt().withMessage('無效的連接ID')
], DashboardController.disconnectPlatform);

// 數據同步
router.post('/sync/:connectionId', [
  param('connectionId').isInt().withMessage('無效的連接ID'),
  body('startDate').optional().isISO8601().withMessage('無效的開始日期'),
  body('endDate').optional().isISO8601().withMessage('無效的結束日期')
], DashboardController.syncPlatform);

// 數據報表
router.get('/reports', DashboardController.reports);
router.get('/export', [
  query('format').isIn(['csv', 'json']).withMessage('不支援的導出格式')
], DashboardController.exportData);

// 自定義儀表板
router.get('/custom/:dashboardId?', DashboardController.customDashboard);
router.post('/custom', [
  body('name').notEmpty().withMessage('請輸入儀表板名稱'),
  body('description').optional().isLength({ max: 500 }).withMessage('描述不能超過500字')
], DashboardController.createDashboard);

// API 端點
router.get('/api/realtime', DashboardController.getRealtimeData);

module.exports = router;
