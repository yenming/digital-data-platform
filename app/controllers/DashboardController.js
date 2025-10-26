const { Platform, PlatformConnection, Dashboard, Widget, DataMetric } = require('../models');
const { validationResult } = require('express-validator');

class DashboardController {
  // 儀表板首頁
  static async index(req, res) {
    try {
      const userId = req.session.user.id;
      const userRole = req.session.user.role;
      
      // 根據用戶角色重定向到相應的儀表板
      if (userRole === 'system_admin') {
        return res.redirect('/dashboard/admin');
      }
      
      // 簡化版本 - 直接渲染儀表板頁面
      res.render('dashboard/index', {
        title: '數據儀表板',
        user: req.session.user,
        message: '歡迎使用全媒體數據儀表板！'
      });
    } catch (error) {
      console.error('儀表板首頁錯誤:', error);
      req.flash('error_msg', '載入儀表板失敗');
      res.redirect('/auth/login');
    }
  }

  // 平台管理頁面
  static async platforms(req, res) {
    try {
      const userId = req.session.user.id;
      
      // 獲取所有可用平台
      const availablePlatforms = await Platform.findAll({
        where: { isActive: true },
        order: [['type', 'ASC'], ['displayName', 'ASC']]
      });
      
      // 獲取用戶已連接的平台
      const userConnections = await PlatformConnection.findAll({
        where: { userId },
        include: [{ model: Platform, as: 'platform' }],
        order: [['createdAt', 'DESC']]
      });
      
      res.render('dashboard/platforms', {
        title: '平台管理',
        availablePlatforms,
        userConnections
      });
    } catch (error) {
      console.error('平台管理頁面錯誤:', error);
      req.flash('error_msg', '載入平台管理頁面失敗');
      res.redirect('/dashboard');
    }
  }

