const { DataMetric, PlatformConnection, Platform } = require('../models');
const moment = require('moment');

class AnalyticsService {
  // 獲取儀表板總覽數據
  async getDashboardOverview(userId, dateRange = {}) {
    const { startDate, endDate } = this.getDateRange(dateRange);
    
    try {
      const connections = await PlatformConnection.findAll({
        where: { userId, isActive: true },
        include: [{ model: Platform, as: 'platform' }]
      });

      const overview = {
        totalPlatforms: connections.length,
        activeConnections: connections.filter(c => c.syncStatus === 'success').length,
        lastSyncTime: null,
        totalMetrics: 0,
        platforms: []
      };

      for (const connection of connections) {
        const metrics = await DataMetric.findAll({
          where: {
            connectionId: connection.id,
            date: {
              [require('sequelize').Op.between]: [startDate, endDate]
            }
          },
          order: [['date', 'DESC']]
        });

        const platformData = {
          id: connection.id,
          name: connection.platform.displayName,
          type: connection.platform.type,
          icon: connection.platform.icon,
          color: connection.platform.color,
          status: connection.syncStatus,
          lastSync: connection.lastSyncAt,
          metricsCount: metrics.length,
          keyMetrics: this.extractKeyMetrics(metrics)
        };

        overview.platforms.push(platformData);
        overview.totalMetrics += metrics.length;
        
        if (connection.lastSyncAt && (!overview.lastSyncTime || connection.lastSyncAt > overview.lastSyncTime)) {
          overview.lastSyncTime = connection.lastSyncAt;
        }
      }

      return overview;
    } catch (error) {
      console.error('獲取儀表板總覽失敗:', error);
      throw error;
    }
  }

  // 獲取平台數據趨勢
  async getPlatformTrends(userId, platformId, dateRange = {}) {
    const { startDate, endDate } = this.getDateRange(dateRange);
    
    try {
      const metrics = await DataMetric.findAll({
        where: {
          connectionId: platformId,
          date: {
            [require('sequelize').Op.between]: [startDate, endDate]
          }
        },
        order: [['date', 'ASC']]
      });

      const trends = this.groupMetricsByDate(metrics);
      return trends;
    } catch (error) {
      console.error('獲取平台趨勢失敗:', error);
      throw error;
    }
  }

  // 獲取跨平台比較數據
  async getCrossPlatformComparison(userId, dateRange = {}) {
    const { startDate, endDate } = this.getDateRange(dateRange);
    
    try {
      const connections = await PlatformConnection.findAll({
        where: { userId, isActive: true },
        include: [{ model: Platform, as: 'platform' }]
      });

      const comparison = [];

      for (const connection of connections) {
        const metrics = await DataMetric.findAll({
          where: {
            connectionId: connection.id,
            date: {
              [require('sequelize').Op.between]: [startDate, endDate]
            }
          }
        });

        const platformMetrics = this.aggregateMetrics(metrics);
        comparison.push({
          platform: connection.platform.displayName,
          type: connection.platform.type,
          icon: connection.platform.icon,
          color: connection.platform.color,
          metrics: platformMetrics
        });
      }

      return comparison;
    } catch (error) {
      console.error('獲取跨平台比較失敗:', error);
      throw error;
    }
  }

  // 獲取關鍵指標KPI
  async getKPIs(userId, dateRange = {}) {
    const { startDate, endDate } = this.getDateRange(dateRange);
    
    try {
      const connections = await PlatformConnection.findAll({
        where: { userId, isActive: true },
        include: [{ model: Platform, as: 'platform' }]
      });

      const kpis = {
        totalImpressions: 0,
        totalClicks: 0,
        totalSpend: 0,
        averageCTR: 0,
        averageCPC: 0,
        totalReach: 0,
        totalSessions: 0,
        totalUsers: 0
      };

      for (const connection of connections) {
        const metrics = await DataMetric.findAll({
          where: {
            connectionId: connection.id,
            date: {
              [require('sequelize').Op.between]: [startDate, endDate]
            }
          }
        });

        const aggregated = this.aggregateMetrics(metrics);
        
        kpis.totalImpressions += aggregated.impressions || 0;
        kpis.totalClicks += aggregated.clicks || 0;
        kpis.totalSpend += aggregated.spend || 0;
        kpis.totalReach += aggregated.reach || 0;
        kpis.totalSessions += aggregated.sessions || 0;
        kpis.totalUsers += aggregated.users || 0;
      }

      // 計算平均值
      kpis.averageCTR = kpis.totalImpressions > 0 ? (kpis.totalClicks / kpis.totalImpressions) * 100 : 0;
      kpis.averageCPC = kpis.totalClicks > 0 ? kpis.totalSpend / kpis.totalClicks : 0;

      return kpis;
    } catch (error) {
      console.error('獲取KPI失敗:', error);
      throw error;
    }
  }

