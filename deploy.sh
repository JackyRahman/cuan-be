#!/bin/bash

SERVER="root@192.168.0.200"
TARGET_DIR="/var/www/cuan-be"

echo "🚀 Building project..."
npm run build || { echo "❌ Build failed"; exit 1; }

echo "📂 Cleaning dist on server..."
ssh $SERVER "rm -rf $TARGET_DIR/dist/*"

echo "📂 Uploading dist..."
scp -r dist/* $SERVER:$TARGET_DIR/dist/ || { echo "❌ Upload failed"; exit 1; }

echo "🔁 Restarting PM2..."
ssh $SERVER "pm2 reload cuan-be" || { echo "❌ PM2 restart failed"; exit 1; }

echo "🎉 Done! Deploy success!"
