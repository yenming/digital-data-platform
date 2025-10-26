const jwt = require('jsonwebtoken');
const { User } = require('../models');

// 驗證 JWT Token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.auth_token;
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: '未提供認證令牌' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: '無效的認證令牌' 
    });
  }
};

// 檢查使用者是否已登入（Session 版本）
const requireAuth = (req, res, next) => {
  console.log('=== requireAuth 中間件 ===');
  console.log('Session:', req.session);
  console.log('Session.user:', req.session?.user);
  
  if (req.session && req.session.user) {
    console.log('✅ 認證通過');
    return next();
  }
  
  console.log('❌ 認證失敗，重定向到登入頁');
  req.flash('error_msg', '請先登入');
  res.redirect('/auth/login');
};

// 檢查使用者是否已登入（API 版本）
const requireAuthAPI = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  
  res.status(401).json({ 
    success: false, 
    message: '請先登入' 
  });
};

// 檢查管理員權限
const requireAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  
  req.flash('error_msg', '您沒有權限訪問此頁面');
  res.redirect('/');
};

// 檢查管理員權限（API 版本）
const requireAdminAPI = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  
  res.status(403).json({ 
    success: false, 
    message: '您沒有權限執行此操作' 
  });
};

// 檢查使用者是否已登入（重定向到儀表板）
const redirectIfAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }
  next();
};

// 載入使用者資料到 locals
const loadUser = async (req, res, next) => {
  if (req.session && req.session.user) {
    try {
      const user = await User.findByPk(req.session.user.id);
      if (user && user.isActive) {
        req.user = user;
        res.locals.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isAdmin: user.role === 'admin'
        };
      } else {
        // 使用者不存在或已被停用，清除 session
        req.session.destroy();
        res.clearCookie('auth_token');
      }
    } catch (error) {
      console.error('載入使用者資料錯誤:', error);
    }
  }
  next();
};

// 檢查使用者是否為資源擁有者或管理員
const requireOwnershipOrAdmin = (resourceUserIdField = 'userId') => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      req.flash('error_msg', '請先登入');
      return res.redirect('/auth/login');
    }

    const currentUserId = req.session.user.id;
    const isAdmin = req.session.user.role === 'admin';
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];

    if (isAdmin || currentUserId == resourceUserId) {
      return next();
    }

    req.flash('error_msg', '您沒有權限執行此操作');
    res.redirect('/');
  };
};

module.exports = {
  verifyToken,
  requireAuth,
  requireAuthAPI,
  requireAdmin,
  requireAdminAPI,
  redirectIfAuthenticated,
  loadUser,
  requireOwnershipOrAdmin
};
