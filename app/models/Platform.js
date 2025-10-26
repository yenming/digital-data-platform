const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Platform = sequelize.define('Platform', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    comment: '平台名稱 (Meta Ads, Google Analytics, Instagram, etc.)'
  },
  displayName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '顯示名稱'
  },
  type: {
    type: DataTypes.ENUM('social', 'analytics', 'advertising', 'search', 'messaging'),
    allowNull: false,
    comment: '平台類型'
  },
  apiEndpoint: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'API端點'
  },
  authType: {
    type: DataTypes.ENUM('oauth2', 'api_key', 'bearer_token', 'basic_auth'),
    allowNull: false,
    comment: '認證類型'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: '是否啟用'
  },
  icon: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '平台圖標'
  },
  color: {
    type: DataTypes.STRING(7),
    allowNull: true,
    comment: '平台主題色'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '平台描述'
  }
}, {
  tableName: 'platforms',
  timestamps: true,
  comment: '平台配置表'
});

module.exports = Platform;
