-- 建立資料庫（如果不存在）
CREATE DATABASE IF NOT EXISTS orionstar_tw CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用資料庫
USE orionstar_tw;

-- 建立使用者表格
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role ENUM('admin', 'user') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 建立文章表格
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    content TEXT,
    excerpt TEXT,
    featured_image VARCHAR(255),
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    author_id INT,
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 建立分類表格
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 建立文章分類關聯表格
CREATE TABLE IF NOT EXISTS post_categories (
    post_id INT,
    category_id INT,
    PRIMARY KEY (post_id, category_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 建立標籤表格
CREATE TABLE IF NOT EXISTS tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 建立文章標籤關聯表格
CREATE TABLE IF NOT EXISTS post_tags (
    post_id INT,
    tag_id INT,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- 建立留言表格
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NULL,
    parent_id INT NULL,
    author_name VARCHAR(100),
    author_email VARCHAR(100),
    content TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- 建立設定表格
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_name VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入預設設定
INSERT INTO settings (key_name, value, description) VALUES
('site_title', 'OrionStar Taiwan', '網站標題'),
('site_description', 'OrionStar Taiwan 官方網站', '網站描述'),
('site_keywords', 'OrionStar, Taiwan, 機器人, 人工智慧', '網站關鍵字'),
('posts_per_page', '10', '每頁文章數量'),
('comments_enabled', '1', '是否啟用留言功能'),
('registration_enabled', '1', '是否開放註冊')
ON DUPLICATE KEY UPDATE value = VALUES(value);

-- 插入預設管理員帳號 (密碼: admin123)
INSERT INTO users (username, email, password, first_name, last_name, role, is_active, email_verified) VALUES
('admin', 'admin@orionstar.com.tw', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4j5.8.8.8.8', 'Admin', 'User', 'admin', TRUE, TRUE)
ON DUPLICATE KEY UPDATE username = username;

-- 建立平台配置表
CREATE TABLE IF NOT EXISTS platforms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    type ENUM('social', 'analytics', 'advertising', 'search', 'messaging') NOT NULL,
    api_endpoint VARCHAR(500),
    auth_type ENUM('oauth2', 'api_key', 'bearer_token', 'basic_auth') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    icon VARCHAR(100),
    color VARCHAR(7),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 建立平台連接表
CREATE TABLE IF NOT EXISTS platform_connections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    platform_id INT NOT NULL,
    account_id VARCHAR(255) NOT NULL,
    account_name VARCHAR(255),
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_sync_at TIMESTAMP NULL,
    sync_status ENUM('pending', 'success', 'failed', 'expired') DEFAULT 'pending',
    error_message TEXT,
    config JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
);

-- 建立數據指標表
CREATE TABLE IF NOT EXISTS data_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    connection_id INT NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,4) NOT NULL,
    metric_type ENUM('count', 'rate', 'currency', 'percentage', 'duration') NOT NULL,
    date DATE NOT NULL,
    hour INT,
    dimension1 VARCHAR(255),
    dimension2 VARCHAR(255),
    dimension3 VARCHAR(255),
    raw_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (connection_id) REFERENCES platform_connections(id) ON DELETE CASCADE,
    INDEX idx_connection_metric_date (connection_id, metric_name, date),
    INDEX idx_date (date),
    INDEX idx_metric_name (metric_name)
);

-- 建立儀表板配置表
CREATE TABLE IF NOT EXISTS dashboards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    layout JSON,
    filters JSON,
    date_range JSON,
    refresh_interval INT DEFAULT 300,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 建立小工具配置表
CREATE TABLE IF NOT EXISTS widgets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dashboard_id INT NOT NULL,
    type ENUM('chart', 'table', 'kpi', 'gauge', 'map', 'funnel', 'trend') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    position JSON NOT NULL,
    config JSON NOT NULL,
    data_source JSON NOT NULL,
    filters JSON,
    refresh_interval INT DEFAULT 300,
    is_visible BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dashboard_id) REFERENCES dashboards(id) ON DELETE CASCADE
);

-- 插入預設平台配置
INSERT INTO platforms (name, display_name, type, auth_type, icon, color, description) VALUES
('Meta Ads', 'Meta Ads', 'advertising', 'oauth2', 'fab fa-facebook', '#1877F2', 'Facebook 廣告平台'),
('Google Analytics', 'Google Analytics 4', 'analytics', 'oauth2', 'fab fa-google', '#EA4335', 'Google Analytics 4 網站分析'),
('Instagram', 'Instagram', 'social', 'oauth2', 'fab fa-instagram', '#E4405F', 'Instagram 社交媒體平台'),
('Search Console', 'Google Search Console', 'search', 'oauth2', 'fab fa-google', '#34A853', 'Google 搜尋控制台'),
('Google Ads', 'Google Ads', 'advertising', 'oauth2', 'fab fa-google', '#4285F4', 'Google 廣告平台'),
('Line LAP', 'Line LAP', 'messaging', 'api_key', 'fab fa-line', '#00C300', 'Line 官方帳號平台')
ON DUPLICATE KEY UPDATE display_name = VALUES(display_name);

-- 插入預設分類
INSERT INTO categories (name, slug, description) VALUES
('最新消息', 'news', '最新消息和公告'),
('產品介紹', 'products', '產品介紹和規格'),
('技術文章', 'tech', '技術相關文章'),
('公司動態', 'company', '公司相關動態')
ON DUPLICATE KEY UPDATE name = VALUES(name);
