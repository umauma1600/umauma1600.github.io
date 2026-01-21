import { useState } from "react";
import { useGame } from "../GameContext";

// 植物図鑑の内容（画像を使用）
const plantBookPages = [
  {
    content: (
      <div className="flex justify-center">
        <img
          src="/assets/escape/plant-ginreika.png"
          alt="銀鈴花"
          className="max-w-full max-h-64 object-contain"
        />
      </div>
    ),
  },
  {
    content: (
      <div className="flex justify-center">
        <img
          src="/assets/escape/plant-yubaesou.png"
          alt="夕映草"
          className="max-w-full max-h-64 object-contain"
        />
      </div>
    ),
  },
  {
    content: (
      <div className="flex justify-center">
        <img
          src="/assets/escape/plant-yourinka.png"
          alt="陽輪花"
          className="max-w-full max-h-64 object-contain"
        />
      </div>
    ),
  },
  {
    content: (
      <div className="flex justify-center">
        <img
          src="/assets/escape/plant-shokugokuka.png"
          alt="喰獄花"
          className="max-w-full max-h-64 object-contain"
        />
      </div>
    ),
  },
  {
    content: (
      <div className="flex justify-center">
        <img
          src="/assets/escape/plant-tekkyokuju.png"
          alt="鉄棘樹"
          className="max-w-full max-h-64 object-contain"
        />
      </div>
    ),
  },
];

// 取扱説明書の内容
const manualBook = [
  {
    name: "時限爆弾",
    description:
      "アナログ時計の針に起爆装置の回路から引いた電線を接着し、設定した時刻に針が重なることで起爆する。そのため、爆弾自体はある程度衝撃への耐性がある。",
  },
  {
    name: "錠剤",
    description:
      "自力で行動可能な生物（動物）のみが服用することができる。効果時間は服用後1分間。",
  },
];

// 謎の本の内容（画像を使用）
const mysteryBookPages = [
  {
    label: "A",
    content: (
      <div className="flex justify-center">
        <img
          src="/assets/escape/mystery-a.png"
          alt="謎A"
          className="max-w-full max-h-64 object-contain"
        />
      </div>
    ),
  },
  {
    label: "B",
    content: (
      <div className="flex justify-center">
        <img
          src="/assets/escape/mystery-b.png"
          alt="謎B"
          className="max-w-full max-h-64 object-contain"
        />
      </div>
    ),
  },
  {
    label: "C",
    content: (
      <div className="flex justify-center">
        <img
          src="/assets/escape/mystery-c.png"
          alt="謎C"
          className="max-w-full max-h-64 object-contain"
        />
      </div>
    ),
  },
  {
    label: "D",
    content: (
      <div className="flex justify-center">
        <img
          src="/assets/escape/mystery-d.png"
          alt="謎D"
          className="max-w-full max-h-64 object-contain"
        />
      </div>
    ),
  },
  {
    label: "E",
    content: (
      <div className="flex justify-center">
        <img
          src="/assets/escape/mystery-e.png"
          alt="謎E"
          className="max-w-full max-h-64 object-contain"
        />
      </div>
    ),
  },
  {
    content: (
      <div className="flex justify-center">
        <img
          src="/assets/escape/mystery-f.png"
          alt="謎6"
          className="max-w-full max-h-64 object-contain"
        />
      </div>
    ),
  },
];

export default function BookViewer() {
  const { state, showBook } = useGame();
  const [currentPage, setCurrentPage] = useState(0);

  const handleClose = () => {
    showBook(null);
  };

  const getBookContent = () => {
    switch (state.showingBook) {
      case "plant":
        return {
          title: "植物図鑑",
          pages: plantBookPages,
        };
      case "manual":
        return {
          title: "取扱説明書",
          pages: manualBook.map((p) => ({
            label: p.name,
            content: (
              <div>
                <h3 className="text-2xl font-bold mb-4 border-b border-gray-600 pb-2">
                  {p.name}
                </h3>
                <p className="text-lg leading-relaxed">{p.description}</p>
              </div>
            ),
          })),
        };
      case "mystery":
        return {
          title: "謎の本",
          pages: mysteryBookPages,
        };
      default:
        return { title: "", pages: [] };
    }
  };

  const book = getBookContent();

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-amber-100 rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-amber-800 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{book.title}</h2>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-8 min-h-[300px] bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%3E%3Crect%20fill%3D%22%23f5f0e1%22%20width%3D%22100%22%20height%3D%22100%22%2F%3E%3C%2Fsvg%3E')]">
          <div className="text-gray-800">
            {book.pages[currentPage]?.content}
          </div>
        </div>

        {/* ページナビ */}
        {book.pages.length > 1 && (
          <div className="bg-amber-200 px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => {
                setCurrentPage((p) => Math.max(0, p - 1));
              }}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-amber-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ◀ 前へ
            </button>
            <span className="text-amber-800">
              {currentPage + 1} / {book.pages.length}
            </span>
            <button
              onClick={() => {
                setCurrentPage((p) => Math.min(book.pages.length - 1, p + 1));
              }}
              disabled={currentPage === book.pages.length - 1}
              className="px-4 py-2 bg-amber-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              次へ ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
