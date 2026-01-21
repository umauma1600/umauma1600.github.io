import { useState } from "react";
import { useGame } from "../GameContext";
import { pillInfo } from "../types";

export default function ShelfArea() {
  const { state, obtainItem, openBox, showBook, showDialog } = useGame();
  const [boxCode, setBoxCode] = useState(["0", "0", "0"]);
  const [showBoxInput, setShowBoxInput] = useState(false);

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
      // 箱が開いている場合、錠剤の効果説明を表示
      showDialog(
        "箱の中には錠剤の効果が書かれた紙が入っていた。\n\n" +
          Object.entries(pillInfo)
            .map(([, info]) => `【${info.name}】${info.effect}`)
            .join("\n"),
      );
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
      showDialog("箱が開いた！\n中には錠剤の効果が書かれた紙が入っていた。");
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
    </div>
  );
}
