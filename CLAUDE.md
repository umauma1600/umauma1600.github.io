# CLAUDE.md

## プロジェクト概要

**やまーたの謎解きアトリエ** — 謎解きやマーダーミステリーで遊べる／ダウンロードできるサイト。
React 19 + TypeScript + Vite 6 + Tailwind CSS 4。GitHub Pages にデプロイ（静的サイトのみ）。

URL: https://umauma1600.github.io

## ディレクトリ構造

- `src/pages/` - ページコンポーネント
- `src/components/` - 再利用可能なコンポーネント
- `src/hooks/` - カスタムフック
- `src/utils/` - ユーティリティ関数
- `public/assets/` - 静的アセット（画像など）
- `docs/` - 仕様書・ガイド（SPEC.md, KELNA.md）

## コミット前チェック

`npm run lint && npx tsc -b && npm run build` を通すこと。

## ルーティング（重要）

React Router でクライアントルーティング。GitHub Pages のリロード対応として、ビルド時に各ルートへ `index.html` をコピーしている。

**新しいルートを追加したら `vite.config.ts` の `routes` 配列にも追加必須。**

## 設計方針

- **モバイルファースト** — ユーザーの多くがスマホからアクセス
- **日本語コミットメッセージ** — PR タイトルも日本語

## デザイン

- カラー: ウォームブラウン(`#3d2f23`) + ゴールデンベージュ(`#c69c6d`) + アイボリー背景(`#faf8f5`)
- フォント: Space Grotesk（見出し）、Inter（本文）— Google Fonts
- ナビ: デスクトップは左サイドバー(280px)、モバイルはハンバーガーメニュー（768px で切り替え）

## 現在のコンテンツ

- **謎解き**: 「逆転の宝箱」公開中
- **カフェ**: 「Cafe ひみつの鍵」公開中（隠し要素）
- **マダミス**: 準備中