  // 連接新平台
  static async connectPlatform(req, res) {
    try {
      const userId = req.session.user.id;
      const { platformId, accountId, accountName, accessToken, refreshToken, config } = req.body;
      
      // 驗證輸入
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('error_msg', '請檢查輸入資料');
        return res.redirect('/dashboard/platforms');
      }
      
      // 檢查是否已存在相同平台的連接
      const existingConnection = await PlatformConnection.findOne({
        where: { userId, platformId, accountId }
      });
      
      if (existingConnection) {
        req.flash('error_msg', '此平台帳戶已連接');
        return res.redirect('/dashboard/platforms');
      }
      
      // 創建新連接
      const connection = await PlatformConnection.create({
        userId,
        platformId,
        accountId,
        accountName,
        accessToken,
        refreshToken,
        config: config ? JSON.parse(config) : null,
        syncStatus: 'pending'
      });
      
      req.flash('success_msg', '平台連接成功');
      res.redirect('/dashboard/platforms');
    } catch (error) {
      console.error('連接平台錯誤:', error);
      req.flash('error_msg', '連接平台失敗');
      res.redirect('/dashboard/platforms');
    }
  }

  // 斷開平台連接
  static async disconnectPlatform(req, res) {
    try {
      const userId = req.session.user.id;
      const { connectionId } = req.params;
      
      const connection = await PlatformConnection.findOne({
        where: { id: connectionId, userId }
      });
      
      if (!connection) {
        req.flash('error_msg', '找不到指定的平台連接');
        return res.redirect('/dashboard/platforms');
      }
      
      // 刪除相關數據指標
      await DataMetric.destroy({
        where: { connectionId }
      });
      
      // 刪除連接
      await connection.destroy();
      
      req.flash('success_msg', '平台連接已斷開');
      res.redirect('/dashboard/platforms');
    } catch (error) {
      console.error('斷開平台連接錯誤:', error);
      req.flash('error_msg', '斷開平台連接失敗');
      res.redirect('/dashboard/platforms');
    }
  }

  // 同步平台數據
  static async syncPlatform(req, res) {
    try {
      const userId = req.session.user.id;
      const { connectionId } = req.params;
      const { startDate, endDate } = req.body;
      
      const connection = await PlatformConnection.findOne({
        where: { id: connectionId, userId },
        include: [{ model: Platform, as: 'platform' }]
      });
      
      if (!connection) {
        return res.json({ success: false, message: '找不到指定的平台連接' });
      }
      
      // 更新同步狀態
      await connection.update({ syncStatus: 'pending' });
      
      // 執行同步
      const dateRange = {
        startDate: startDate || moment().subtract(30, 'days').format('YYYY-MM-DD'),
        endDate: endDate || moment().format('YYYY-MM-DD')
      };
      
      const result = await PlatformService.syncAllPlatforms(userId, dateRange);
      
      res.json(result);
    } catch (error) {
      console.error('同步平台數據錯誤:', error);
      res.json({ success: false, message: '同步失敗' });
    }
  }

  // 數據報表頁面
  static async reports(req, res) {
    try {
      const userId = req.session.user.id;
      const { 
        startDate, 
        endDate, 
        platforms, 
        metrics, 
        format = 'table' 
      } = req.query;
      
      // 獲取用戶的平台連接
      const userConnections = await PlatformConnection.findAll({
        where: { userId, isActive: true },
        include: [{ model: Platform, as: 'platform' }]
      });
      
      // 獲取報表數據
      const filters = {
        dateRange: { startDate, endDate },
        platforms: platforms ? platforms.split(',') : null,
        metrics: metrics ? metrics.split(',') : null
      };
      
      const reportData = await AnalyticsService.getDataReport(userId, filters);
      
      res.render('dashboard/reports', {
        title: '數據報表',
        userConnections,
        reportData,
        filters,
        currentFormat: format
      });
    } catch (error) {
      console.error('數據報表頁面錯誤:', error);
      req.flash('error_msg', '載入數據報表失敗');
      res.redirect('/dashboard');
    }
  }

  // 導出數據
  static async exportData(req, res) {
    try {
      const userId = req.session.user.id;
      const { format, startDate, endDate, platforms, metrics } = req.query;
      
      const filters = {
        dateRange: { startDate, endDate },
        platforms: platforms ? platforms.split(',') : null,
        metrics: metrics ? metrics.split(',') : null
      };
      
      const data = await AnalyticsService.exportData(userId, format, filters);
      
      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="data-export-${Date.now()}.csv"`);
        res.send(data);
      } else if (format === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="data-export-${Date.now()}.json"`);
        res.send(data);
      } else {
        res.status(400).json({ error: '不支援的導出格式' });
      }
    } catch (error) {
      console.error('導出數據錯誤:', error);
      res.status(500).json({ error: '導出數據失敗' });
    }
  }

  // 自定義儀表板
  static async customDashboard(req, res) {
    try {
      const userId = req.session.user.id;
      const { dashboardId } = req.params;
      
      let dashboard;
      if (dashboardId) {
        dashboard = await Dashboard.findOne({
          where: { id: dashboardId, userId },
          include: [{
            model: Widget,
            as: 'widgets',
            order: [['sortOrder', 'ASC']]
          }]
        });
      } else {
        // 獲取預設儀表板
        dashboard = await Dashboard.findOne({
          where: { userId, isDefault: true },
          include: [{
            model: Widget,
            as: 'widgets',
            order: [['sortOrder', 'ASC']]
          }]
        });
      }
      
      if (!dashboard) {
        req.flash('error_msg', '找不到指定的儀表板');
        return res.redirect('/dashboard');
      }
      
      res.render('dashboard/custom', {
        title: dashboard.name,
        dashboard
      });
    } catch (error) {
      console.error('自定義儀表板錯誤:', error);
      req.flash('error_msg', '載入自定義儀表板失敗');
      res.redirect('/dashboard');
    }
  }

  // 創建自定義儀表板
  static async createDashboard(req, res) {
    try {
      const userId = req.session.user.id;
      const { name, description, layout, filters } = req.body;
      
      const dashboard = await Dashboard.create({
        userId,
        name,
        description,
        layout: layout ? JSON.parse(layout) : null,
        filters: filters ? JSON.parse(filters) : null
      });
      
      req.flash('success_msg', '儀表板創建成功');
      res.redirect(`/dashboard/custom/${dashboard.id}`);
    } catch (error) {
      console.error('創建儀表板錯誤:', error);
      req.flash('error_msg', '創建儀表板失敗');
      res.redirect('/dashboard');
    }
  }

  // API: 獲取實時數據
  static async getRealtimeData(req, res) {
    try {
      const userId = req.session.user.id;
      const { platformId, metricName, hours = 24 } = req.query;
      
      const startTime = moment().subtract(hours, 'hours');
      const endTime = moment();
      
      let whereClause = {
        userId,
        date: {
          [require('sequelize').Op.between]: [startTime.format('YYYY-MM-DD'), endTime.format('YYYY-MM-DD')]
        }
      };
      
      if (platformId) {
        whereClause.connectionId = platformId;
      }
      
      if (metricName) {
        whereClause.metricName = metricName;
      }
      
      const data = await DataMetric.findAll({
        where: whereClause,
        include: [{
          model: PlatformConnection,
          as: 'connection',
          include: [{ model: Platform, as: 'platform' }]
        }],
        order: [['date', 'ASC'], ['createdAt', 'ASC']]
      });
      
      res.json({
        success: true,
        data: this.formatRealtimeData(data)
      });
    } catch (error) {
      console.error('獲取實時數據錯誤:', error);
      res.json({ success: false, message: '獲取實時數據失敗' });
    }
  }

  // 輔助方法：格式化實時數據
  formatRealtimeData(data) {
    const formatted = {};
    
    data.forEach(item => {
      const key = `${item.connection.platform.displayName}_${item.metricName}`;
      if (!formatted[key]) {
        formatted[key] = {
          platform: item.connection.platform.displayName,
          metric: item.metricName,
          type: item.metricType,
          data: []
        };
      }
      
      formatted[key].data.push({
        date: item.date,
        value: item.metricValue,
        timestamp: item.createdAt
      });
    });
    
    return Object.values(formatted);
  }
}

module.exports = DashboardController;
