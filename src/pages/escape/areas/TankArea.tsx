import { useGame } from "../GameContext";

export default function TankArea() {
  const { state, dispatch, pressButton, showDialog, hasPillEffect } = useGame();

  const handleTank = () => {
    if (state.selectedItem === "cooking_tools" && !state.flags.waterInPot) {
      dispatch({ type: "FILL_WATER" });
      showDialog("調理器具で水槽から水を汲んだ！");
      return;
    }
    showDialog("高さ150センチ程度の水槽。中に入ることができる。");
  };

  const handleEnterTank = () => {
    if (!state.flags.button2Pressed) {
      // ボタンを押しに行く
      if (hasPillEffect("pill_blue")) {
        pressButton(2);
        showDialog(
          "水中呼吸ができるので、余裕で底まで潜れた。\nボタン②を押した！",
        );
      } else {
        // 普通に入っても押せる
        pressButton(2);
        showDialog(
          "水槽に入って底のボタン②を押した！\n服は濡れたが、溺れることはなかった。",
        );
      }
    } else {
      showDialog("水槽の底のボタン②は既に押されている。");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 水槽のビジュアル */}
      <div className="relative bg-gray-600 rounded-lg p-6 w-full max-w-md">
        <button
          onClick={handleTank}
          className="w-full h-64 bg-blue-900/50 rounded-lg border-4 border-blue-300/30 relative overflow-hidden hover:bg-blue-800/50 transition-colors"
        >
          {/* 水面の効果 */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-blue-400/30" />

          {/* 水槽の中 */}
          <div className="absolute inset-4 flex flex-col items-center justify-between">
            <p className="text-blue-200 text-sm">水槽</p>

            {/* 底のボタン */}
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center font-bold ${
                state.flags.button2Pressed
                  ? "bg-green-600 text-white"
                  : "bg-gray-500 text-gray-300"
              }`}
            >
              {state.flags.button2Pressed ? "✓" : "②"}
            </div>
          </div>

          {/* 水の波紋アニメーション */}
          <div className="absolute inset-0 opacity-30">
            <div
              className="absolute w-full h-full"
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(100,200,255,0.1) 10px, rgba(100,200,255,0.1) 20px)",
                animation: "wave 3s linear infinite",
              }}
            />
          </div>
        </button>

        {/* アクションボタン */}
        <div className="mt-4 flex gap-4 justify-center">
          {state.items.cooking_tools.obtained && !state.flags.waterInPot && (
            <button
              onClick={handleTank}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <span>🍳</span>
              <span>水を汲む</span>
            </button>
          )}
          <button
            onClick={handleEnterTank}
            disabled={state.flags.button2Pressed}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              state.flags.button2Pressed
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >
            <span>🏊</span>
            <span>水槽に入る</span>
          </button>
        </div>
      </div>

      {/* アニメーション用CSS */}
      <style>{`
        @keyframes wave {
          0% { transform: translateY(0); }
          100% { transform: translateY(20px); }
        }
      `}</style>
    </div>
  );
}
