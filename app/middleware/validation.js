const { body, param, query, validationResult } = require('express-validator');

// 處理驗證錯誤
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.status(400).json({
        success: false,
        message: '驗證失敗',
        errors: errors.array()
      });
    }
    
    // 對於非 API 請求，將錯誤傳遞給下一個中介軟體
    req.validationErrors = errors.array();
  }
  next();
};

// 登入驗證規則
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('請輸入有效的電子郵件地址')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('請輸入密碼')
    .isLength({ min: 6 })
    .withMessage('密碼至少需要 6 個字符'),
  handleValidationErrors
];

// 註冊驗證規則
const validateRegister = [
  body('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('使用者名稱必須在 3-50 個字符之間')
    .isAlphanumeric()
    .withMessage('使用者名稱只能包含字母和數字')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('請輸入有效的電子郵件地址')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('密碼至少需要 6 個字符')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('密碼必須包含至少一個小寫字母、一個大寫字母和一個數字'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('密碼確認不一致');
      }
      return true;
    }),
  body('firstName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('名字不能超過 50 個字符')
    .trim(),
  body('lastName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('姓氏不能超過 50 個字符')
    .trim(),
  handleValidationErrors
];

// 文章驗證規則
const validatePost = [
  body('title')
    .isLength({ min: 1, max: 200 })
    .withMessage('標題必須在 1-200 個字符之間')
    .trim(),
  body('content')
    .isLength({ min: 10 })
    .withMessage('內容至少需要 10 個字符'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('狀態必須是 draft、published 或 archived'),
  handleValidationErrors
];

// 分類驗證規則
const validateCategory = [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('分類名稱必須在 1-100 個字符之間')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('描述不能超過 500 個字符')
    .trim(),
  handleValidationErrors
];

// 標籤驗證規則
const validateTag = [
  body('name')
    .isLength({ min: 1, max: 50 })
    .withMessage('標籤名稱必須在 1-50 個字符之間')
    .trim(),
  handleValidationErrors
];

// 留言驗證規則
const validateComment = [
  body('content')
    .isLength({ min: 1, max: 1000 })
    .withMessage('留言內容必須在 1-1000 個字符之間')
    .trim(),
  body('authorName')
    .optional()
    .isLength({ max: 100 })
    .withMessage('作者名稱不能超過 100 個字符')
    .trim(),
  body('authorEmail')
    .optional()
    .isEmail()
    .withMessage('請輸入有效的電子郵件地址')
    .normalizeEmail(),
  handleValidationErrors
];

// 聯絡表單驗證規則
const validateContact = [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('姓名必須在 1-100 個字符之間')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('請輸入有效的電子郵件地址')
    .normalizeEmail(),
  body('subject')
    .isLength({ min: 1, max: 200 })
    .withMessage('主旨必須在 1-200 個字符之間')
    .trim(),
  body('message')
    .isLength({ min: 10, max: 2000 })
    .withMessage('訊息必須在 10-2000 個字符之間')
    .trim(),
  handleValidationErrors
];

// 搜尋驗證規則
const validateSearch = [
  query('q')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('搜尋關鍵字必須在 1-100 個字符之間')
    .trim(),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('頁碼必須是正整數'),
  handleValidationErrors
];

// ID 參數驗證
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID 必須是正整數'),
  handleValidationErrors
];

// 分頁驗證
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('頁碼必須是正整數'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('每頁數量必須在 1-100 之間'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateLogin,
  validateRegister,
  validatePost,
  validateCategory,
  validateTag,
  validateComment,
  validateContact,
  validateSearch,
  validateId,
  validatePagination
};
