# CLAUDE.md

このファイルは、Claude AIがこのリポジトリで作業する際のガイドラインとプロジェクト情報を記載しています。

## 📋 プロジェクト概要

**プロジェクト名**: umauma1600.github.io
**サイト名**: やまーたの謎解きアトリエ
**目的**: 謎解きやマーダーミステリー（マダミス）などの製作コンテンツで遊べる、またはダウンロードができるウェブサイト

**デプロイ先**: GitHub Pages
**URL**: https://umauma1600.github.io

---

## 🎯 プロジェクトの特徴

### コンテンツタイプ

1. **謎解き**
   - サイト内で直接プレイ可能
   - インタラクティブな仕組み（クリック、ドラッグ&ドロップなど）
   - モバイル対応必須

2. **マーダーミステリー（マダミス）**
   - PDFなどのダウンロード形式
   - ダウンロードボタンの実装

### ターゲットユーザー
- 謎解き・マダミス愛好者
- モバイルデバイスからのアクセスが多いことを想定

---

## 🛠️ 技術スタック

### フロントエンド
- **React 19**: UIライブラリ
- **TypeScript 5.6**: 型安全な開発
- **Vite 6**: 高速ビルドツール
- **Tailwind CSS 4**: ユーティリティファーストのCSSフレームワーク（Viteプラグイン経由）
- **React Router DOM 7**: クライアントサイドルーティング

### 開発ツール
- **ESLint 9**: コード品質チェック（TypeScript対応）
- **Prettier 3**: コードフォーマッター
- **Vitest 3**: テストフレームワーク
- **React Testing Library**: Reactコンポーネントのテスト
- **Playwright**: E2Eテスト用

### ビルド・デプロイ
- **Vite**: バンドラー（ターゲット: ESNext）
- **GitHub Actions**: CI/CD（Lint、型チェック、ビルド、デプロイ）
- **GitHub Pages**: 静的サイトホスティング（dist/ディレクトリをデプロイ）

---

## 📁 ディレクトリ構造

```
umauma1600.github.io/
├── index.html                      # Viteエントリーポイント（本番時は自動生成）
├── package.json                    # 依存関係とスクリプト
├── package-lock.json               # 依存関係のロックファイル
├── CLAUDE.md                       # このファイル
├── README.md                       # プロジェクト説明（ユーザー向け）
│
├── .github/
│   └── workflows/
│       ├── ci.yml                  # CI（Lint、型チェック、ビルド）
│       └── deploy.yml              # デプロイ（GitHub Pages）
│
├── src/                            # Reactアプリケーションのソースコード
│   ├── main.tsx                    # アプリケーションエントリーポイント
│   ├── App.tsx                     # ルートコンポーネント
│   ├── index.css                   # グローバルスタイル（Tailwind CSS）
│   ├── components/                 # 再利用可能なコンポーネント
│   ├── pages/                      # ページコンポーネント
│   ├── hooks/                      # カスタムフック
│   ├── utils/                      # ユーティリティ関数
│   └── test/
│       └── setup.ts                # Vitestセットアップ
│
├── public/                         # 静的ファイル（ビルド時にdist/にコピー）
│   ├── legacy/                     # 旧サイトのファイル（移行前）
│   │   ├── index.html              # 旧トップページ
│   │   ├── contents/               # 旧謎解きコンテンツ
│   │   ├── css/                    # 旧CSS
│   │   ├── js/                     # 旧JavaScript
│   │   ├── contact/                # 旧お問い合わせ
│   │   └── main-image.png          # 旧画像
│   │
│   └── assets/                     # 新サイトの静的アセット（予定）
│       ├── images/                 # 画像ファイル
│       └── downloads/              # ダウンロードコンテンツ（PDF等）
│
├── dist/                           # ビルド出力（.gitignoreに含まれる）
│   ├── index.html                  # ビルド済みHTML
│   ├── assets/                     # ビルド済みJS/CSS
│   └── legacy/                     # 旧サイトファイル（public/からコピー）
│
├── tsconfig.json                   # TypeScript設定（ルート）
├── tsconfig.app.json               # アプリケーション用TypeScript設定
├── tsconfig.node.json              # Node.js（Vite等）用TypeScript設定
├── vite.config.ts                  # Vite設定
├── vitest.config.ts                # Vitest設定
├── eslint.config.js                # ESLint設定
└── .gitignore                      # Gitignore
```

