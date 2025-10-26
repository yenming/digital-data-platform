const { User, Platform, PlatformConnection, DataMetric, Dashboard, Widget } = require('../models');
const bcrypt = require('bcryptjs');
const { canManageUser, roleHierarchy } = require('../middleware/roleAuth');

class AdminController {
  /**
   * 系統管理員儀表板首頁
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  static async getAdminDashboard(req, res) {
    try {
      const currentUser = req.session.user;

      // 獲取統計數據
      const totalUsers = await User.count();
      const activeUsers = await User.count({ where: { isActive: true } });
      
      // 暫時跳過平台相關的統計，因為表可能不存在
      let totalPlatforms = 0;
      let totalConnections = 0;
      
      try {
        totalPlatforms = await Platform.count({ where: { isActive: true } });
      } catch (error) {
        console.log('Platform 表不存在或查詢失敗:', error.message);
      }
      
      try {
        totalConnections = await PlatformConnection.count({ where: { isActive: true } });
      } catch (error) {
        console.log('PlatformConnection 表不存在或查詢失敗:', error.message);
        totalConnections = 0;
      }

      // 獲取最近登入的用戶
      const recentUsers = await User.findAll({
        where: { lastLogin: { [require('sequelize').Op.not]: null } },
        order: [['lastLogin', 'DESC']],
        limit: 10,
        attributes: ['id', 'username', 'role', 'lastLogin']
      });

      // 獲取各角色用戶統計
      const roleStats = await User.findAll({
        attributes: [
          'role',
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
        ],
        group: ['role'],
        raw: true
      });

      res.render('dashboard/admin', {
        title: '系統管理員儀表板',
        user: currentUser,
        stats: {
          totalUsers,
          activeUsers,
          totalPlatforms,
          totalConnections
        },
        recentUsers,
        roleStats
      });
    } catch (error) {
      console.error('獲取系統管理員儀表板失敗:', error);
      req.flash('error_msg', '無法載入儀表板數據');
      res.redirect('/dashboard');
    }
  }

  /**
   * 用戶資料設定頁面
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  static async getProfileSettings(req, res) {
    try {
      const currentUser = req.session.user;
      
      res.render('dashboard/admin/profile', {
        title: '用戶資料設定',
        user: currentUser
      });
    } catch (error) {
      console.error('獲取用戶資料設定頁面失敗:', error);
      req.flash('error_msg', '無法載入用戶資料設定頁面');
      res.redirect('/dashboard/admin');
    }
  }

  /**
   * 更新用戶資料
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  static async updateProfile(req, res) {
    try {
      const { username, email, firstName, lastName } = req.body;
      const currentUser = req.session.user;

      await User.update({
        username,
        email,
        firstName,
        lastName
      }, {
        where: { id: currentUser.id }
      });

      // 更新 session 中的用戶信息
      req.session.user = {
        ...req.session.user,
        username,
        email,
        firstName,
        lastName
      };

      req.flash('success_msg', '用戶資料更新成功！');
      res.redirect('/dashboard/admin/profile');
    } catch (error) {
      console.error('更新用戶資料失敗:', error);
      req.flash('error_msg', `更新用戶資料失敗: ${error.message}`);
      res.redirect('/dashboard/admin/profile');
    }
  }

  /**
   * 系統管理員管理頁面
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  static async getSystemAdmins(req, res) {
    try {
      const systemAdmins = await User.findAll({
        where: { role: 'system_admin' },
        attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'isActive', 'createdAt', 'lastLogin'],
        order: [['createdAt', 'DESC']]
      });

      res.render('dashboard/admin/system-admins', {
        title: '系統管理員管理',
        users: systemAdmins,
        roleType: 'system_admin',
        roleName: '系統管理員'
      });
    } catch (error) {
      console.error('獲取系統管理員列表失敗:', error);
      req.flash('error_msg', '無法載入系統管理員列表');
      res.redirect('/dashboard/admin');
    }
  }

  /**
   * 代理商管理頁面
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  static async getAgents(req, res) {
    try {
      const agents = await User.findAll({
        where: { role: 'agent' },
        attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'parentUserId', 'isActive', 'createdAt', 'lastLogin'],
        include: [{
          model: User,
          as: 'ParentUser',
          attributes: ['username', 'email']
        }],
        order: [['createdAt', 'DESC']]
      });

      res.render('dashboard/admin/agents', {
        title: '代理商管理',
        users: agents,
        roleType: 'agent',
        roleName: '代理商'
      });
    } catch (error) {
      console.error('獲取代理商列表失敗:', error);
      req.flash('error_msg', '無法載入代理商列表');
      res.redirect('/dashboard/admin');
    }
  }

  /**
   * 品牌管理頁面
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  static async getBrands(req, res) {
    try {
      const brands = await User.findAll({
        where: { role: 'brand' },
        attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'parentUserId', 'isActive', 'createdAt', 'lastLogin'],
        include: [{
          model: User,
          as: 'ParentUser',
          attributes: ['username', 'email']
        }],
        order: [['createdAt', 'DESC']]
      });

      res.render('dashboard/admin/brands', {
        title: '品牌管理',
        users: brands,
        roleType: 'brand',
        roleName: '品牌'
      });
    } catch (error) {
      console.error('獲取品牌列表失敗:', error);
      req.flash('error_msg', '無法載入品牌列表');
      res.redirect('/dashboard/admin');
    }
  }

  /**
   * 個人經營管理頁面
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  static async getIndividuals(req, res) {
    try {
      const individuals = await User.findAll({
        where: { role: 'individual' },
        attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'parentUserId', 'isActive', 'createdAt', 'lastLogin'],
        include: [{
          model: User,
          as: 'ParentUser',
          attributes: ['username', 'email']
        }],
        order: [['createdAt', 'DESC']]
      });

      res.render('dashboard/admin/individuals', {
        title: '個人經營管理',
        users: individuals,
        roleType: 'individual',
        roleName: '個人經營'
      });
    } catch (error) {
      console.error('獲取個人經營列表失敗:', error);
      req.flash('error_msg', '無法載入個人經營列表');
      res.redirect('/dashboard/admin');
    }
  }

  /**
   * 創建新用戶
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  static async createUser(req, res) {
    try {
      const { username, email, password, role, firstName, lastName, parentUserId } = req.body;
      const currentUser = req.session.user;

      // 檢查當前用戶是否有權限創建此角色
      const currentUserRoleLevel = roleHierarchy[currentUser.role];
      const targetRoleLevel = roleHierarchy[role];

      if (targetRoleLevel >= currentUserRoleLevel && currentUser.role !== 'system_admin') {
        req.flash('error_msg', '您沒有權限創建此角色的用戶。');
        return res.redirect('/dashboard/admin');
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      await User.create({
        username,
        email,
        password: hashedPassword,
        role,
        firstName,
        lastName,
        parentUserId: parentUserId || currentUser.id,
        isActive: true,
        emailVerified: false,
      });

      req.flash('success_msg', '用戶創建成功！');
      res.redirect(`/dashboard/admin/${role}s`);
    } catch (error) {
      console.error('創建用戶失敗:', error);
      req.flash('error_msg', `創建用戶失敗: ${error.message}`);
      res.redirect('/dashboard/admin');
    }
  }

  /**
   * 更新用戶信息
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  static async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const { username, email, role, firstName, lastName, isActive } = req.body;
      const currentUser = req.session.user;

      const user = await User.findByPk(userId);

      if (!user) {
        req.flash('error_msg', '找不到該用戶。');
        return res.redirect('/dashboard/admin');
      }

      // 檢查當前用戶是否有權限管理此用戶
      if (!canManageUser(user, currentUser)) {
        req.flash('error_msg', '您沒有權限更新此用戶。');
        return res.redirect('/dashboard/admin');
      }

      await user.update({
        username,
        email,
        role,
        firstName,
        lastName,
        isActive: isActive === 'on' ? true : false,
      });

      req.flash('success_msg', '用戶更新成功！');
      res.redirect(`/dashboard/admin/${user.role}s`);
    } catch (error) {
      console.error('更新用戶失敗:', error);
      req.flash('error_msg', `更新用戶失敗: ${error.message}`);
      res.redirect('/dashboard/admin');
    }
  }

  /**
   * 刪除用戶
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  static async deleteUser(req, res) {
    try {
      const { userId } = req.params;
      const currentUser = req.session.user;

      const user = await User.findByPk(userId);

      if (!user) {
        req.flash('error_msg', '找不到該用戶。');
        return res.redirect('/dashboard/admin');
      }

      // 檢查當前用戶是否有權限刪除此用戶
      if (!canManageUser(user, currentUser)) {
        req.flash('error_msg', '您沒有權限刪除此用戶。');
        return res.redirect('/dashboard/admin');
      }

      await user.destroy();

      req.flash('success_msg', '用戶刪除成功！');
      res.redirect(`/dashboard/admin/${user.role}s`);
    } catch (error) {
      console.error('刪除用戶失敗:', error);
      req.flash('error_msg', `刪除用戶失敗: ${error.message}`);
      res.redirect('/dashboard/admin');
    }
  }

  /**
   * 獲取可管理的角色列表
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  static async getManageableRoles(req, res) {
    try {
      const currentUser = req.session.user;
      const manageableRoles = [];
      const currentUserRoleLevel = roleHierarchy[currentUser.role];

      for (const role in roleHierarchy) {
        if (roleHierarchy[role] < currentUserRoleLevel) {
          manageableRoles.push(role);
        }
      }
      res.json({ manageableRoles });
    } catch (error) {
      console.error('獲取可管理角色列表失敗:', error);
      res.status(500).json({ error: '無法獲取可管理角色列表' });
    }
  }

  /**
   * 獲取用戶統計信息
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  static async getUserStats(req, res) {
    try {
      const totalUsers = await User.count();
      const activeUsers = await User.count({ where: { isActive: true } });
      const inactiveUsers = await User.count({ where: { isActive: false } });

      // 按角色統計
      const roleStats = await User.findAll({
        attributes: [
          'role',
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
        ],
        group: ['role'],
        raw: true
      });

      res.json({ 
        totalUsers, 
        activeUsers, 
        inactiveUsers,
        roleStats 
      });
    } catch (error) {
      console.error('獲取用戶統計失敗:', error);
      res.status(500).json({ error: '無法獲取用戶統計信息' });
    }
  }
}

module.exports = AdminController;
