const axios = require('axios');
const moment = require('moment');
const { Platform, PlatformConnection, DataMetric } = require('../models');

class PlatformService {
  constructor() {
    this.platforms = new Map();
    this.initializePlatforms();
  }

  // 初始化平台配置
  async initializePlatforms() {
    try {
      const platforms = await Platform.findAll({ where: { isActive: true } });
      platforms.forEach(platform => {
        this.platforms.set(platform.name, platform);
      });
    } catch (error) {
      console.error('初始化平台配置失敗:', error);
    }
  }

  // 獲取平台配置
  getPlatformConfig(platformName) {
    return this.platforms.get(platformName);
  }

  // 通用API請求方法
  async makeApiRequest(url, options = {}) {
    try {
      const response = await axios({
        url,
        method: options.method || 'GET',
        headers: options.headers || {},
        params: options.params || {},
        data: options.data || {},
        timeout: 30000
      });
      return response.data;
    } catch (error) {
      console.error('API請求失敗:', error.message);
      throw error;
    }
  }

  // Meta Ads API 整合
  async fetchMetaAdsData(connection, dateRange) {
    const { accessToken, accountId } = connection;
    const { startDate, endDate } = dateRange;
    
    try {
      const url = `https://graph.facebook.com/v18.0/${accountId}/insights`;
      const params = {
        access_token: accessToken,
        fields: 'impressions,clicks,spend,reach,frequency,cpm,cpc,ctr',
        time_range: JSON.stringify({
          since: startDate,
          until: endDate
        }),
        level: 'account',
        time_increment: 1
      };

      const data = await this.makeApiRequest(url, { params });
      return this.processMetaAdsData(data, connection.id);
    } catch (error) {
      console.error('Meta Ads數據獲取失敗:', error);
      throw error;
    }
  }

  // Google Analytics 4 API 整合
  async fetchGA4Data(connection, dateRange) {
    const { accessToken, accountId } = connection;
    const { startDate, endDate } = dateRange;
    
    try {
      const url = `https://analyticsdata.googleapis.com/v1beta/properties/${accountId}:runReport`;
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };
      
      const data = {
        dateRanges: [{
          startDate,
          endDate
        }],
        metrics: [
          { name: 'sessions' },
          { name: 'users' },
          { name: 'pageviews' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' }
        ],
        dimensions: [{ name: 'date' }]
      };

      const response = await this.makeApiRequest(url, { 
        method: 'POST', 
        headers, 
        data 
      });
      return this.processGA4Data(response, connection.id);
    } catch (error) {
      console.error('GA4數據獲取失敗:', error);
      throw error;
    }
  }

  // Instagram API 整合
  async fetchInstagramData(connection, dateRange) {
    const { accessToken, accountId } = connection;
    const { startDate, endDate } = dateRange;
    
    try {
      const url = `https://graph.facebook.com/v18.0/${accountId}/insights`;
      const params = {
        access_token: accessToken,
        metric: 'impressions,reach,profile_views,website_clicks,email_contacts,phone_call_clicks,text_message_clicks,get_directions_clicks',
        period: 'day',
        since: startDate,
        until: endDate
      };

      const data = await this.makeApiRequest(url, { params });
      return this.processInstagramData(data, connection.id);
    } catch (error) {
      console.error('Instagram數據獲取失敗:', error);
      throw error;
    }
  }

