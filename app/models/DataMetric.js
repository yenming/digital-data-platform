const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const DataMetric = sequelize.define('DataMetric', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  connectionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '平台連接ID'
  },
  metricName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '指標名稱'
  },
  metricValue: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false,
    comment: '指標數值'
  },
  metricType: {
    type: DataTypes.ENUM('count', 'rate', 'currency', 'percentage', 'duration'),
    allowNull: false,
    comment: '指標類型'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: '數據日期'
  },
  hour: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '小時 (0-23)'
  },
  dimension1: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '維度1 (如: 廣告系列名稱)'
  },
  dimension2: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '維度2 (如: 廣告組名稱)'
  },
  dimension3: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '維度3 (如: 關鍵字)'
  },
  rawData: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '原始數據'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'data_metrics',
  timestamps: false,
  comment: '數據指標表',
  indexes: [
    {
      fields: ['connectionId', 'metricName', 'date']
    },
    {
      fields: ['date']
    },
    {
      fields: ['metricName']
    }
  ]
  });

  return DataMetric;
};
