#!/bin/bash

# SessionStartフックで実行されるスクリプト
# npm依存関係とブラウザをインストール

echo "📦 Installing npm dependencies..."
npm install

echo "🎭 Installing Chrome for Playwright MCP..."
# @playwright/mcp@latestが使用するPlaywright coreと同じバージョンのブラウザをインストール
# MCPは内部でplaywright-coreを使用し、Chrome for Testingを要求する
npx -y @playwright/mcp@latest --help > /dev/null 2>&1
npx -y playwright install chromium

echo "🌐 Installing Google Chrome..."
# Chrome DevTools MCP用にGoogle Chromeをインストール
wget -q -O /tmp/google-chrome.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
dpkg -i /tmp/google-chrome.deb || apt-get install -f -y
rm -f /tmp/google-chrome.deb

echo "✅ Startup complete!"
exit 0
