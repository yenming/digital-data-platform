class ProductsController {
  // 產品中心首頁
  static async index(req, res) {
    try {
      res.render('products/index', {
        title: '產品中心',
        page: 'products'
      });
    } catch (error) {
      console.error('產品中心頁面錯誤:', error);
      res.status(500).render('errors/500', {
        title: '伺服器錯誤',
        message: '載入產品中心頁面時發生錯誤'
      });
    }
  }


}

module.exports = ProductsController;
