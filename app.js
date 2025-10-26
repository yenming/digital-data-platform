const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// 引入自定義模組
const { sequelize, testConnection, syncDatabase, closeConnection } = require('./app/config/database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const homeRoutes = require('./routes/home');
const productsRoutes = require('./routes/products');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 3000;

// 安全性中介軟體
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

// CORS 配置
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? ['https://yourdomain.com'] : ['http://localhost:3000'],
  credentials: true
}));

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 100, // 限制每個 IP 每 15 分鐘最多 100 個請求
  message: '請求過於頻繁，請稍後再試',
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// 基本中介軟體
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Session 配置
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret_here',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // 在開發環境中設為 false
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 小時
  }
}));

app.use(flash());

// 靜態檔案
app.use(express.static(path.join(__dirname, 'public')));

// 設定 EJS 模板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));

// 全域變數
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg') || null;
  res.locals.error_msg = req.flash('error_msg') || null;
  res.locals.user = req.session.user || null;
  next();
});

// 路由
app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/dashboard/admin', adminRoutes);
app.use('/products', productsRoutes);
app.use('/dashboard', dashboardRoutes);

// 404 錯誤處理
app.use('*', (req, res) => {
  res.status(404).render('errors/404', {
    title: '頁面不存在',
    message: '抱歉，您要查找的頁面不存在。'
  });
});

// 全域錯誤處理中介軟體
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).render('errors/500', {
    title: '伺服器錯誤',
    message: isDevelopment ? err.message : '伺服器發生錯誤，請稍後再試',
    error: isDevelopment ? err : {}
  });
});

// 資料庫連接和伺服器啟動
const startServer = async () => {
  try {
    // 測試資料庫連接
    await testConnection();
    
    // 同步資料庫模型
    if (process.env.NODE_ENV === 'development') {
      await syncDatabase();
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 伺服器運行在 http://localhost:${PORT}`);
      console.log(`📊 環境: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ 伺服器啟動失敗:', error);
    process.exit(1);
  }
};

// 優雅關閉
process.on('SIGTERM', async () => {
  console.log('🛑 收到 SIGTERM 信號，正在關閉伺服器...');
  await closeConnection();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 收到 SIGINT 信號，正在關閉伺服器...');
  await closeConnection();
  process.exit(0);
});

startServer();

module.exports = app;
