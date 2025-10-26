const express = require('express');
const router = express.Router();
const UserController = require('../app/controllers/UserController');
const { requireRole, canManageUser } = require('../app/middleware/roleAuth');
const { requireAuth } = require('../app/middleware/auth');

// 所有路由都需要登入
router.use(requireAuth);

// 用戶列表 - 需要代理商或更高權限
router.get('/', requireRole('agent'), UserController.getUserList);

// 獲取可管理的角色列表
router.get('/manageable-roles', UserController.getManageableRoles);

// 用戶統計信息 - 需要代理商或更高權限
router.get('/stats', requireRole('agent'), UserController.getUserStats);

// 創建用戶 - 需要代理商或更高權限
router.post('/', requireRole('agent'), UserController.createUser);

// 獲取用戶詳情 - 需要代理商或更高權限
router.get('/:userId', requireRole('agent'), UserController.getUserDetail);

// 更新用戶 - 需要代理商或更高權限
router.put('/:userId', requireRole('agent'), UserController.updateUser);

// 刪除用戶 - 需要代理商或更高權限
router.delete('/:userId', requireRole('agent'), UserController.deleteUser);

module.exports = router;