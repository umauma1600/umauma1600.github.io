#!/bin/bash

# SessionStartフックで実行されるスクリプト
# npm依存関係とブラウザをインストール

echo "📦 Installing npm dependencies..."
npm install

echo "🏠 Creating Playwright home directory..."
mkdir -p /tmp/playwright-home

echo "🦊 Installing Firefox for Playwright MCP..."
# @playwright/mcp@latestが使用するPlaywright coreと同じバージョンのブラウザをインストール
# MCPは内部でplaywright-coreを使用する
npx -y @playwright/mcp@latest --help > /dev/null 2>&1
npx -y playwright install firefox

echo "✅ Startup complete!"
exit 0
