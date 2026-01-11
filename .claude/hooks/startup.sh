#!/bin/bash

# SessionStartフックで実行されるスクリプト
# npm依存関係とブラウザをインストール

echo "📦 Installing npm dependencies..."
npm install

echo "🌐 Installing Google Chrome..."
# Playwright MCP用にGoogle Chromeをインストール
wget -q -O /tmp/google-chrome.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
dpkg -i /tmp/google-chrome.deb || apt-get install -f -y
rm -f /tmp/google-chrome.deb

echo "✅ Startup complete!"
exit 0
