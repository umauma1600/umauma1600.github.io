import { useGame } from "../GameContext";

export default function LowerFloorArea() {
  const { state, obtainItem, dispatch, showDialog } = useGame();

  const hasAntidote = state.activePillEffect === "blue";
  const pathCleared = state.flags.dickiaPathCleared;

  const handleDickia = () => {
    if (!pathCleared) {
      if (state.selectedItem === "cooking_tools") {
        // 調理器具でディッキアを切り開く
        dispatch({ type: "CLEAR_DICKIA_PATH" });
        showDialog(
          "調理器具でディッキアの棘を切り払った！\n奥への道が開けた。",
        );
      } else {
        showDialog(
          "ディッキアという植物が生い茂っている。\n鋭い棘があり、素手では進めない。",
        );
      }
    }
  };

  const handleRafflesia = () => {
    if (!pathCleared) {
      showDialog("ディッキアの棘が邪魔で近づけない。");
      return;
    }

    if (!hasAntidote) {
      // 毒ガスでBAD END
      showDialog(
        "ラフレシアに近づいた瞬間、\n強烈な毒ガスが放出された！\n\n意識が遠のいていく...",
      );
      setTimeout(() => {
        dispatch({ type: "TRIGGER_BAD_END", payload: "poison" });
      }, 2000);
      return;
    }

    if (!state.items.key.obtained) {
      // 青い錠剤の効果で毒を無効化して鍵を入手
      obtainItem("key");
      showDialog(
        "青い錠剤の効果で毒ガスを無効化した！\nラフレシアの中から鍵を発見した！",
      );
    } else {
      showDialog("ラフレシアの中はもう空っぽだ。");
    }
  };

  const handleGoBack = () => {
    dispatch({ type: "CHANGE_AREA", area: "room" });
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 下の階のビジュアル */}
      <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg p-6 w-full max-w-md">
        <div className="text-center mb-4">
          <span className="text-gray-400 text-sm">🔻 下の階（地下）</span>
        </div>

        <div className="flex gap-4 justify-center items-end">
          {/* ディッキア */}
          <button
            onClick={handleDickia}
            disabled={pathCleared}
            className={`relative w-32 h-40 rounded-lg flex flex-col items-center justify-center transition-all ${
              pathCleared
                ? "bg-gray-700"
                : "bg-green-900/50 hover:bg-green-800/50 border-2 border-green-600 group"
            }`}
          >
            {pathCleared ? (
              <>
                <span className="text-4xl opacity-50">🌿</span>
                <span className="text-gray-500 text-xs mt-2">切り開いた</span>
              </>
            ) : (
              <>
                {/* ディッキアの棘 */}
                <div className="relative">
                  <span className="text-5xl">🌵</span>
                  <div className="absolute -top-1 -right-1 text-red-500 text-lg">
                    ⚠️
                  </div>
                </div>
                <span className="text-green-300 text-xs mt-2">ディッキア</span>
                <span className="text-gray-400 text-xs">（棘植物）</span>

                {/* ホバー時 */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                  <span className="text-white font-bold text-center text-sm px-2">
                    {state.selectedItem === "cooking_tools"
                      ? "🔧 切り開く"
                      : "棘が危険"}
                  </span>
                </div>
              </>
            )}
          </button>

          {/* ラフレシア */}
          <button
            onClick={handleRafflesia}
            disabled={state.items.key.obtained}
            className={`relative w-40 h-48 rounded-lg flex flex-col items-center justify-center transition-all ${
              state.items.key.obtained
                ? "bg-gray-700 cursor-not-allowed"
                : pathCleared
                  ? "bg-red-900/50 hover:bg-red-800/50 border-2 border-red-600 group"
                  : "bg-gray-700 opacity-50"
            }`}
          >
            {state.items.key.obtained ? (
              <>
                <span className="text-5xl opacity-50">🌺</span>
                <span className="text-gray-500 text-xs mt-2">空っぽ</span>
              </>
            ) : (
              <>
                {/* ラフレシア */}
                <div className="relative">
                  <span className="text-6xl">🌺</span>
                  {/* 毒ガスの表現 */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <span className="text-purple-400 text-2xl animate-pulse">
                      ☠️
                    </span>
                  </div>
                </div>
                <span className="text-red-300 text-xs mt-2">ラフレシア</span>
                <span className="text-gray-400 text-xs">（毒植物）</span>

                {/* ホバー時 */}
                {pathCleared && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <span className="text-white font-bold text-center text-sm px-2">
                      {hasAntidote ? "💊 近づく（解毒済）" : "⚠️ 毒ガスに注意"}
                    </span>
                  </div>
                )}
              </>
            )}
          </button>
        </div>

        {/* 梯子（戻る） */}
        <div className="mt-6 text-center">
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-all"
          >
            🪜 梯子を登って戻る
          </button>
        </div>
      </div>

      {/* 説明 */}
      <div className="text-gray-300 text-sm max-w-md space-y-2">
        <p>• 暗い地下室。植物が生い茂っている</p>
        {!pathCleared && (
          <p className="text-yellow-400">• ディッキアの棘が道を塞いでいる</p>
        )}
        {pathCleared && !state.items.key.obtained && (
          <>
            <p className="text-green-400">✓ ディッキアを切り開いた</p>
            <p className="text-red-400">• ラフレシアが毒ガスを放っている</p>
          </>
        )}
        {state.items.key.obtained && (
          <p className="text-green-400">✓ ラフレシアから鍵を入手した</p>
        )}
      </div>

      {/* ヒント */}
      {pathCleared && !state.items.key.obtained && !hasAntidote && (
        <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4 max-w-md">
          <p className="text-blue-400 text-sm">
            💡 ヒント: 毒を無効化する方法があるかもしれない...
          </p>
        </div>
      )}

      {hasAntidote && (
        <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4 max-w-md">
          <p className="text-blue-400 text-sm">
            💊 青い錠剤の効果: 毒が効かない状態（残り時間あり）
          </p>
        </div>
      )}
    </div>
  );
}
