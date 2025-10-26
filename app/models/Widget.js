const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Widget = sequelize.define('Widget', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dashboardId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '儀表板ID'
  },
  type: {
    type: DataTypes.ENUM('chart', 'table', 'kpi', 'gauge', 'map', 'funnel', 'trend'),
    allowNull: false,
    comment: '小工具類型'
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '小工具標題'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '小工具描述'
  },
  position: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: '位置配置 {x, y, w, h}'
  },
  config: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: '小工具配置'
  },
  dataSource: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: '數據來源配置'
  },
  filters: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '篩選條件'
  },
  refreshInterval: {
    type: DataTypes.INTEGER,
    defaultValue: 300,
    comment: '刷新間隔(秒)'
  },
  isVisible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: '是否可見'
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '排序順序'
  }
}, {
  tableName: 'widgets',
  timestamps: true,
  comment: '小工具配置表'
  });

  return Widget;
};