  // 獲取數據報表
  async getDataReport(userId, filters = {}) {
    const { startDate, endDate } = this.getDateRange(filters.dateRange);
    const { platforms, metrics, dimensions } = filters;
    
    try {
      let whereClause = {
        date: {
          [require('sequelize').Op.between]: [startDate, endDate]
        }
      };

      // 平台篩選
      if (platforms && platforms.length > 0) {
        const connections = await PlatformConnection.findAll({
          where: { 
            userId, 
            id: platforms,
            isActive: true 
          }
        });
        whereClause.connectionId = connections.map(c => c.id);
      }

      // 指標篩選
      if (metrics && metrics.length > 0) {
        whereClause.metricName = metrics;
      }

      const data = await DataMetric.findAll({
        where: whereClause,
        include: [{
          model: PlatformConnection,
          as: 'connection',
          include: [{ model: Platform, as: 'platform' }]
        }],
        order: [['date', 'DESC'], ['metricName', 'ASC']]
      });

      return this.formatReportData(data, dimensions);
    } catch (error) {
      console.error('獲取數據報表失敗:', error);
      throw error;
    }
  }

  // 導出數據
  async exportData(userId, format = 'csv', filters = {}) {
    try {
      const data = await this.getDataReport(userId, filters);
      
      if (format === 'csv') {
        return this.exportToCSV(data);
      } else if (format === 'json') {
        return this.exportToJSON(data);
      } else {
        throw new Error('不支援的導出格式');
      }
    } catch (error) {
      console.error('導出數據失敗:', error);
      throw error;
    }
  }

  // 輔助方法：獲取日期範圍
  getDateRange(dateRange) {
    const now = moment();
    let startDate, endDate;

    if (dateRange.startDate && dateRange.endDate) {
      startDate = moment(dateRange.startDate).format('YYYY-MM-DD');
      endDate = moment(dateRange.endDate).format('YYYY-MM-DD');
    } else if (dateRange.period) {
      switch (dateRange.period) {
        case '7d':
          startDate = now.subtract(7, 'days').format('YYYY-MM-DD');
          endDate = now.format('YYYY-MM-DD');
          break;
        case '30d':
          startDate = now.subtract(30, 'days').format('YYYY-MM-DD');
          endDate = now.format('YYYY-MM-DD');
          break;
        case '90d':
          startDate = now.subtract(90, 'days').format('YYYY-MM-DD');
          endDate = now.format('YYYY-MM-DD');
          break;
        default:
          startDate = now.subtract(30, 'days').format('YYYY-MM-DD');
          endDate = now.format('YYYY-MM-DD');
      }
    } else {
      startDate = now.subtract(30, 'days').format('YYYY-MM-DD');
      endDate = now.format('YYYY-MM-DD');
    }

    return { startDate, endDate };
  }

  // 輔助方法：提取關鍵指標
  extractKeyMetrics(metrics) {
    const keyMetrics = {};
    
    metrics.forEach(metric => {
      if (!keyMetrics[metric.metricName]) {
        keyMetrics[metric.metricName] = {
          total: 0,
          average: 0,
          latest: 0,
          type: metric.metricType
        };
      }
      
      keyMetrics[metric.metricName].total += metric.metricValue;
      keyMetrics[metric.metricName].latest = metric.metricValue;
    });

    // 計算平均值
    Object.keys(keyMetrics).forEach(key => {
      keyMetrics[key].average = keyMetrics[key].total / metrics.length;
    });

    return keyMetrics;
  }

  // 輔助方法：按日期分組指標
  groupMetricsByDate(metrics) {
    const grouped = {};
    
    metrics.forEach(metric => {
      if (!grouped[metric.date]) {
        grouped[metric.date] = {};
      }
      grouped[metric.date][metric.metricName] = metric.metricValue;
    });

    return Object.keys(grouped).map(date => ({
      date,
      metrics: grouped[date]
    }));
  }

  // 輔助方法：聚合指標
  aggregateMetrics(metrics) {
    const aggregated = {};
    
    metrics.forEach(metric => {
      if (!aggregated[metric.metricName]) {
        aggregated[metric.metricName] = 0;
      }
      aggregated[metric.metricName] += metric.metricValue;
    });

    return aggregated;
  }

  // 輔助方法：格式化報表數據
  formatReportData(data, dimensions = []) {
    const formatted = data.map(item => {
      const row = {
        date: item.date,
        platform: item.connection.platform.displayName,
        metric: item.metricName,
        value: item.metricValue,
        type: item.metricType
      };

      if (dimensions.includes('dimension1') && item.dimension1) {
        row.dimension1 = item.dimension1;
      }
      if (dimensions.includes('dimension2') && item.dimension2) {
        row.dimension2 = item.dimension2;
      }
      if (dimensions.includes('dimension3') && item.dimension3) {
        row.dimension3 = item.dimension3;
      }

      return row;
    });

    return formatted;
  }

  // 輔助方法：導出為CSV
  exportToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    return csvContent;
  }

  // 輔助方法：導出為JSON
  exportToJSON(data) {
    return JSON.stringify(data, null, 2);
  }
}

module.exports = new AnalyticsService();
