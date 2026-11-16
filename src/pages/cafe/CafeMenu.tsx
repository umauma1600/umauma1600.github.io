import { useState } from "react";
import { Link } from "react-router-dom";
import { useCafeProgress } from "../../hooks/useCafeProgress";

// メニューアイテムの型定義
interface MenuItem {
  id: string;
  name: string;
  description: string;
  difficulty: 1 | 2 | 3;
  category: "drink" | "food";
  available: boolean;
  path?: string;
}

// ダミーメニューデータ（謎ができるまでの仮データ）
const menuItems: MenuItem[] = [
  // ドリンク（コースター謎）
  {
    id: "blend",
    name: "ブレンドコーヒー",
    description: "定番の一杯。優しい謎がコースターに。",
    difficulty: 1,
    category: "drink",
    available: false,
  },
  {
    id: "latte",
    name: "カフェラテ",
    description: "まろやかな味わい。少し考える謎。",
    difficulty: 2,
    category: "drink",
    available: true,
    path: "/cafe/menu/latte",
  },
  {
    id: "espresso",
    name: "エスプレッソ",
    description: "濃厚な一杯。じっくり解く謎。",
    difficulty: 3,
    category: "drink",
    available: false,
  },
  {
    id: "tea",
    name: "紅茶",
    description: "香り高いアールグレイ。閃きが鍵。",
    difficulty: 2,
    category: "drink",
    available: false,
  },
  // 軽食（メイン謎）
  {
    id: "sandwich",
    name: "本日のサンドイッチ",
    description: "ボリューム満点。長編の謎解き。",
    difficulty: 2,
    category: "food",
    available: false,
  },
  {
    id: "cake",
    name: "シェフの気まぐれケーキ",
    description: "甘美なストーリー。物語を解き明かす。",
    difficulty: 3,
    category: "food",
    available: false,
  },
];

// 難易度表示コンポーネント
function DifficultyStars({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="text-amber-500">
      {"★".repeat(level)}
      {"☆".repeat(3 - level)}
    </span>
  );
}

export default function CafeMenu() {
  const { isCleared } = useCafeProgress();
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "drink" | "food"
  >("all");

  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const drinkItems = menuItems.filter((item) => item.category === "drink");
  const foodItems = menuItems.filter((item) => item.category === "food");

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom, #faf8f5 0%, #f5f0e8 50%, #faf8f5 100%)",
      }}
    >
      {/* ヘッダー */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md shadow-sm z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/cafe"
            className="text-amber-800 hover:text-amber-600 transition-colors flex items-center gap-2"
          >
            <span>←</span>
            <span className="text-sm">退店する</span>
          </Link>
          <h1
            className="text-xl font-bold text-amber-900"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            MENU
          </h1>
          <div className="w-20" /> {/* スペーサー */}
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* カフェ名とウェルカムメッセージ */}
        <div className="text-center mb-8">
          <p className="text-amber-600 text-sm tracking-widest mb-2">
            ── NAZO CAFE ──
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold text-amber-900 mb-4"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Café ひみつの鍵
          </h2>
          <p className="text-amber-700/70 text-sm">
            ドリンクや軽食をご注文ください。
            <br />
            それぞれに謎がついてきます。
          </p>
        </div>

        {/* カテゴリ切り替え（モバイル向け） */}
        <div className="flex justify-center gap-2 mb-8 md:hidden">
          {[
            { key: "all", label: "すべて" },
            { key: "drink", label: "ドリンク" },
            { key: "food", label: "軽食" },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                setSelectedCategory(cat.key as "all" | "drink" | "food");
              }}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                selectedCategory === cat.key
                  ? "bg-amber-600 text-white"
                  : "bg-amber-100 text-amber-700 hover:bg-amber-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* メニュー（デスクトップ：2カラム、モバイル：1カラム） */}
        <div className="hidden md:grid md:grid-cols-2 gap-8">
          {/* ドリンクセクション */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">☕</span>
              <h3 className="text-xl font-bold text-amber-900">
                Drinks
                <span className="text-sm font-normal text-amber-600 ml-2">
                  コースター謎
                </span>
              </h3>
            </div>
            <div className="space-y-4">
              {drinkItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  isCleared={isCleared(item.id)}
                />
              ))}
            </div>
          </div>

          {/* 軽食セクション */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🍰</span>
              <h3 className="text-xl font-bold text-amber-900">
                Food
                <span className="text-sm font-normal text-amber-600 ml-2">
                  メイン謎
                </span>
              </h3>
            </div>
            <div className="space-y-4">
              {foodItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  isCleared={isCleared(item.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* モバイル表示 */}
        <div className="md:hidden space-y-4">
          {filteredItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              isCleared={isCleared(item.id)}
            />
          ))}
        </div>

        {/* フッター説明 */}
        <div className="mt-12 text-center">
          <div className="inline-block px-6 py-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-amber-700 text-sm mb-2">
              <span className="font-bold">難易度について</span>
            </p>
            <div className="flex justify-center gap-4 text-xs text-amber-600">
              <span>★☆☆ やさしい</span>
              <span>★★☆ ふつう</span>
              <span>★★★ むずかしい</span>
            </div>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="mt-8 py-6 bg-amber-900/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-amber-600/60 text-xs">
            © Café ひみつの鍵 - ひみつ箱のアトリエ
          </p>
        </div>
      </footer>
    </div>
  );
}

// メニューカードコンポーネント
function MenuCard({ item, isCleared }: { item: MenuItem; isCleared: boolean }) {
  const cardContent = (
    <div
      className={`relative p-4 rounded-lg border-2 transition-all ${
        item.available
          ? "bg-white border-amber-200 hover:border-amber-400 hover:shadow-md cursor-pointer"
          : "bg-gray-50 border-gray-200 cursor-not-allowed opacity-70"
      }`}
    >
      {/* クリア済みバッジ */}
      {isCleared && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md">
          <span className="text-white text-sm">✓</span>
        </div>
      )}

      {/* メニュー内容 */}
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-amber-900">{item.name}</h4>
        <DifficultyStars level={item.difficulty} />
      </div>
      <p className="text-sm text-amber-700/70 mb-3">{item.description}</p>

      {/* ステータス */}
      {item.available ? (
        <div className="flex items-center justify-between">
          <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded">
            {item.category === "drink" ? "コースター謎" : "メイン謎"}
          </span>
          <span className="text-amber-600 text-sm">注文する →</span>
        </div>
      ) : (
        <div className="text-center">
          <span className="text-xs text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
            Coming Soon...
          </span>
        </div>
      )}
    </div>
  );

  // 利用可能な場合はリンク、そうでなければdiv
  if (item.available && item.path) {
    return <Link to={item.path}>{cardContent}</Link>;
  }

  return cardContent;
}