  // Google Search Console API 整合
  async fetchSearchConsoleData(connection, dateRange) {
    const { accessToken, accountId } = connection;
    const { startDate, endDate } = dateRange;
    
    try {
      const url = `https://www.googleapis.com/webmasters/v3/sites/${accountId}/searchAnalytics/query`;
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };
      
      const data = {
        startDate,
        endDate,
        dimensions: ['date'],
        rowLimit: 1000
      };

      const response = await this.makeApiRequest(url, { 
        method: 'POST', 
        headers, 
        data 
      });
      return this.processSearchConsoleData(response, connection.id);
    } catch (error) {
      console.error('Search Console數據獲取失敗:', error);
      throw error;
    }
  }

  // Google Ads API 整合
  async fetchGoogleAdsData(connection, dateRange) {
    const { accessToken, accountId } = connection;
    const { startDate, endDate } = dateRange;
    
    try {
      const url = `https://googleads.googleapis.com/v14/customers/${accountId}/googleAds:search`;
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };
      
      const data = {
        query: `
          SELECT 
            campaign.name,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.ctr,
            metrics.average_cpc
          FROM campaign
          WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
        `
      };

      const response = await this.makeApiRequest(url, { 
        method: 'POST', 
        headers, 
        data 
      });
      return this.processGoogleAdsData(response, connection.id);
    } catch (error) {
      console.error('Google Ads數據獲取失敗:', error);
      throw error;
    }
  }

  // Line LAP API 整合
  async fetchLineLapData(connection, dateRange) {
    const { accessToken, accountId } = connection;
    const { startDate, endDate } = dateRange;
    
    try {
      const url = `https://api.line.me/v2/bot/analytics/overview`;
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };
      
      const params = {
        from: startDate,
        to: endDate
      };

      const data = await this.makeApiRequest(url, { headers, params });
      return this.processLineLapData(data, connection.id);
    } catch (error) {
      console.error('Line LAP數據獲取失敗:', error);
      throw error;
    }
  }

  // 處理Meta Ads數據
  processMetaAdsData(data, connectionId) {
    const metrics = [];
    
    if (data.data && data.data.length > 0) {
      data.data.forEach(item => {
        const date = item.date_start;
        Object.entries(item).forEach(([key, value]) => {
          if (key !== 'date_start' && typeof value === 'number') {
            metrics.push({
              connectionId,
              metricName: key,
              metricValue: value,
              metricType: this.getMetricType(key),
              date,
              rawData: item
            });
          }
        });
      });
    }
    
    return metrics;
  }

  // 處理GA4數據
  processGA4Data(data, connectionId) {
    const metrics = [];
    
    if (data.rows) {
      data.rows.forEach(row => {
        const date = row.dimensionValues[0].value;
        row.metricValues.forEach((metric, index) => {
          const metricName = data.metricHeaders[index].name;
          metrics.push({
            connectionId,
            metricName,
            metricValue: parseFloat(metric.value) || 0,
            metricType: this.getMetricType(metricName),
            date,
            rawData: row
          });
        });
      });
    }
    
    return metrics;
  }

  // 處理Instagram數據
  processInstagramData(data, connectionId) {
    const metrics = [];
    
    if (data.data) {
      data.data.forEach(item => {
        const date = item.end_time.split('T')[0];
        metrics.push({
          connectionId,
          metricName: item.name,
          metricValue: item.values[0]?.value || 0,
          metricType: this.getMetricType(item.name),
          date,
          rawData: item
        });
      });
    }
    
    return metrics;
  }

  // 處理Search Console數據
  processSearchConsoleData(data, connectionId) {
    const metrics = [];
    
    if (data.rows) {
      data.rows.forEach(row => {
        const date = row.keys[0];
        metrics.push({
          connectionId,
          metricName: 'clicks',
          metricValue: row.clicks,
          metricType: 'count',
          date,
          rawData: row
        });
        metrics.push({
          connectionId,
          metricName: 'impressions',
          metricValue: row.impressions,
          metricType: 'count',
          date,
          rawData: row
        });
        metrics.push({
          connectionId,
          metricName: 'ctr',
          metricValue: row.ctr,
          metricType: 'percentage',
          date,
          rawData: row
        });
        metrics.push({
          connectionId,
          metricName: 'position',
          metricValue: row.position,
          metricType: 'rate',
          date,
          rawData: row
        });
      });
    }
    
    return metrics;
  }

  // 處理Google Ads數據
  processGoogleAdsData(data, connectionId) {
    const metrics = [];
    
    if (data.results) {
      data.results.forEach(result => {
        const date = result.segments.date;
        metrics.push({
          connectionId,
          metricName: 'impressions',
          metricValue: result.metrics.impressions,
          metricType: 'count',
          date,
          dimension1: result.campaign.name,
          rawData: result
        });
        metrics.push({
          connectionId,
          metricName: 'clicks',
          metricValue: result.metrics.clicks,
          metricType: 'count',
          date,
          dimension1: result.campaign.name,
          rawData: result
        });
        metrics.push({
          connectionId,
          metricName: 'cost',
          metricValue: result.metrics.costMicros / 1000000,
          metricType: 'currency',
          date,
          dimension1: result.campaign.name,
          rawData: result
        });
      });
    }
    
    return metrics;
  }

  // 處理Line LAP數據
  processLineLapData(data, connectionId) {
    const metrics = [];
    const date = moment().format('YYYY-MM-DD');
    
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'number') {
        metrics.push({
          connectionId,
          metricName: key,
          metricValue: value,
          metricType: this.getMetricType(key),
          date,
          rawData: data
        });
      }
    });
    
    return metrics;
  }

  // 獲取指標類型
  getMetricType(metricName) {
    const typeMap = {
      'impressions': 'count',
      'clicks': 'count',
      'spend': 'currency',
      'cost': 'currency',
      'ctr': 'percentage',
      'cpm': 'currency',
      'cpc': 'currency',
      'reach': 'count',
      'sessions': 'count',
      'users': 'count',
      'pageviews': 'count',
      'bounceRate': 'percentage',
      'averageSessionDuration': 'duration'
    };
    
    return typeMap[metricName] || 'count';
  }

  // 保存數據到資料庫
  async saveMetrics(metrics) {
    try {
      await DataMetric.bulkCreate(metrics, {
        updateOnDuplicate: ['metricValue', 'rawData']
      });
      console.log(`成功保存 ${metrics.length} 筆數據指標`);
    } catch (error) {
      console.error('保存數據指標失敗:', error);
      throw error;
    }
  }

  // 同步所有平台數據
  async syncAllPlatforms(userId, dateRange) {
    try {
      const connections = await PlatformConnection.findAll({
        where: { userId, isActive: true },
        include: [{ model: Platform, as: 'platform' }]
      });

      const allMetrics = [];

      for (const connection of connections) {
        try {
          let metrics = [];
          
          switch (connection.platform.name) {
            case 'Meta Ads':
              metrics = await this.fetchMetaAdsData(connection, dateRange);
              break;
            case 'Google Analytics':
              metrics = await this.fetchGA4Data(connection, dateRange);
              break;
            case 'Instagram':
              metrics = await this.fetchInstagramData(connection, dateRange);
              break;
            case 'Search Console':
              metrics = await this.fetchSearchConsoleData(connection, dateRange);
              break;
            case 'Google Ads':
              metrics = await this.fetchGoogleAdsData(connection, dateRange);
              break;
            case 'Line LAP':
              metrics = await this.fetchLineLapData(connection, dateRange);
              break;
            default:
              console.log(`不支援的平台: ${connection.platform.name}`);
              continue;
          }

          if (metrics.length > 0) {
            allMetrics.push(...metrics);
            await connection.update({ 
              lastSyncAt: new Date(),
              syncStatus: 'success'
            });
          }
        } catch (error) {
          console.error(`同步平台 ${connection.platform.name} 失敗:`, error);
          await connection.update({ 
            syncStatus: 'failed',
            errorMessage: error.message
          });
        }
      }

      if (allMetrics.length > 0) {
        await this.saveMetrics(allMetrics);
      }

      return {
        success: true,
        totalMetrics: allMetrics.length,
        message: `成功同步 ${allMetrics.length} 筆數據指標`
      };
    } catch (error) {
      console.error('同步所有平台數據失敗:', error);
      throw error;
    }
  }
}

module.exports = new PlatformService();
