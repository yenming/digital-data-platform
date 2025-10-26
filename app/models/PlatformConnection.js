const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const PlatformConnection = sequelize.define('PlatformConnection', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '用戶ID'
  },
  platformId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '平台ID'
  },
  accountId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '平台帳戶ID'
  },
  accountName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '帳戶名稱'
  },
  accessToken: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '存取權杖'
  },
  refreshToken: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '刷新權杖'
  },
  tokenExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '權杖過期時間'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: '是否啟用'
  },
  lastSyncAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '最後同步時間'
  },
  syncStatus: {
    type: DataTypes.ENUM('pending', 'success', 'failed', 'expired'),
    defaultValue: 'pending',
    comment: '同步狀態'
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '錯誤訊息'
  },
  config: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '平台特定配置'
  }
}, {
  tableName: 'platform_connections',
  timestamps: true,
  comment: '平台連接表'
  });

  return PlatformConnection;
};
