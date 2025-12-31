#!/bin/bash

# SessionStartフックで実行されるスクリプト
# npm依存関係とPlaywrightブラウザをインストール

echo "📦 Installing npm dependencies..."
npm install

echo "🎭 Installing Playwright Firefox browser..."
npx playwright install firefox

echo "✅ Startup complete!"
exit 0
