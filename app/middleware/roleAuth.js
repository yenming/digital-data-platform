/**
 * 角色權限管理中間件
 * 支援多層級權限：system_admin > agent > brand > individual
 */

// 角色權限等級定義
const ROLE_HIERARCHY = {
  'system_admin': 4,  // 最高權限
  'agent': 3,         // 代理商
  'brand': 2,         // 品牌
  'individual': 1     // 最低權限
};

// 角色中文名稱
const ROLE_NAMES = {
  'system_admin': '系統管理員',
  'agent': '代理商',
  'brand': '品牌',
  'individual': '個人經營'
};

/**
 * 檢查用戶是否有指定角色或更高權限
 * @param {string} requiredRole - 需要的角色
 * @returns {Function} Express 中間件函數
 */
const requireRole = (requiredRole) => {
  return (req, res, next) => {
    try {
      // 檢查用戶是否已登入
      if (!req.session || !req.session.user) {
        return res.status(401).json({
          success: false,
          message: '請先登入'
        });
      }

      const userRole = req.session.user.role;
      const userRoleLevel = ROLE_HIERARCHY[userRole];
      const requiredRoleLevel = ROLE_HIERARCHY[requiredRole];

      // 檢查權限等級
      if (userRoleLevel >= requiredRoleLevel) {
        req.userRole = userRole;
        req.userRoleLevel = userRoleLevel;
        req.userRoleName = ROLE_NAMES[userRole];
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: `權限不足，需要 ${ROLE_NAMES[requiredRole]} 或更高權限`
        });
      }
    } catch (error) {
      console.error('角色權限檢查錯誤:', error);
      return res.status(500).json({
        success: false,
        message: '權限檢查失敗'
      });
    }
  };
};

/**
 * 檢查用戶是否可以管理指定用戶
 * @param {Object} req - Express 請求對象
 * @param {Object} res - Express 響應對象
 * @param {Function} next - 下一個中間件函數
 */
const canManageUser = (req, res, next) => {
  try {
    const currentUser = req.session.user;
    const targetUserId = req.params.userId || req.body.userId;
    
    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: '缺少目標用戶ID'
      });
    }

    // 系統管理員可以管理所有用戶
    if (currentUser.role === 'system_admin') {
      return next();
    }

    // 其他角色只能管理下級用戶
    const currentUserLevel = ROLE_HIERARCHY[currentUser.role];
    
    // 這裡需要從數據庫查詢目標用戶的角色
    // 暫時使用 req.targetUser（需要在控制器中設置）
    if (req.targetUser) {
      const targetUserLevel = ROLE_HIERARCHY[req.targetUser.role];
      
      if (currentUserLevel > targetUserLevel) {
        return next();
      }
    }

    return res.status(403).json({
      success: false,
      message: '無權限管理此用戶'
    });
  } catch (error) {
    console.error('用戶管理權限檢查錯誤:', error);
    return res.status(500).json({
      success: false,
      message: '權限檢查失敗'
    });
  }
};

/**
 * 檢查用戶是否可以訪問指定資源
 * @param {string} resource - 資源名稱
 * @param {string} action - 操作類型 (read, write, delete)
 * @returns {Function} Express 中間件函數
 */
const requirePermission = (resource, action = 'read') => {
  return (req, res, next) => {
    try {
      const user = req.session.user;
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: '請先登入'
        });
      }

      // 系統管理員擁有所有權限
      if (user.role === 'system_admin') {
        return next();
      }

      // 檢查用戶權限配置
      const permissions = user.permissions || {};
      const resourcePermissions = permissions[resource] || [];

      if (resourcePermissions.includes(action) || resourcePermissions.includes('*')) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: `無權限執行 ${action} 操作`
      });
    } catch (error) {
      console.error('權限檢查錯誤:', error);
      return res.status(500).json({
        success: false,
        message: '權限檢查失敗'
      });
    }
  };
};

/**
 * 獲取用戶可管理的角色列表
 * @param {string} userRole - 用戶角色
 * @returns {Array} 可管理的角色列表
 */
const getManageableRoles = (userRole) => {
  const userLevel = ROLE_HIERARCHY[userRole];
  const manageableRoles = [];

  for (const [role, level] of Object.entries(ROLE_HIERARCHY)) {
    if (level < userLevel) {
      manageableRoles.push({
        value: role,
        name: ROLE_NAMES[role],
        level: level
      });
    }
  }

  return manageableRoles;
};

/**
 * 檢查角色是否有效
 * @param {string} role - 角色名稱
 * @returns {boolean} 是否有效
 */
const isValidRole = (role) => {
  return ROLE_HIERARCHY.hasOwnProperty(role);
};

/**
 * 比較兩個角色的權限等級
 * @param {string} role1 - 角色1
 * @param {string} role2 - 角色2
 * @returns {number} 比較結果 (-1: role1 < role2, 0: 相等, 1: role1 > role2)
 */
const compareRoles = (role1, role2) => {
  const level1 = ROLE_HIERARCHY[role1] || 0;
  const level2 = ROLE_HIERARCHY[role2] || 0;
  return level1 - level2;
};

module.exports = {
  requireRole,
  canManageUser,
  requirePermission,
  getManageableRoles,
  isValidRole,
  compareRoles,
  ROLE_HIERARCHY,
  ROLE_NAMES
};