---

## 🎨 デザインガイドライン

### デザインコンセプト
- **モダン**で洗練されたデザイン
- **ミニマル**でクリーンな印象
- おしゃれで記憶に残るUI/UX
- 謎解きの世界観を演出

### デザイン参考
- [Claude Code Frontend Design スキル](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md)
- ユニークで美しいフォントの使用
- 支配的な色と鋭いアクセントカラー
- 非対称性や重なりを活用した視覚的な興味

### カラーパレット
```css
--color-primary: #3d2f23 (ウォームブラウン - メインテキスト)
--color-accent: #c69c6d (ゴールデンベージュ - アクセント)
--color-text: #4a5568 (グレー - ボディテキスト)
--color-bg: #faf8f5 (アイボリー - 背景)
```

### タイポグラフィ
- **見出し**: Space Grotesk（モダンで幾何学的なサンセリフ）
- **本文**: Inter（読みやすいサンセリフ）
- Google Fonts経由で読み込み

### ナビゲーション
- **デスクトップ**: 左サイドバー（固定、280px幅）
- **モバイル**: トップバー + ハンバーガーメニュー
- スムーススクロール実装
- アクティブリンクのハイライト

### レスポンシブ対応
- モバイル、タブレット、デスクトップすべてで快適に利用可能
- タッチ操作とマウス操作の両方に対応
- Tailwind CSSのレスポンシブユーティリティを活用
- ブレークポイント: 768px（モバイル/デスクトップ切り替え）

---

## 🚀 開発ワークフロー

### 基本方針
- **すべてのコーディングはClaude AIが担当**
- ユーザー（オーナー）にはコーディング知識不要
- シンプルで保守しやすいコード

### npm scripts
```bash
npm run dev          # 開発サーバー起動（localhost:5173）
npm run build        # 本番ビルド（型チェック + Viteビルド）
npm run preview      # ビルド結果のプレビュー
npm run lint         # ESLintでコード品質チェック
npm run test         # Vitestでテスト実行
npm run test:coverage # カバレッジ測定
```

### ブランチ戦略
- `main` ブランチ: 本番環境（GitHub Pages公開用）
- `claude/*` ブランチ: 機能開発・修正用

### コミットルール
- **必ず日本語でコミットメッセージを記述**
- 明確で分かりやすい内容にする
- 変更内容を簡潔に説明

### CI/CD
- **CI**: すべてのpushで自動実行（Lint、型チェック、ビルド）
- **デプロイ**: mainブランチへのpushで自動的にGitHub Pagesへデプロイ

---

## 📝 コーディング規約

### TypeScript
- **厳格な型チェック**: `strict: true` で開発
- 型推論を活用しつつ、必要に応じて明示的な型定義
- `any`の使用は避ける
- ESNext構文を使用（ターゲット: ESNext）
- 未使用の変数・パラメータは許可しない（`noUnusedLocals`, `noUnusedParameters`）

### React
- **関数コンポーネント**を使用（クラスコンポーネントは使用しない）
- **React Hooks**を積極的に活用
- コンポーネントは単一責任の原則に従う
- Props型は明示的に定義（interfaceまたはtype）
- セマンティックなHTML要素を使用（アクセシビリティ配慮）
- ファイル名: PascalCase（例: `MyComponent.tsx`）

### Tailwind CSS
- **ユーティリティクラス**を使用
- Viteプラグイン経由で読み込み（`@import 'tailwindcss'`）
- レスポンシブブレークポイント:
  - sm: 640px~
  - md: 768px~
  - lg: 1024px~
  - xl: 1280px~
  - 2xl: 1536px~
- 複雑なスタイルはコンポーネント化を検討

### コードスタイル
- **Prettier**で自動フォーマット
- **ESLint**でコード品質を保証
- セミコロン、ダブルクォートを使用（Prettier設定）
- インデント: 2スペース

---

## ⚠️ 重要な制約・要件

### 必須要件
1. **モバイル対応は必須**
   - すべてのページでレスポンシブデザイン
   - タッチ操作への対応

2. **GitHub Pagesでの動作保証**
   - 静的ファイルのみ
   - サーバーサイド処理は不可

3. **シンプルさの維持**
   - オーナーがコーディング知識なしで管理可能
   - 複雑な依存関係は避ける

