# 全媒體數據儀表板

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
│   ├── controllers/          # 控制器
│   │   ├── AuthController.js
│   │   ├── DashboardController.js
│   │   ├── HomeController.js
│   │   └── ProductsController.js
│   ├── middleware/           # 中介軟體
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/              # 資料模型
│   │   ├── Platform.js
│   │   ├── PlatformConnection.js
│   │   ├── DataMetric.js
│   │   ├── Dashboard.js
│   │   ├── Widget.js
│   │   └── index.js
│   ├── services/            # 服務層
│   │   ├── PlatformService.js
│   │   └── AnalyticsService.js
│   └── views/               # EJS 模板
│       ├── layouts/         # 佈局模板
│       ├── partials/       # 部分模板
│       ├── home/           # 首頁模板
│       ├── auth/           # 認證模板
│       ├── users/          # 使用者模板
│       ├── dashboard/      # 儀表板模板
│       └── errors/         # 錯誤頁面
├── config/                  # 配置檔案
├── public/                  # 靜態檔案
│   ├── css/                # 樣式檔案
│   ├── js/                 # JavaScript 檔案
│   └── images/             # 圖片檔案
├── routes/                  # 路由檔案
│   ├── auth.js
│   ├── dashboard.js
│   ├── home.js
│   ├── products.js
│   └── users.js
├── app.js                   # 應用程式入口
├── package.json             # 專案依賴
├── Dockerfile              # Docker 配置
├── docker-compose.yml      # Docker Compose 配置
└── README.md               # 專案說明
```

## 🛠️ 安裝與設定

### 使用 Docker

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
   ```
   - 網站：http://localhost:3000
   - MyAdmin：http://localhost:8080
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
- **platforms** - 平台配置表
- **platform_connections** - 平台連接表
- **data_metrics** - 數據指標表
- **dashboards** - 儀表板配置表
- **widgets** - 小工具配置表
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

### 儀表板相關
- `GET /dashboard` - 數據儀表板
- `GET /dashboard/platforms` - 平台管理
- `POST /dashboard/platforms/connect` - 連接平台
- `DELETE /dashboard/platforms/:id` - 斷開平台連接
- `POST /dashboard/sync/:id` - 同步平台數據
- `GET /dashboard/reports` - 數據報表
- `GET /dashboard/export` - 導出數據
- `GET /dashboard/custom/:id` - 自定義儀表板
- `POST /dashboard/custom` - 創建自定義儀表板

### API 端點
- `GET /dashboard/api/realtime` - 獲取實時數據
- `GET /dashboard/api/trends` - 獲取趨勢數據
- `GET /dashboard/api/platforms` - 獲取平台狀態

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

