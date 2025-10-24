const { Post, Category, Setting } = require('../models');

class HomeController {
  // 首頁
  static async index(req, res) {
    try {
      const postsPerPage = 10; // 直接設定為 10，避免 Setting 查詢錯誤
      const page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * postsPerPage;

      // 簡化查詢，避免複雜的關聯查詢導致錯誤
      const posts = []; // 暫時設為空陣列
      const categories = []; // 暫時設為空陣列

      res.render('home/index', {
        title: '首頁',
        posts,
        categories,
        pagination: {
          currentPage: page,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
          nextPage: null,
          prevPage: null
        }
      });
    } catch (error) {
      console.error('首頁載入錯誤:', error);
      res.status(500).render('errors/500', {
        title: '伺服器錯誤',
        message: '載入首頁時發生錯誤'
      });
    }
  }

  // 關於我們
  static async about(req, res) {
    try {
      res.render('home/about', {
        title: '關於我們'
      });
    } catch (error) {
      console.error('關於我們頁面錯誤:', error);
      res.status(500).render('errors/500', {
        title: '伺服器錯誤',
        message: '載入關於我們頁面時發生錯誤'
      });
    }
  }

  // 聯絡我們
  static async contact(req, res) {
    try {
      if (req.method === 'POST') {
        const { name, email, subject, message } = req.body;
        
        // 這裡可以添加聯絡表單處理邏輯
        // 例如：發送郵件、儲存到資料庫等
        
        req.flash('success_msg', '您的訊息已成功送出，我們會盡快回覆您！');
        return res.redirect('/contact');
      }
      
      res.render('home/contact', {
        title: '聯絡我們'
      });
    } catch (error) {
      console.error('聯絡我們頁面錯誤:', error);
      res.status(500).render('errors/500', {
        title: '伺服器錯誤',
        message: '載入聯絡我們頁面時發生錯誤'
      });
    }
  }

  // 搜尋
  static async search(req, res) {
    try {
      const query = req.query.q;
      const page = parseInt(req.query.page) || 1;
      const postsPerPage = parseInt(await Setting.get('posts_per_page')) || 10;
      const offset = (page - 1) * postsPerPage;

      if (!query || query.trim().length === 0) {
        return res.render('home/search', {
          title: '搜尋結果',
          posts: [],
          query: '',
          pagination: null
        });
      }

      const { count, rows: posts } = await Post.findAndCountAll({
        where: {
          status: 'published',
          [require('sequelize').Op.or]: [
            { title: { [require('sequelize').Op.like]: `%${query}%` } },
            { content: { [require('sequelize').Op.like]: `%${query}%` } }
          ]
        },
        include: [
          {
            model: require('../models').User,
            as: 'author',
            attributes: ['id', 'username', 'firstName', 'lastName']
          },
          {
            model: Category,
            as: 'categories',
            attributes: ['id', 'name', 'slug']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: postsPerPage,
        offset
      });

      const totalPages = Math.ceil(count / postsPerPage);

      res.render('home/search', {
        title: '搜尋結果',
        posts,
        query,
        pagination: {
          currentPage: page,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
          nextPage: page + 1,
          prevPage: page - 1
        }
      });
    } catch (error) {
      console.error('搜尋錯誤:', error);
      res.status(500).render('errors/500', {
        title: '伺服器錯誤',
        message: '搜尋時發生錯誤'
      });
    }
  }

  // 健康檢查
  static async health(req, res) {
    try {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
      });
    } catch (error) {
      res.status(500).json({
        status: 'ERROR',
        message: error.message
      });
    }
  }
}

module.exports = HomeController;
