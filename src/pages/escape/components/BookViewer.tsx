import { useState } from "react";
import { useGame } from "../GameContext";

// 植物図鑑の内容
const plantBook = [
  {
    name: "鈴蘭",
    description:
      "香りがいい反面、毒があるため食用には不向き。白い花弁をインクに使用すると綺麗な発色となる。",
  },
  {
    name: "チューリップ",
    description:
      "和名は「鬱金香（うっこんこう）」。ウコンに似たほろ苦い香りがすることからこの名がついた。",
  },
  {
    name: "ヒマワリ",
    description:
      "種実を食用や油糧とするため、あるいは花を花卉（かき）として観賞するために広く栽培される。",
  },
  {
    name: "ラフレシア",
    description:
      "異臭を放つ巨大な花として有名。独特なにおいによって生物を誘い、誘われた生物を吸収する。人間など、いかなるものでも消化し溶かしきることが可能。",
  },
  {
    name: "ディッキア",
    description:
      "葉に触れた生物を問答無用で取り込み瞬時に死に至らしめる。また、非常に硬いため、刃物で伐採は不可能であり、火にも耐性がある。枯らす場合は毒を用いる。",
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

// 謎の本の内容
const mysteryBookPages = [
  {
    label: "A",
    content: (
      <div className="space-y-6 text-2xl text-center">
        <p>
          い
          <span className="inline-block w-8 h-8 border-2 border-gray-600 text-lg leading-8">
            ?
          </span>
          <span className="inline-block w-8 h-8 border-2 border-gray-600 text-lg leading-8">
            ?
          </span>
          も
        </p>
        <p>
          な
          <span className="inline-block w-8 h-8 border-2 border-gray-600 text-lg leading-8">
            ?
          </span>
          <span className="inline-block w-8 h-8 border-2 border-gray-600 text-lg leading-8">
            ?
          </span>
          わ
        </p>
        <p>
          メ
          <span className="inline-block w-8 h-8 border-2 border-gray-600 text-lg leading-8">
            ?
          </span>
          <span className="inline-block w-8 h-8 border-2 border-gray-600 text-lg leading-8">
            ?
          </span>
          ック
        </p>
      </div>
    ),
  },
  {
    label: "B",
    content: (
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-4 text-xl">
          <span>朝</span>
          <span className="border-2 border-gray-600 px-4 py-2 rounded">
            まりも
          </span>
        </div>
        <div className="flex items-center justify-center gap-4 text-xl">
          <span>↓</span>
          <span className="border-2 border-gray-600 px-4 py-2 rounded">
            こよみ
          </span>
        </div>
        <div className="flex items-center justify-center gap-4 text-xl">
          <span>夕方</span>
          <span className="border-2 border-gray-600 px-4 py-2 rounded">
            うどん
          </span>
        </div>
        <div className="mt-6 flex justify-end">
          <div className="text-4xl">🧭</div>
        </div>
        <div className="mt-2 text-center text-3xl">☀️</div>
      </div>
    ),
  },
  {
    label: "C",
    content: (
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-4 text-3xl">
          <span>🐱</span>
          <span>→</span>
          <span>🪙</span>
        </div>
        <div className="flex items-center justify-center gap-4 text-3xl">
          <span>🐷</span>
          <span>→</span>
          <span>💎</span>
        </div>
        <div className="flex items-center justify-center gap-4 text-3xl">
          <span>🐴</span>
          <span>→</span>
          <span className="text-4xl">❓</span>
        </div>
      </div>
    ),
  },
  {
    label: "D",
    content: (
      <div className="text-center">
        <p className="text-3xl">角のない色は？</p>
      </div>
    ),
  },
  {
    label: "E",
    content: (
      <div className="text-center">
        <p className="text-2xl mb-6">順番につなげ</p>
        <div className="grid grid-cols-5 gap-2 text-lg">
          <span>🍈</span>
          <span>こ</span>
          <span>た</span>
          <span>🐤</span>
          <span>ま</span>
          <span>せ</span>
          <span>あ</span>
          <span>え</span>
          <span className="invisible">.</span>
          <span>ね</span>
          <span>い</span>
          <span>🎅</span>
          <span>た</span>
          <span>ー</span>
          <span className="invisible">.</span>
          <span>か</span>
          <span>は</span>
          <span>ま</span>
          <span>🦍</span>
          <span>み</span>
          <span>🖍️</span>
          <span>く</span>
          <span>ら</span>
          <span>や</span>
          <span>🦴</span>
        </div>
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
          pages: plantBook.map((p) => ({
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
              {book.pages[currentPage]?.label && (
                <span className="ml-2">({book.pages[currentPage].label})</span>
              )}
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
