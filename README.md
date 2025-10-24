# OrionStar Taiwan Website

一個使用 Node.js、Express.js、Bootstrap 5、MySQL 和 Docker 構建的現代化網站。

## 🚀 技術棧

### 後端
- **Node.js** - JavaScript 運行環境
- **Express.js** - Web 應用程式框架
- **Sequelize** - MySQL ORM
- **JWT** - JSON Web Token 認證
- **bcryptjs** - 密碼加密

### 前端
- **Bootstrap 5** - CSS 框架
- **EJS** - 模板引擎
- **FontAwesome** - 圖標庫
- **響應式設計** - 支援各種裝置

### 資料庫
- **MySQL 8.0** - 關聯式資料庫

### 容器化
- **Docker** - 容器化平台
- **Docker Compose** - 多容器應用程式編排

### 安全性
- **Helmet** - 安全性中介軟體
- **CORS** - 跨域資源共享
- **Rate Limiting** - 速率限制
- **bcryptjs** - 密碼雜湊
- **JWT** - 安全認證

## 📁 專案結構

```
orionstar-com-tw-website/
├── app/
│   ├── controllers/          # 控制器
│   ├── middleware/           # 中介軟體
│   ├── models/              # 資料模型
│   ├── services/            # 服務層
│   └── views/               # EJS 模板
│       ├── layouts/         # 佈局模板
│       ├── partials/       # 部分模板
│       ├── home/           # 首頁模板
│       ├── auth/           # 認證模板
│       ├── users/          # 使用者模板
│       └── errors/         # 錯誤頁面
├── config/                  # 配置檔案
├── public/                  # 靜態檔案
│   ├── css/                # 樣式檔案
│   ├── js/                 # JavaScript 檔案
│   └── images/             # 圖片檔案
├── routes/                  # 路由檔案
├── app.js                   # 應用程式入口
├── package.json             # 專案依賴
├── Dockerfile              # Docker 配置
├── docker-compose.yml      # Docker Compose 配置
└── README.md               # 專案說明
```

## 🛠️ 安裝與設定

### 方法一：使用 Docker（推薦）

1. **複製環境變數檔案**
   ```bash
   cp env.example .env
   ```

2. **編輯環境變數**
   ```bash
   nano .env
   ```
   修改資料庫密碼和其他配置。

3. **建構並啟動服務**
   ```bash
   docker-compose up --build
   ```

4. **訪問應用程式**
   - 網站：http://localhost:3000
   - phpMyAdmin：http://localhost:8080

### 方法二：本地開發

1. **安裝依賴**
   ```bash
   npm install
   ```

2. **設定環境變數**
   ```bash
   cp env.example .env
   # 編輯 .env 檔案
   ```

3. **啟動 MySQL 資料庫**
   ```bash
   # 使用 Docker 啟動 MySQL
   docker run --name mysql -e MYSQL_ROOT_PASSWORD=your_password -e MYSQL_DATABASE=orionstar_tw -p 3306:3306 -d mysql:8.0
   ```

4. **啟動應用程式**
   ```bash
   npm run dev
   ```

## 🔧 開發指令

```bash
# 安裝依賴
npm install

# 開發模式（使用 nodemon）
npm run dev

# 生產模式
npm start

# 執行測試
npm test

# Docker 相關指令
npm run docker:build    # 建構 Docker 映像
npm run docker:up      # 啟動服務
npm run docker:down    # 停止服務
npm run docker:logs    # 查看日誌
```

## 📊 資料庫設定

### 預設管理員帳號
- **使用者名稱**: admin
- **電子郵件**: admin@orionstar.com.tw
- **密碼**: admin123

### 資料庫結構
- **users** - 使用者表
- **posts** - 文章表
- **categories** - 分類表
- **tags** - 標籤表
- **comments** - 留言表
- **settings** - 設定表

## 🔐 安全性功能

- **密碼加密**: 使用 bcryptjs 進行密碼雜湊
- **JWT 認證**: 安全的用戶認證機制
- **Session 管理**: 安全的會話管理
- **CORS 保護**: 跨域請求保護
- **Rate Limiting**: API 速率限制
- **Helmet**: HTTP 安全性標頭
- **輸入驗證**: 使用 express-validator 進行輸入驗證

## 🎨 前端功能

- **響應式設計**: 支援桌面、平板、手機
- **Bootstrap 5**: 現代化 UI 框架
- **FontAwesome**: 豐富的圖標庫
- **EJS 模板**: 動態內容渲染
- **表單驗證**: 前端和後端雙重驗證
- **無障礙設計**: 支援螢幕閱讀器

## 🚀 部署

### 使用 Docker 部署

1. **設定生產環境變數**
   ```bash
   # 修改 docker-compose.yml 中的環境變數
   NODE_ENV=production
   ```

2. **啟動生產服務**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

### 傳統部署

1. **安裝 PM2**
   ```bash
   npm install -g pm2
   ```

2. **啟動應用程式**
   ```bash
   pm2 start app.js --name "orionstar-website"
   ```

## 📝 API 端點

### 認證相關
- `POST /auth/login` - 使用者登入
- `POST /auth/register` - 使用者註冊
- `POST /auth/logout` - 使用者登出
- `GET /auth/forgot-password` - 忘記密碼頁面

### 首頁相關
- `GET /` - 首頁
- `GET /about` - 關於我們
- `GET /contact` - 聯絡我們
- `GET /search` - 搜尋功能

### 使用者相關
- `GET /users/dashboard` - 使用者儀表板
- `GET /users/profile` - 個人資料
- `GET /users/admin` - 管理員面板

### 系統相關
- `GET /health` - 健康檢查

## 🧪 測試

```bash
# 執行所有測試
npm test

# 執行特定測試
npm test -- --grep "認證測試"

# 生成測試覆蓋率報告
npm run test:coverage
```

## 📈 監控與日誌

- **健康檢查**: `/health` 端點
- **日誌記錄**: 使用 Morgan 中介軟體
- **錯誤處理**: 全域錯誤處理中介軟體
- **效能監控**: 壓縮和快取優化

## 🤝 貢獻指南

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權

此專案使用 MIT 授權 - 查看 [LICENSE](LICENSE) 檔案了解詳情。

## 📞 聯絡資訊

- **公司**: OrionStar Taiwan
- **網站**: https://orionstar.com.tw
- **電子郵件**: info@orionstar.com.tw
- **電話**: +886-2-2345-6789

## 🙏 致謝

感謝所有開源專案的貢獻者，特別是：
- Express.js 團隊
- Bootstrap 團隊
- Sequelize 團隊
- Docker 團隊

---

**注意**: 請確保在生產環境中修改所有預設密碼和密鑰！
# orionstar-com-tw-website