### 推奨事項
- ページ読み込み速度の最適化
- 画像の圧縮・最適化
- クロスブラウザ対応（Chrome, Safari, Firefox, Edge）

---

## 🎮 コンテンツ追加の流れ

### 謎解きコンテンツの追加（React移行後）
1. `src/pages/` 内に新しいページコンポーネントを作成
2. 必要なコンポーネントを `src/components/` に作成
3. React Routerでルーティングを設定
4. トップページにリンクを追加
5. モバイルでの動作確認
6. テストの作成（必要に応じて）

### マダミスコンテンツの追加
1. PDFファイルを `public/assets/downloads/` に配置
2. ダウンロードページコンポーネントを作成または更新
3. React Routerでルーティングを設定
4. トップページにリンクを追加

### レガシーコンテンツ（移行前のHTML/CSS/JS）
- `public/legacy/` 配下に保存
- ビルド時に `dist/legacy/` にコピーされ、引き続きアクセス可能
- 例: `https://umauma1600.github.io/legacy/contents/treasure-box/`

---

## 🔄 デプロイ方法

### 自動デプロイ（GitHub Actions）
1. `main` ブランチにプッシュ
2. GitHub Actionsが自動的に以下を実行：
   - 依存関係のインストール（`npm ci`）
   - ビルド（`npm run build`）
   - `dist/` ディレクトリをGitHub Pagesにデプロイ
3. 数分後に https://umauma1600.github.io で公開

### 手動デプロイ（必要に応じて）
- GitHub Actionsの「Deploy to GitHub Pages」ワークフローを手動実行
- ブランチを指定してデプロイ可能

### デプロイ前のチェックリスト
- [ ] `npm run lint` が成功
- [ ] `npx tsc -b` が成功
- [ ] `npm run build` が成功
- [ ] モバイル表示の確認（`npm run preview`）
- [ ] すべてのリンクの動作確認
- [ ] 画像・アセットの読み込み確認
- [ ] レガシーコンテンツ（`/legacy/`）のアクセス確認

---

## 💡 Claude AIへの指示

### 開発時の心がけ
- オーナーはコーディング知識がないため、**すべての実装を自動で行う**
- 変更内容は分かりやすく説明する
- 質問があれば積極的に確認する

### コード品質
- 読みやすく、シンプルなコードを心がける
- コメントで処理内容を丁寧に説明
- 将来的な拡張性を考慮

### モバイル対応
- **すべてのページでモバイル対応を徹底**
- 実装後は必ずレスポンシブ動作を確認

---

## 📞 お問い合わせ機能

### 実装方法
- GitHub Pagesは静的サイトのため、サーバーサイド処理は不可
- 以下のいずれかの方法を検討:
  - Formspreeなどの外部フォームサービス
  - GitHubのIssue機能へのリンク
  - メールアドレスのリンク（mailto:）

---

## 📊 現在のステータス

### React移行プロジェクト（進行中）

**Step 1: 環境構築** ✅ 完了
- Vite + React + TypeScript環境構築
- CI/CD設定（Lint、型チェック、ビルド、デプロイ）
- レガシーファイルをpublic/legacy/に移行
- 空のReactアプリでデプロイ可能な状態

**Step 2: トップページ移行** 🔄 予定
- 既存のindex.htmlをReactコンポーネント化
- デザイン・レイアウトの再現
- ルーティング設定

**Step 3: 「逆転の宝箱」移行** 🔄 予定
- 謎解きコンテンツのReactコンポーネント化
- インタラクティブ機能の実装
- モバイル対応の強化

### コンテンツ状況
- **謎解き**:
  - 「逆転の宝箱」（レガシー版: `/legacy/contents/treasure-box/`）
  - React版への移行予定
- **マダミス**: 準備中

### 更新頻度
- 不定期（やる気が出たら）

### 今後の展開
- React移行完了後、新規コンテンツの追加
- コンテンツ数の増加に応じてカテゴリ分け
- ユーザーフィードバック機能の追加検討

---

## 🎉 その他

### ライセンス
- コンテンツのライセンスは別途検討

### クレジット
- サイト製作: Claude AI (Anthropic)
- コンテンツ製作: umauma1600

---

**最終更新日**: 2025-12-31（React移行 Step 1完了）
**作成者**: Claude AI
**サイト名**: やまーたの謎解きアトリエ
