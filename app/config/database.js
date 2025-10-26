const { Sequelize } = require('sequelize');
require('dotenv').config();

// 資料庫配置
const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'orionstar_tw',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'orionstar_password',
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  },
  dialectOptions: {
    charset: 'utf8mb4'
  }
});

// 測試資料庫連接
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ 資料庫連接成功');
    return true;
  } catch (error) {
    console.error('❌ 資料庫連接失敗:', error);
    return false;
  }
};

// 同步資料庫
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force: false, alter: false });
    console.log('✅ 資料庫同步完成');
    return true;
  } catch (error) {
    console.error('❌ 資料庫同步失敗:', error);
    return false;
  }
};

// 關閉資料庫連接
const closeConnection = async () => {
  try {
    await sequelize.close();
    console.log('✅ 資料庫連接已關閉');
    return true;
  } catch (error) {
    console.error('❌ 關閉資料庫連接失敗:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase,
  closeConnection
};
