import { useGame } from "../GameContext";

export default function KitchenArea() {
  const { state, obtainItem, showDialog } = useGame();

  const handlePillWhite = () => {
    if (!state.items.pill_white.obtained) {
      obtainItem("pill_white");
      showDialog("白い錠剤を手に入れた！");
    }
  };

  const handleCookingTools = () => {
    if (!state.items.cooking_tools.obtained) {
      obtainItem("cooking_tools");
      showDialog(
        "調理器具を手に入れた！\n鍋やボウルがある。水を汲むのに使えそうだ。",
      );
    }
  };

  const handleSink = () => {
    showDialog("水道を回してみるが、水は出ない。");
  };

  const handleStove = () => {
    showDialog("コンロを操作してみるが、火はつかない。");
  };

  const handleVent = () => {
    showDialog(
      "換気扇を調べる。スイッチを入れてみるが動かない。\n換気扇の後ろは壁になっており、空気の入る隙間はない。",
    );
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* キッチンのビジュアル */}
      <div className="relative bg-gray-600 rounded-lg p-6 w-full max-w-md">
        {/* 上部の棚 */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 h-16 bg-white rounded border-2 border-gray-300 flex items-center justify-center">
            <span className="text-gray-400 text-xs">棚</span>
          </div>
          <div className="flex-1 h-16 bg-white rounded border-2 border-gray-300 flex items-center justify-center">
            <span className="text-gray-400 text-xs">棚</span>
          </div>
          <button
            onClick={handleVent}
            className="w-20 h-16 bg-gray-400 hover:bg-gray-300 rounded border-2 border-gray-500 flex items-center justify-center transition-colors"
          >
            <span className="text-gray-600 text-xs">換気扇</span>
          </button>
        </div>

        {/* カウンター */}
        <div className="bg-white rounded-lg p-4 border-2 border-gray-300">
          <div className="flex items-end gap-4">
            {/* 白い錠剤の瓶 */}
            <button
              onClick={handlePillWhite}
              disabled={state.items.pill_white.obtained}
              className={`w-12 h-16 rounded-lg flex items-center justify-center transition-all ${
                state.items.pill_white.obtained
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-100 hover:scale-105"
              }`}
            >
              {state.items.pill_white.obtained ? (
                <span className="text-gray-400 text-xs">取得済</span>
              ) : (
                <img
                  src="/assets/escape/pill-icon-circle.png"
                  alt="白い錠剤"
                  className="w-10 h-14 object-contain"
                />
              )}
            </button>

            {/* 水道 */}
            <button
              onClick={handleSink}
              className="flex-1 h-20 bg-gray-300 hover:bg-gray-200 rounded flex items-center justify-center transition-colors"
            >
              <div className="text-center">
                <span className="text-3xl">🚰</span>
                <p className="text-xs text-gray-600">水道</p>
              </div>
            </button>

            {/* コンロ */}
            <button
              onClick={handleStove}
              className="w-24 h-20 bg-gray-800 hover:bg-gray-700 rounded flex items-center justify-center transition-colors"
            >
              <div className="text-center">
                <div className="flex gap-1 mb-1">
                  <div className="w-4 h-4 rounded-full bg-gray-600" />
                  <div className="w-4 h-4 rounded-full bg-gray-600" />
                </div>
                <p className="text-xs text-gray-400">コンロ</p>
              </div>
            </button>
          </div>

          {/* 調理器具 */}
          <div className="mt-4">
            <button
              onClick={handleCookingTools}
              disabled={state.items.cooking_tools.obtained}
              className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                state.items.cooking_tools.obtained
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-orange-100 hover:bg-orange-50 border-2 border-orange-200 hover:scale-[1.02]"
              }`}
            >
              {state.items.cooking_tools.obtained ? (
                <span className="text-gray-500">調理器具は取得済み</span>
              ) : (
                <>
                  <span className="text-2xl">🍳</span>
                  <span className="text-2xl">🥘</span>
                  <span className="text-2xl">🥣</span>
                  <span className="text-sm text-orange-700 ml-2">
                    調理器具を調べる
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
