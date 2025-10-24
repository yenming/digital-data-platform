#!/bin/bash

# OrionStar Taiwan Website 啟動腳本

echo "🚀 啟動 OrionStar Taiwan Website..."

# 檢查是否安裝了 Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安裝，請先安裝 Docker"
    exit 1
fi

# 檢查是否安裝了 Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安裝，請先安裝 Docker Compose"
    exit 1
fi

# 檢查環境變數檔案
if [ ! -f .env ]; then
    echo "📝 複製環境變數範例檔案..."
    cp env.example .env
    echo "⚠️  請編輯 .env 檔案設定您的資料庫密碼和其他配置"
    echo "   然後重新執行此腳本"
    exit 1
fi

# 建構並啟動服務
echo "🔨 建構 Docker 映像..."
docker-compose build

echo "🚀 啟動服務..."
docker-compose up -d

# 等待服務啟動
echo "⏳ 等待服務啟動..."
sleep 10

# 檢查服務狀態
echo "📊 檢查服務狀態..."
docker-compose ps

echo ""
echo "✅ 服務已啟動！"
echo "🌐 網站: http://localhost:3000"
echo "🗄️  Admin: http://localhost:8080"
echo ""
echo "📝 預設管理員帳號："
echo "   使用者名稱: admin"
echo "   電子郵件: admin@orionstar.com.tw"
echo "   密碼: admin123"
echo ""
echo "🛑 停止服務: docker-compose down"
echo "📋 查看日誌: docker-compose logs -f"
