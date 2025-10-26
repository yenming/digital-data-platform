class HomeController {
  // 首頁
  static async index(req, res) {
    try {
      res.render('home/index', {
        title: '首頁'
      });
    } catch (error) {
      console.error('首頁載入錯誤:', error);
      res.status(500).render('errors/500', {
        title: '伺服器錯誤',
        message: '載入首頁時發生錯誤'
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
