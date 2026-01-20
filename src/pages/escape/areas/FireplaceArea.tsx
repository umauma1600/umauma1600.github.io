import { useGame } from "../GameContext";

export default function FireplaceArea() {
  const { state, dispatch, pressButton, showDialog, hasPillEffect } = useGame();

  const handleFireplace = () => {
    if (!state.flags.fireExtinguished) {
      // 火がついている状態
      if (state.selectedItem === "cooking_tools" && state.flags.waterInPot) {
        // 水を入れた調理器具を使う
        dispatch({ type: "EXTINGUISH_FIRE" });
        showDialog(
          "水をかけて火を消した！\n暖炉の奥にボタンがあることに気づいた。",
        );
      } else if (hasPillEffect("pill_red")) {
        // 赤い錠剤の効果中（ただしTRUE ENDに行けなくなる）
        dispatch({ type: "EXTINGUISH_FIRE" });
        showDialog(
          "熱さ耐性があるので、直接火を消すことができた。\n暖炉の奥にボタンがある。",
        );
      } else {
        showDialog(
          "暖炉で炎が燃えている。もちろん熱い。\n炎の後ろに何かがあるようだが、このままでは近づけない。",
        );
      }
    }
  };

  const handleButton = () => {
    if (state.flags.fireExtinguished && !state.flags.button1Pressed) {
      pressButton(1);
      showDialog("ボタン①を押した！\n「カチッ」という音がした。");
    } else if (state.flags.button1Pressed) {
      showDialog("ボタン①は既に押されている。");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 暖炉のビジュアル */}
      <div className="relative bg-gray-600 rounded-lg p-6 w-full max-w-md">
        {/* 暖炉の枠 */}
        <div className="bg-amber-200 rounded-lg p-4 border-4 border-amber-300">
          {/* 上部の装飾 */}
          <div className="h-8 bg-amber-300 rounded-t mb-2" />

          {/* 暖炉の開口部 */}
          <button
            onClick={handleFireplace}
            className="w-full h-48 bg-gray-800 rounded flex items-center justify-center relative overflow-hidden transition-all hover:opacity-90"
          >
            {state.flags.fireExtinguished ? (
              // 火が消えた状態
              <div className="text-center">
                <p className="text-gray-400 mb-2">火は消えている</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleButton();
                  }}
                  className={`px-6 py-3 rounded-lg font-bold transition-all ${
                    state.flags.button1Pressed
                      ? "bg-green-600 text-white"
                      : "bg-red-500 hover:bg-red-400 text-white animate-pulse"
                  }`}
                >
                  {state.flags.button1Pressed ? "✓ ボタン①" : "ON ボタン①"}
                </button>
              </div>
            ) : (
              // 火がついている状態
              <div className="text-center">
                <div className="text-6xl animate-pulse">🔥</div>
                <p className="text-orange-300 mt-2">炎が燃えている</p>
                <p className="text-gray-500 text-sm mt-1">クリックして調べる</p>
              </div>
            )}
          </button>

          {/* 下部 */}
          <div className="h-4 bg-amber-700 rounded-b mt-2" />
        </div>
      </div>

      {/* 説明 */}
      <div className="text-gray-300 text-sm max-w-md space-y-2">
        {!state.flags.fireExtinguished ? (
          <>
            <p>• 暖炉で炎が燃えている。もちろん熱い</p>
            <p>• 炎の後ろにボタン①があるようだ</p>
            <p className="text-yellow-400">
              → 何か水をかけられるものがあれば火を消せそうだ
            </p>
          </>
        ) : (
          <>
            <p>• 火は消えている</p>
            <p>
              • 暖炉自体に煙突などはなく、隙間から空気が入らないようになっている
            </p>
            {!state.flags.button1Pressed && (
              <p className="text-green-400">• ボタン①が押せる状態だ</p>
            )}
          </>
        )}
      </div>

      {/* ヒント */}
      {!state.flags.fireExtinguished &&
        state.items.cooking_tools.obtained &&
        !state.flags.waterInPot && (
          <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 max-w-md">
            <p className="text-yellow-400 text-sm">
              💡 調理器具で水槽から水を汲んでくることができそうだ
            </p>
          </div>
        )}
    </div>
  );
}
