const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { User } = require('../models');

class AuthController {
  // 登入頁面
  static async loginPage(req, res) {
    try {
      if (req.session.user) {
        return res.redirect('/dashboard');
      }
      
      res.render('auth/login', {
        title: '登入',
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error('登入頁面錯誤:', error);
      res.status(500).render('errors/500', {
        title: '伺服器錯誤',
        message: '載入登入頁面時發生錯誤'
      });
    }
  }

  // 處理登入
  static async login(req, res) {
    try {
      console.log('登入請求收到:', req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('驗證錯誤:', errors.array());
        return res.render('auth/login', {
          title: '登入',
          errors: errors.array(),
          oldInput: req.body,
          error_msg: req.flash('error_msg'),
          success_msg: req.flash('success_msg')
        });
      }

      const { email, password, remember } = req.body;
      
      // 查找使用者
      console.log('查找用戶:', email);
      const user = await User.findOne({ where: { email: email } });
      console.log('找到用戶:', user ? user.username : '未找到');
      if (!user) {
        req.flash('error_msg', '電子郵件或密碼錯誤');
        return res.render('auth/login', {
          title: '登入',
          oldInput: req.body,
          error_msg: req.flash('error_msg'),
          success_msg: req.flash('success_msg')
        });
      }

      // 檢查使用者是否啟用
      if (!user.isActive) {
        req.flash('error_msg', '您的帳號已被停用，請聯絡管理員');
        return res.render('auth/login', {
          title: '登入',
          oldInput: req.body,
          error_msg: req.flash('error_msg'),
          success_msg: req.flash('success_msg')
        });
      }

      // 驗證密碼
      const bcrypt = require('bcryptjs');
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        req.flash('error_msg', '電子郵件或密碼錯誤');
        return res.render('auth/login', {
          title: '登入',
          oldInput: req.body,
          error_msg: req.flash('error_msg'),
          success_msg: req.flash('success_msg')
        });
      }

      // 更新最後登入時間
      user.lastLogin = new Date();
      await user.save();

      // 建立 JWT Token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      // 設定 Session
      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        token
      };

      // 設定 Cookie（如果選擇記住我）
      if (remember) {
        res.cookie('auth_token', token, {
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 天
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production'
        });
      }

      // 保存 session 後再重定向
      req.session.save((err) => {
        if (err) {
          console.error('Session 保存錯誤:', err);
          req.flash('error_msg', '登入時發生錯誤，請稍後再試');
          return res.render('auth/login', {
            title: '登入',
            oldInput: req.body,
            error_msg: req.flash('error_msg'),
            success_msg: req.flash('success_msg')
          });
        }
        
        console.log('Session 已保存，重定向到 dashboard');
        req.flash('success_msg', '登入成功！');
        res.redirect('/dashboard');
      });
    } catch (error) {
      console.error('登入錯誤:', error);
      req.flash('error_msg', '登入時發生錯誤，請稍後再試');
      res.render('auth/login', {
        title: '登入',
        oldInput: req.body
      });
    }
  }

  // 註冊頁面
  static async registerPage(req, res) {
    try {
      if (req.session.user) {
        return res.redirect('/dashboard');
      }
      
      res.render('auth/register', {
        title: '註冊',
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error('註冊頁面錯誤:', error);
      res.status(500).render('errors/500', {
        title: '伺服器錯誤',
        message: '載入註冊頁面時發生錯誤'
      });
    }
  }

  // 處理註冊
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render('auth/register', {
          title: '註冊',
          errors: errors.array(),
          oldInput: req.body,
          error_msg: req.flash('error_msg'),
          success_msg: req.flash('success_msg')
        });
      }

      const { username, email, password, confirmPassword, firstName, lastName } = req.body;

      // 檢查密碼確認
      if (password !== confirmPassword) {
        req.flash('error_msg', '密碼確認不一致');
        return res.render('auth/register', {
          title: '註冊',
          oldInput: req.body,
          error_msg: req.flash('error_msg'),
          success_msg: req.flash('success_msg')
        });
      }

      // 檢查使用者是否已存在
      const existingUser = await User.findOne({
        where: {
          [require('sequelize').Op.or]: [
            { email },
            { username }
          ]
        }
      });

      if (existingUser) {
        if (existingUser.email === email) {
          req.flash('error_msg', '此電子郵件已被使用');
        } else {
          req.flash('error_msg', '此使用者名稱已被使用');
        }
        return res.render('auth/register', {
          title: '註冊',
          oldInput: req.body,
          error_msg: req.flash('error_msg'),
          success_msg: req.flash('success_msg')
        });
      }

      // 建立新使用者
      const user = await User.create({
        username,
        email,
        password,
        firstName,
        lastName
      });

      req.flash('success_msg', '註冊成功！請登入您的帳號');
      res.redirect('/auth/login');
    } catch (error) {
      console.error('註冊錯誤:', error);
      req.flash('error_msg', '註冊時發生錯誤，請稍後再試');
      res.render('auth/register', {
        title: '註冊',
        oldInput: req.body
      });
    }
  }

  // 登出
  static async logout(req, res) {
    try {
      // 清除 Session
      req.session.destroy((err) => {
        if (err) {
          console.error('Session 清除錯誤:', err);
        }
      });

      // 清除 Cookie
      res.clearCookie('auth_token');
      res.clearCookie('connect.sid');

      req.flash('success_msg', '您已成功登出');
      res.redirect('/');
    } catch (error) {
      console.error('登出錯誤:', error);
      req.flash('error_msg', '登出時發生錯誤');
      res.redirect('/');
    }
  }

  // 忘記密碼頁面
  static async forgotPasswordPage(req, res) {
    try {
      res.render('auth/forgot-password', {
        title: '忘記密碼'
      });
    } catch (error) {
      console.error('忘記密碼頁面錯誤:', error);
      res.status(500).render('errors/500', {
        title: '伺服器錯誤',
        message: '載入忘記密碼頁面時發生錯誤'
      });
    }
  }

  // 處理忘記密碼
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      
      const user = await User.findByEmail(email);
      if (!user) {
        req.flash('error_msg', '找不到此電子郵件地址');
        return res.render('auth/forgot-password', {
          title: '忘記密碼',
          oldInput: req.body
        });
      }

      // 這裡可以添加密碼重設邏輯
      // 例如：發送重設密碼郵件
      
      req.flash('success_msg', '密碼重設連結已發送到您的電子郵件');
      res.redirect('/auth/login');
    } catch (error) {
      console.error('忘記密碼錯誤:', error);
      req.flash('error_msg', '處理忘記密碼時發生錯誤');
      res.render('auth/forgot-password', {
        title: '忘記密碼',
        oldInput: req.body
      });
    }
  }
}

module.exports = AuthController;
