'use strict';

const { sequelize } = require('../config/database');

// 導入所有模型
const User = require('./User')(sequelize, require('sequelize').DataTypes);
const Platform = require('./Platform')(sequelize, require('sequelize').DataTypes);
const PlatformConnection = require('./PlatformConnection')(sequelize, require('sequelize').DataTypes);
const DataMetric = require('./DataMetric')(sequelize, require('sequelize').DataTypes);
const Dashboard = require('./Dashboard')(sequelize, require('sequelize').DataTypes);
const Widget = require('./Widget')(sequelize, require('sequelize').DataTypes);

// 定義關聯
User.hasMany(PlatformConnection, { foreignKey: 'userId' });
PlatformConnection.belongsTo(User, { foreignKey: 'userId' });

Platform.hasMany(PlatformConnection, { foreignKey: 'platformId' });
PlatformConnection.belongsTo(Platform, { foreignKey: 'platformId' });

PlatformConnection.hasMany(DataMetric, { foreignKey: 'connectionId' });
DataMetric.belongsTo(PlatformConnection, { foreignKey: 'connectionId' });

User.hasMany(Dashboard, { foreignKey: 'userId' });
Dashboard.belongsTo(User, { foreignKey: 'userId' });

Dashboard.hasMany(Widget, { foreignKey: 'dashboardId' });
Widget.belongsTo(Dashboard, { foreignKey: 'dashboardId' });

const db = {
  sequelize,
  Sequelize: require('sequelize'),
  User,
  Platform,
  PlatformConnection,
  DataMetric,
  Dashboard,
  Widget
};

module.exports = db;
