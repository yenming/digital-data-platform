const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Dashboard = sequelize.define('Dashboard', {
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
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '儀表板名稱'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '儀表板描述'
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: '是否為預設儀表板'
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: '是否公開'
  },
  layout: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '儀表板佈局配置'
  },
  filters: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '篩選條件'
  },
  dateRange: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '日期範圍配置'
  },
  refreshInterval: {
    type: DataTypes.INTEGER,
    defaultValue: 300,
    comment: '自動刷新間隔(秒)'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: '是否啟用'
  }
}, {
  tableName: 'dashboards',
  timestamps: true,
  comment: '儀表板配置表'
  });

  return Dashboard;
};
