const { User } = require('../models');
const { getManageableRoles, isValidRole, compareRoles } = require('../middleware/roleAuth');
const bcrypt = require('bcryptjs');

class UserController {
  /**
   * 獲取用戶列表（根據權限過濾）
   */
  static async getUserList(req, res) {
    try {
      const currentUser = req.session.user;
      const { page = 1, limit = 10, role, search } = req.query;
      const offset = (page - 1) * limit;

      let whereClause = {};
      
      // 根據當前用戶角色過濾可查看的用戶
      if (currentUser.role !== 'system_admin') {
        // 非系統管理員只能查看下級用戶
        const manageableRoles = getManageableRoles(currentUser.role);
        const roleValues = manageableRoles.map(r => r.value);
        whereClause.role = roleValues;
      }

      // 角色篩選
      if (role && isValidRole(role)) {
        whereClause.role = role;
      }

      // 搜尋功能
      if (search) {
        whereClause[Op.or] = [
          { username: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { firstName: { [Op.like]: `%${search}%` } },
          { lastName: { [Op.like]: `%${search}%` } }
        ];
      }

      const { count, rows: users } = await User.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ['password'] },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      console.error('獲取用戶列表錯誤:', error);
      res.status(500).json({
        success: false,
        message: '獲取用戶列表失敗'
      });
    }
  }

  /**
   * 創建新用戶
   */
  static async createUser(req, res) {
    try {
      const currentUser = req.session.user;
      const { username, email, password, firstName, lastName, role, parentUserId } = req.body;

      // 驗證角色權限
      if (!isValidRole(role)) {
        return res.status(400).json({
          success: false,
          message: '無效的角色'
        });
      }

      const manageableRoles = getManageableRoles(currentUser.role);
      const canCreateRole = manageableRoles.some(r => r.value === role);
      
      if (!canCreateRole) {
        return res.status(403).json({
          success: false,
          message: '無權限創建此角色的用戶'
        });
      }

      // 檢查用戶名和郵箱是否已存在
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }]
        }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: '用戶名或郵箱已存在'
        });
      }

      // 加密密碼
      const hashedPassword = await bcrypt.hash(password, 12);

      // 創建用戶
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        parentUserId: parentUserId || currentUser.id,
        isActive: true
      });

      // 返回用戶信息（不包含密碼）
      const userResponse = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        parentUserId: newUser.parentUserId,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt
      };

      res.status(201).json({
        success: true,
        message: '用戶創建成功',
        data: userResponse
      });
    } catch (error) {
      console.error('創建用戶錯誤:', error);
      res.status(500).json({
        success: false,
        message: '創建用戶失敗'
      });
    }
  }

  /**
   * 更新用戶信息
   */
  static async updateUser(req, res) {
    try {
      const currentUser = req.session.user;
      const { userId } = req.params;
      const updateData = req.body;

      // 查找目標用戶
      const targetUser = await User.findByPk(userId);
      if (!targetUser) {
        return res.status(404).json({
          success: false,
          message: '用戶不存在'
        });
      }

      // 設置目標用戶到請求對象（用於權限檢查）
      req.targetUser = targetUser;

      // 檢查權限（使用中間件）
      // 這裡需要手動調用權限檢查邏輯
      if (currentUser.role !== 'system_admin') {
        const currentUserLevel = compareRoles(currentUser.role, targetUser.role);
        if (currentUserLevel <= 0) {
          return res.status(403).json({
            success: false,
            message: '無權限修改此用戶'
          });
        }
      }

      // 如果要更新角色，檢查權限
      if (updateData.role && updateData.role !== targetUser.role) {
        if (!isValidRole(updateData.role)) {
          return res.status(400).json({
            success: false,
            message: '無效的角色'
          });
        }

        const manageableRoles = getManageableRoles(currentUser.role);
        const canUpdateRole = manageableRoles.some(r => r.value === updateData.role);
        
        if (!canUpdateRole) {
          return res.status(403).json({
            success: false,
            message: '無權限設置此角色'
          });
        }
      }

      // 如果要更新密碼，進行加密
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 12);
      }

      // 更新用戶
      await targetUser.update(updateData);

      // 返回更新後的用戶信息（不包含密碼）
      const updatedUser = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });

      res.json({
        success: true,
        message: '用戶更新成功',
        data: updatedUser
      });
    } catch (error) {
      console.error('更新用戶錯誤:', error);
      res.status(500).json({
        success: false,
        message: '更新用戶失敗'
      });
    }
  }

  /**
   * 刪除用戶
   */
  static async deleteUser(req, res) {
    try {
      const currentUser = req.session.user;
      const { userId } = req.params;

      // 查找目標用戶
      const targetUser = await User.findByPk(userId);
      if (!targetUser) {
        return res.status(404).json({
          success: false,
          message: '用戶不存在'
        });
      }

      // 檢查權限
      if (currentUser.role !== 'system_admin') {
        const currentUserLevel = compareRoles(currentUser.role, targetUser.role);
        if (currentUserLevel <= 0) {
          return res.status(403).json({
            success: false,
            message: '無權限刪除此用戶'
          });
        }
      }

      // 軟刪除（設置為不活躍）
      await targetUser.update({ isActive: false });

      res.json({
        success: true,
        message: '用戶已停用'
      });
    } catch (error) {
      console.error('刪除用戶錯誤:', error);
      res.status(500).json({
        success: false,
        message: '刪除用戶失敗'
      });
    }
  }

  /**
   * 獲取用戶詳情
   */
  static async getUserDetail(req, res) {
    try {
      const { userId } = req.params;
      const currentUser = req.session.user;

      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用戶不存在'
        });
      }

      // 檢查權限
      if (currentUser.role !== 'system_admin') {
        const currentUserLevel = compareRoles(currentUser.role, user.role);
        if (currentUserLevel <= 0) {
          return res.status(403).json({
            success: false,
            message: '無權限查看此用戶信息'
          });
        }
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('獲取用戶詳情錯誤:', error);
      res.status(500).json({
        success: false,
        message: '獲取用戶詳情失敗'
      });
    }
  }

  /**
   * 獲取可管理的角色列表
   */
  static async getManageableRoles(req, res) {
    try {
      const currentUser = req.session.user;
      const manageableRoles = getManageableRoles(currentUser.role);

      res.json({
        success: true,
        data: manageableRoles
      });
    } catch (error) {
      console.error('獲取可管理角色錯誤:', error);
      res.status(500).json({
        success: false,
        message: '獲取角色列表失敗'
      });
    }
  }

  /**
   * 獲取用戶統計信息
   */
  static async getUserStats(req, res) {
    try {
      const currentUser = req.session.user;
      
      let whereClause = {};
      if (currentUser.role !== 'system_admin') {
        const manageableRoles = getManageableRoles(currentUser.role);
        const roleValues = manageableRoles.map(r => r.value);
        whereClause.role = roleValues;
      }

      const totalUsers = await User.count({ where: whereClause });
      const activeUsers = await User.count({ 
        where: { ...whereClause, isActive: true } 
      });

      // 按角色統計
      const roleStats = await User.findAll({
        where: whereClause,
        attributes: [
          'role',
          [User.sequelize.fn('COUNT', User.sequelize.col('id')), 'count']
        ],
        group: ['role']
      });

      res.json({
        success: true,
        data: {
          totalUsers,
          activeUsers,
          inactiveUsers: totalUsers - activeUsers,
          roleStats
        }
      });
    } catch (error) {
      console.error('獲取用戶統計錯誤:', error);
      res.status(500).json({
        success: false,
        message: '獲取統計信息失敗'
      });
    }
  }
}

module.exports = UserController;
