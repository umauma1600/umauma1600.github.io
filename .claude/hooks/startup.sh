#!/bin/bash

# SessionStartフックで実行されるスクリプト
# npm依存関係とPlaywright MCP用ブラウザをインストール

echo "📦 Installing npm dependencies..."
npm install

echo "🎭 Installing Chrome for Playwright MCP..."
# @playwright/mcp@latestが使用するPlaywright coreと同じバージョンのブラウザをインストール
# MCPは内部でplaywright-coreを使用し、Chrome for Testingを要求する
npx -y @playwright/mcp@latest --help > /dev/null 2>&1
npx -y playwright install chromium

echo "✅ Startup complete!"
exit 0
