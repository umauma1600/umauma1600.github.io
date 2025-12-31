#!/bin/bash

# SessionStartフックで実行されるスクリプト
# npm依存関係とPlaywrightブラウザをインストール

echo "📦 Installing npm dependencies..."
npm install

echo "🎭 Installing Playwright browsers..."
npx playwright install --with-deps

echo "✅ Startup complete!"
exit 0
