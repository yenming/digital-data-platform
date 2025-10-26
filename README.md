# 全媒體數據儀表板 (Digital Data Platform)

一個整合多平台數據分析的全媒體數據儀表板，讓品牌方輕鬆管理全媒體數據，省去手動拉數據的冗贅流程。

## 🚀 技術棧

### 後端
- **Node.js** - JavaScript 運行環境
- **Express.js** - Web 應用程式框架
- **Sequelize** - MySQL ORM
- **JWT** - JSON Web Token 認證
- **bcryptjs** - 密碼加密
- **Axios** - HTTP 客戶端
- **Moment.js** - 日期處理
- **Node-cron** - 定時任務
- **express-validator** - 輸入驗證
- **express-session** - 會話管理
- **connect-flash** - 訊息提示

### 前端
- **Bootstrap 5** - CSS 框架
- **EJS** - 模板引擎
- **FontAwesome** - 圖標庫
- **Chart.js** - 圖表庫
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
digital-data-platform/
├── app/
│   ├── config/                 # 配置檔案
│   │   ├── database.js         # 資料庫配置
│   │   ├── config.json         # Sequelize 配置
│   │   └── mysql/
│   │       └── init.sql        # 資料庫初始化腳本
│   ├── controllers/            # 控制器
│   │   ├── AuthController.js   # 認證控制器
│   │   ├── DashboardController.js # 儀表板控制器
│   │   ├── HomeController.js   # 首頁控制器
│   │   └── ProductsController.js # 產品控制器
│   ├── middleware/             # 中介軟體
│   │   ├── auth.js            # 認證中介軟體
│   │   └── validation.js      # 驗證中介軟體
│   ├── models/                # 資料模型
│   │   ├── User.js            # 使用者模型
│   │   ├── Platform.js        # 平台模型
│   │   ├── PlatformConnection.js # 平台連接模型
│   │   ├── DataMetric.js      # 數據指標模型
│   │   ├── Dashboard.js       # 儀表板模型
│   │   ├── Widget.js          # 小工具模型
│   │   └── index.js           # 模型索引
│   ├── migrations/            # 資料庫遷移
│   │   ├── 20251026051652-create-platforms.js
│   │   ├── 20251026051730-create-platform-connections.js
│   │   ├── 20251026051745-create-data-metrics.js
│   │   ├── 20251026051800-create-dashboards.js
│   │   └── 20251026051815-create-widgets.js
│   ├── seeders/               # 資料庫種子
│   │   ├── 20251026051612-platforms.js
│   │   ├── 20251026051633-admin-user.js
│   │   └── 20251026060000-test-users.js
│   ├── services/              # 服務層
│   │   ├── PlatformService.js # 平台服務
│   │   └── AnalyticsService.js # 分析服務
│   └── views/                 # EJS 模板
│       ├── layouts/           # 佈局模板
│       │   └── main.ejs       # 主要佈局
│       ├── partials/          # 部分模板
│       │   ├── navbar.ejs     # 導航欄
│       │   └── footer.ejs     # 頁腳
│       ├── home/              # 首頁模板
│       │   └── index.ejs      # 首頁
│       ├── auth/              # 認證模板
│       │   ├── login.ejs      # 登入頁面
│       │   └── register.ejs   # 註冊頁面
│       ├── dashboard/         # 儀表板模板
│       │   ├── index.ejs      # 儀表板首頁
│       │   ├── platforms.ejs  # 平台管理
│       │   └── reports.ejs    # 數據報表
│       └── errors/            # 錯誤頁面
│           ├── 404.ejs        # 404 錯誤
│           └── 500.ejs        # 500 錯誤
├── public/                    # 靜態檔案
│   ├── css/                   # 樣式檔案
│   │   └── style.css          # 主要樣式
│   ├── js/                    # JavaScript 檔案
│   │   └── main.js            # 主要腳本
│   ├── images/                # 圖片檔案
│   └── uploads/               # 上傳檔案
├── routes/                    # 路由檔案
│   ├── auth.js                # 認證路由
│   ├── dashboard.js           # 儀表板路由
│   ├── home.js                # 首頁路由
│   ├── products.js            # 產品路由
│   └── users.js               # 使用者路由
├── app.js                     # 應用程式入口
├── package.json               # 專案依賴
├── Dockerfile                 # Docker 配置
├── docker-compose.yml         # Docker Compose 配置
├── .sequelizerc               # Sequelize CLI 配置
├── healthcheck.js             # 健康檢查腳本
└── README.md                  # 專案說明
```

## 🛠️ 安裝與設定

### 使用 Docker (推薦)

1. **複製專案**
   ```bash
   git clone <repository-url>
   cd digital-data-platform
   ```

2. **建構並啟動服務**
   ```bash
   docker-compose up --build -d
   ```

3. **執行資料庫遷移和種子**
   ```bash
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

4. **訪問應用程式**
   ```
   - 網站：http://localhost:3000
   - phpMyAdmin：http://localhost:8080
   ```

### 本地開發

1. **安裝依賴**
   ```bash
   npm install
   ```

2. **設定環境變數**
   ```bash
   # 建立 .env 檔案
   NODE_ENV=development
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=orionstar_tw
   DB_USER=root
   DB_PASSWORD=orionstar_password
   JWT_SECRET=your-super-secret-jwt-key
   SESSION_SECRET=your-super-secret-session-key
   ```

3. **啟動 MySQL 資料庫**
   ```bash
   docker-compose up mysql -d
   ```

