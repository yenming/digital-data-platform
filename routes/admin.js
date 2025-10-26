const express = require('express');
const router = express.Router();
const AdminController = require('../app/controllers/AdminController');
const { requireRole } = require('../app/middleware/roleAuth');
const { requireAuth } = require('../app/middleware/auth');

// 所有路由都需要登入
router.use(requireAuth);

// 系統管理員儀表板首頁
router.get('/', requireRole('system_admin'), AdminController.getAdminDashboard);

// 用戶資料設定
router.get('/profile', requireRole('system_admin'), AdminController.getProfileSettings);
router.post('/profile', requireRole('system_admin'), AdminController.updateProfile);

// 系統管理員管理
router.get('/system-admins', requireRole('system_admin'), AdminController.getSystemAdmins);

// 代理商管理
router.get('/agents', requireRole('system_admin'), AdminController.getAgents);

// 品牌管理
router.get('/brands', requireRole('system_admin'), AdminController.getBrands);

// 個人經營管理
router.get('/individuals', requireRole('system_admin'), AdminController.getIndividuals);

// 用戶管理 API
router.post('/users', requireRole('system_admin'), AdminController.createUser);
router.put('/users/:userId', requireRole('system_admin'), AdminController.updateUser);
router.delete('/users/:userId', requireRole('system_admin'), AdminController.deleteUser);

// 統計和工具 API
router.get('/manageable-roles', requireRole('system_admin'), AdminController.getManageableRoles);
router.get('/user-stats', requireRole('system_admin'), AdminController.getUserStats);

module.exports = router;
