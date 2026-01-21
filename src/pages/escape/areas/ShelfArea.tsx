import { useState } from "react";
import { useGame } from "../GameContext";

// 箱の中身の画像データ
const boxContentPages = [
  {
    label: "一覧表",
    src: "/assets/escape/pill-chart.png",
    alt: "錠剤の効果一覧",
  },
  {
    label: "ドクガアール",
    src: "/assets/escape/pill-dokugaaru.png",
    alt: "ドクガアール",
  },
  {
    label: "アツクナーイ",
    src: "/assets/escape/pill-atsukunai.png",
    alt: "アツクナーイ",
  },
  {
    label: "タカクトーブ",
    src: "/assets/escape/pill-takakutobu.png",
    alt: "タカクトーブ",
  },
  {
    label: "オボレナーイ",
    src: "/assets/escape/pill-oborenai.png",
    alt: "オボレナーイ",
  },
  {
    label: "チカラモーチ",
    src: "/assets/escape/pill-chikaramochi.png",
    alt: "チカラモーチ",
  },
];

export default function ShelfArea() {
  const { state, obtainItem, openBox, showBook, showDialog } = useGame();
  const [boxCode, setBoxCode] = useState(["0", "0", "0"]);
  const [showBoxInput, setShowBoxInput] = useState(false);
  const [showBoxContent, setShowBoxContent] = useState(false);
  const [boxContentPage, setBoxContentPage] = useState(0);

  const handlePillRed = () => {
    if (!state.items.pill_red.obtained) {
      obtainItem("pill_red");
      showDialog("赤い錠剤を手に入れた！");
    }
  };

  const handlePillYellow = () => {
    if (!state.items.pill_yellow.obtained) {
      obtainItem("pill_yellow");
      showDialog("黄色い錠剤を手に入れた！");
    }
  };

  const handleLockedBox = () => {
    if (!state.items.locked_box.obtained) {
      obtainItem("locked_box");
      showDialog("3桁錠のついた箱を手に入れた！");
    } else if (!state.flags.boxOpened) {
      setShowBoxInput(true);
    } else {
      // 箱が開いている場合、錠剤の効果説明を画像で表示
      setShowBoxContent(true);
    }
  };

  const handleCodeChange = (index: number, direction: number) => {
    setBoxCode((prev) => {
      const newCode = [...prev];
      let num = parseInt(newCode[index]) + direction;
      if (num < 0) num = 9;
      if (num > 9) num = 0;
      newCode[index] = num.toString();
      return newCode;
    });
  };

  const handleOpenBox = () => {
    const code = boxCode.join("");
    if (openBox(code)) {
      setShowBoxInput(false);
      setShowBoxContent(true);
    } else {
      showDialog("開かない...。番号が違うようだ。");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 棚のビジュアル */}
      <div className="relative bg-gray-600 rounded-lg p-6 w-full max-w-md">
        {/* 本棚 */}
        <div className="bg-amber-800 rounded-lg p-4">
          {/* 上段：本 */}
          <div className="flex gap-2 mb-4 justify-center">
            <button
              onClick={() => {
                showBook("plant");
              }}
              className="w-20 h-28 bg-green-700 hover:bg-green-600 rounded flex items-center justify-center transition-colors"
            >
              <span className="text-white text-xs text-center leading-tight">
                植物
                <br />
                図鑑
              </span>
            </button>
            <button
              onClick={() => {
                showBook("manual");
              }}
              className="w-20 h-28 bg-blue-700 hover:bg-blue-600 rounded flex items-center justify-center transition-colors"
            >
              <span className="text-white text-xs text-center leading-tight">
                取扱
                <br />
                説明書
              </span>
            </button>
            <button
              onClick={() => {
                showBook("mystery");
              }}
              className="w-20 h-28 bg-purple-700 hover:bg-purple-600 rounded flex items-center justify-center transition-colors"
            >
              <span className="text-white text-xs text-center leading-tight">
                謎の本
              </span>
            </button>
          </div>

          {/* 棚板 */}
          <div className="h-2 bg-amber-700 rounded mb-4" />

          {/* 下段：アイテム */}
          <div className="flex gap-4 justify-center items-end">
            {/* 赤い錠剤 */}
            <button
              onClick={handlePillRed}
              disabled={state.items.pill_red.obtained}
              className={`w-14 h-16 rounded-lg flex flex-col items-center justify-center transition-all ${
                state.items.pill_red.obtained
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-red-900/50 hover:bg-red-800/50 hover:scale-105 border-2 border-red-400"
              }`}
            >
              {state.items.pill_red.obtained ? (
                <span className="text-gray-400 text-xs">取得済</span>
              ) : (
                <>
                  <span className="text-xl">❤️</span>
                  <span className="text-red-300 text-xs">赤</span>
                </>
              )}
            </button>

            {/* 黄色い錠剤 */}
            <button
              onClick={handlePillYellow}
              disabled={state.items.pill_yellow.obtained}
              className={`w-14 h-16 rounded-lg flex flex-col items-center justify-center transition-all ${
                state.items.pill_yellow.obtained
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-yellow-900/50 hover:bg-yellow-800/50 hover:scale-105 border-2 border-yellow-400"
              }`}
            >
              {state.items.pill_yellow.obtained ? (
                <span className="text-gray-400 text-xs">取得済</span>
              ) : (
                <>
                  <span className="text-xl">⭐</span>
                  <span className="text-yellow-300 text-xs">黄</span>
                </>
              )}
            </button>

            {/* 3桁錠の箱 */}
            <button
              onClick={handleLockedBox}
              className={`w-20 h-16 rounded-lg flex flex-col items-center justify-center transition-all ${
                state.flags.boxOpened
                  ? "bg-green-900/50 border-2 border-green-400"
                  : "bg-amber-900/50 hover:bg-amber-800/50 hover:scale-105 border-2 border-amber-400"
              }`}
            >
              <span className="text-2xl">
                {state.flags.boxOpened ? "📭" : "📦"}
              </span>
              <span className="text-amber-300 text-xs">
                {state.flags.boxOpened ? "開封済" : "3桁錠"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3桁錠の入力モーダル */}
      {showBoxInput && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-white text-xl font-bold mb-4 text-center">
              3桁錠の箱
            </h3>

            {/* ダイヤル */}
            <div className="flex justify-center gap-4 mb-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <button
                    onClick={() => {
                      handleCodeChange(i, 1);
                    }}
                    className="w-12 h-8 bg-gray-600 hover:bg-gray-500 rounded text-white"
                  >
                    ▲
                  </button>
                  <div className="w-12 h-16 bg-gray-700 rounded my-2 flex items-center justify-center text-white text-3xl font-mono">
                    {boxCode[i]}
                  </div>
                  <button
                    onClick={() => {
                      handleCodeChange(i, -1);
                    }}
                    className="w-12 h-8 bg-gray-600 hover:bg-gray-500 rounded text-white"
                  >
                    ▼
                  </button>
                </div>
              ))}
            </div>

            {/* ボタン */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setShowBoxInput(false);
                }}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg"
              >
                閉じる
              </button>
              <button
                onClick={handleOpenBox}
                className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg"
              >
                開ける
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 箱の中身表示モーダル */}
      {showBoxContent && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-amber-100 rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* ヘッダー */}
            <div className="bg-amber-800 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">箱の中身</h2>
              <button
                onClick={() => {
                  setShowBoxContent(false);
                  setBoxContentPage(0);
                }}
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
            <div className="p-6 flex justify-center bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%3E%3Crect%20fill%3D%22%23f5f0e1%22%20width%3D%22100%22%20height%3D%22100%22%2F%3E%3C%2Fsvg%3E')]">
              <img
                src={boxContentPages[boxContentPage].src}
                alt={boxContentPages[boxContentPage].alt}
                className="max-w-full max-h-[50vh] object-contain"
              />
            </div>

            {/* ページナビ */}
            <div className="bg-amber-200 px-6 py-4 flex items-center justify-between">
              <button
                onClick={() => {
                  setBoxContentPage((p) => Math.max(0, p - 1));
                }}
                disabled={boxContentPage === 0}
                className="px-4 py-2 bg-amber-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ◀ 前へ
              </button>
              <span className="text-amber-800">
                {boxContentPage + 1} / {boxContentPages.length}
                <span className="ml-2">
                  ({boxContentPages[boxContentPage].label})
                </span>
              </span>
              <button
                onClick={() => {
                  setBoxContentPage((p) =>
                    Math.min(boxContentPages.length - 1, p + 1),
                  );
                }}
                disabled={boxContentPage === boxContentPages.length - 1}
                className="px-4 py-2 bg-amber-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                次へ ▶
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