4. **執行資料庫遷移**
   ```bash
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

5. **啟動應用程式**
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

# 資料庫相關指令
npx sequelize-cli db:migrate          # 執行遷移
npx sequelize-cli db:seed:all         # 執行種子
npx sequelize-cli db:migrate:undo     # 回滾遷移
npx sequelize-cli db:seed:undo:all    # 回滾種子

# Docker 相關指令
docker-compose up --build -d          # 建構並啟動
docker-compose down                   # 停止服務
docker-compose logs app               # 查看應用程式日誌
docker-compose logs mysql             # 查看資料庫日誌
```

## 📊 測試帳號

### 預設測試帳號
| 用戶名 | 密碼 | 電子郵件 | 角色 |
|--------|------|----------|------|
| **admin** | admin123 | admin@orionstar.com.tw | admin |
| **testuser** | test123 | test@digital-data-platform.com | user |
| **demo** | test123 | demo@digital-data-platform.com | user |

### 資料庫結構
- **users** - 使用者表
- **platforms** - 平台配置表
- **platform_connections** - 平台連接表
- **data_metrics** - 數據指標表
- **dashboards** - 儀表板配置表
- **widgets** - 小工具配置表

## 🔐 安全性功能

- **密碼加密**: 使用 bcryptjs 進行密碼雜湊
- **JWT 認證**: 安全的用戶認證機制
- **Session 管理**: 安全的會話管理
- **CORS 保護**: 跨域請求保護
- **Rate Limiting**: API 速率限制
- **Helmet**: HTTP 安全性標頭
- **輸入驗證**: 使用 express-validator 進行輸入驗證
- **SQL 注入防護**: 使用 Sequelize ORM

## 🎨 前端功能

- **響應式設計**: 支援桌面、平板、手機
- **Bootstrap 5**: 現代化 UI 框架
- **FontAwesome**: 豐富的圖標庫
- **Chart.js**: 互動式圖表
- **EJS 模板**: 動態內容渲染
- **表單驗證**: 前端和後端雙重驗證
- **無障礙設計**: 支援螢幕閱讀器
- **數據視覺化**: 豐富的圖表和儀表板

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
   pm2 start app.js --name "digital-data-platform"
   ```

## 📝 API 端點

### 認證相關
- `GET /auth/login` - 登入頁面
- `POST /auth/login` - 使用者登入
- `GET /auth/register` - 註冊頁面
- `POST /auth/register` - 使用者註冊
- `GET /auth/logout` - 使用者登出
- `POST /auth/logout` - 使用者登出

### 首頁相關
- `GET /` - 首頁
- `GET /about` - 關於我們
- `GET /contact` - 聯絡我們

### 儀表板相關
- `GET /dashboard` - 數據儀表板
- `GET /dashboard/platforms` - 平台管理
- `POST /dashboard/platforms/connect` - 連接平台
- `DELETE /dashboard/platforms/:id` - 斷開平台連接
- `POST /dashboard/sync/:id` - 同步平台數據
- `GET /dashboard/reports` - 數據報表
- `GET /dashboard/api/data` - 獲取儀表板數據

### 使用者相關
- `GET /users/dashboard` - 使用者儀表板
- `GET /users/profile` - 個人資料

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
- **數據同步**: 自動同步各平台數據
- **定時任務**: 使用 node-cron 進行定期數據更新

## 🔌 支援平台

### 社交媒體平台
- **Meta Ads** - Facebook 廣告數據
- **Instagram** - Instagram 洞察數據
- **Threads** - Threads 平台數據

### 分析平台
- **Google Analytics 4** - 網站分析數據
- **Google Search Console** - 搜尋表現數據

### 廣告平台
- **Google Ads** - Google 廣告數據

### 通訊平台
- **Line LAP** - Line 官方帳號數據

## 🎯 核心功能

### 數據整合
- **多平台整合**: 一站式管理所有平台數據
- **即時同步**: 24/7 自動同步最新數據
- **數據標準化**: 統一數據格式和指標

### 視覺化分析
- **互動式圖表**: 豐富的圖表類型
- **自定義儀表板**: 根據需求客製化佈局
- **KPI 監控**: 關鍵指標一目了然

### 報表功能
- **數據導出**: 支援 CSV、JSON 格式
- **定期報表**: 自動生成定期分析報告
- **跨平台比較**: 多平台數據對比分析

### 安全與權限
- **企業級安全**: 數據加密和權限控制
- **多層級權限**: 支援不同角色權限管理
- **API 安全**: 安全的 API 認證機制

## 🐛 故障排除

### 常見問題

1. **資料庫連接失敗**
   ```bash
   # 檢查 MySQL 容器狀態
   docker-compose ps mysql
   
   # 查看資料庫日誌
   docker-compose logs mysql
   ```

2. **應用程式無法啟動**
   ```bash
   # 查看應用程式日誌
   docker-compose logs app
   
   # 重新建構容器
   docker-compose up app --build -d
   ```

3. **EJS 模板錯誤**
   - 檢查模板語法
   - 確認所有 `<%- include` 標籤正確關閉

4. **登入問題**
   - 確認測試帳號已創建
   - 檢查密碼是否正確
   - 查看認證日誌

## 📞 支援

如有問題或建議，請聯繫：
- 電子郵件：contact@digital-data-platform.com
- 電話：+886-2-1234-5678

## 📄 授權

本專案採用 MIT 授權條款。

---

**全媒體數據儀表板** - 讓數據分析變得簡單高效！