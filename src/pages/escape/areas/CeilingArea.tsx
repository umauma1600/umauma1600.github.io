import { useGame } from "../GameContext";

export default function CeilingArea() {
  const { state, dispatch, showDialog } = useGame();

  const canFly = state.activePillEffect === "yellow";
  const hasHole = state.flags.ceilingHoleOpened;

  const handleCeiling = () => {
    if (!hasHole) {
      if (state.selectedItem === "cooking_tools") {
        // 調理器具で天井に穴を開ける
        dispatch({ type: "OPEN_CEILING_HOLE" });
        showDialog(
          "調理器具で天井のひび割れを広げた！\n上の階への穴が開いた。",
        );
      } else {
        showDialog(
          "天井にはひび割れがある。\n何か道具を使えば穴を広げられそうだ。",
        );
      }
    } else if (!canFly) {
      showDialog("天井に穴が開いている。\n上の階が見えるが、登る手段がない...");
    }
  };

  const handleGoUp = () => {
    if (canFly && hasHole) {
      dispatch({ type: "CHANGE_AREA", area: "upper" });
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 天井のビジュアル */}
      <div className="relative bg-gray-700 rounded-lg p-6 w-full max-w-md">
        <div className="text-center mb-4">
          <span className="text-gray-400 text-sm">天井を見上げている</span>
        </div>

        {/* 天井 */}
        <button
          onClick={handleCeiling}
          disabled={hasHole && !canFly}
          className="relative w-full h-48 bg-gradient-to-b from-gray-600 to-gray-700 rounded-lg border-4 border-gray-500 group"
        >
          {/* 天井の模様 */}
          <div className="absolute inset-4 grid grid-cols-4 grid-rows-3 gap-1 opacity-30">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="bg-gray-500 rounded" />
            ))}
          </div>

          {/* ひび割れ / 穴 */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {hasHole ? (
              <div className="w-24 h-24 bg-black rounded-full border-4 border-gray-800 flex items-center justify-center">
                <span className="text-4xl">🕳️</span>
              </div>
            ) : (
              <div className="w-20 h-20 relative">
                {/* ひび割れのパターン */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1 h-16 bg-gray-800 rotate-12" />
                  <div className="w-1 h-12 bg-gray-800 -rotate-45 absolute" />
                  <div className="w-1 h-10 bg-gray-800 rotate-60 absolute left-2" />
                </div>
              </div>
            )}
          </div>

          {/* ホバー時のテキスト */}
          {!hasHole && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
              <span className="text-white font-bold text-center px-4">
                {state.selectedItem === "cooking_tools"
                  ? "🔧 調理器具で穴を開ける"
                  : "ひび割れがある"}
              </span>
            </div>
          )}
        </button>

        {/* 上に行くボタン */}
        {hasHole && canFly && (
          <div className="mt-4 text-center">
            <button
              onClick={handleGoUp}
              className="px-8 py-4 bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-lg rounded-lg transition-all transform hover:scale-105 animate-pulse"
            >
              ✨ 穴から上の階へ飛んでいく
            </button>
          </div>
        )}
      </div>

      {/* 説明 */}
      <div className="text-gray-300 text-sm max-w-md space-y-2">
        {!hasHole ? (
          <>
            <p>• 天井にひび割れが見える</p>
            <p>• 何か道具があれば穴を広げられそうだ</p>
          </>
        ) : (
          <>
            <p>• 天井に穴が開いている</p>
            <p>• 上の階が見える</p>
            {canFly ? (
              <p className="text-yellow-400">
                ✓ 黄色の錠剤の効果で飛ぶことができる！
              </p>
            ) : (
              <p className="text-gray-500">
                • 登る手段がない...何か方法はないだろうか
              </p>
            )}
          </>
        )}
      </div>

      {/* 黄色の錠剤のヒント */}
      {hasHole && !canFly && state.items.pill_yellow.obtained && (
        <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 max-w-md">
          <p className="text-yellow-400 text-sm">
            💡 ヒント: 黄色の錠剤を使えば空を飛べるかもしれない
          </p>
        </div>
      )}
    </div>
  );
}
