import { useGame } from "../GameContext";

export default function UpperFloorArea() {
  const { state, obtainItem, dispatch, showDialog, hasPillEffect } = useGame();

  const hasFireResistance = hasPillEffect("pill_red");
  const canFly = hasPillEffect("pill_yellow");

  const handleBoilingTank = () => {
    if (state.flags.bombDisarmed) {
      showDialog("煮えたぎるタンク。もう中には何もない。");
      return;
    }

    if (!hasFireResistance) {
      showDialog(
        "タンクの中で何かが煮えたぎっている！\n熱すぎて手を入れることはできない...",
      );
      return;
    }

    // 赤い錠剤の効果で爆弾を取り出せる
    if (!state.items.bomb.obtained) {
      obtainItem("bomb");
      showDialog(
        "赤い錠剤の効果で熱さを感じない！\nタンクの中から時限爆弾を取り出した！",
      );
    }
  };

  const handleDisarmBomb = () => {
    if (state.items.bomb.obtained && !state.flags.bombDisarmed) {
      dispatch({ type: "DISARM_BOMB" });
      showDialog("時限爆弾を解除した！\nこれで安全に脱出できる。");
    }
  };

  const handleGoDown = () => {
    if (canFly) {
      dispatch({ type: "CHANGE_AREA", area: "room" });
    } else {
      showDialog("飛ぶ手段がないと下に降りられない...");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 上の階のビジュアル */}
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="text-center mb-4">
          <span className="text-gray-400 text-sm">🔺 上の階（屋根裏）</span>
        </div>

        {/* 煮えたぎるタンク */}
        <div className="flex justify-center">
          <button
            onClick={handleBoilingTank}
            disabled={state.flags.bombDisarmed}
            className={`relative w-48 h-56 rounded-lg flex flex-col items-center justify-center transition-all ${
              state.flags.bombDisarmed
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-orange-900/50 hover:bg-orange-800/50 border-2 border-orange-600 group"
            }`}
          >
            {/* タンク */}
            <div className="relative">
              {/* タンク本体 */}
              <div className="w-32 h-40 bg-gradient-to-b from-gray-500 to-gray-600 rounded-lg border-4 border-gray-400 relative overflow-hidden">
                {/* 煮えたぎる液体 */}
                {!state.flags.bombDisarmed && (
                  <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-orange-600 to-orange-400 animate-pulse">
                    {/* 泡 */}
                    <div className="absolute top-2 left-4 w-3 h-3 bg-orange-300 rounded-full animate-bounce" />
                    <div className="absolute top-4 right-6 w-2 h-2 bg-orange-200 rounded-full animate-bounce delay-100" />
                    <div className="absolute top-1 left-1/2 w-4 h-4 bg-orange-300 rounded-full animate-bounce delay-200" />
                  </div>
                )}

                {/* 爆弾（まだ取り出していない場合） */}
                {!state.items.bomb.obtained && !state.flags.bombDisarmed && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <span className="text-3xl">💣</span>
                  </div>
                )}
              </div>

              {/* 蒸気 */}
              {!state.flags.bombDisarmed && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  <span className="text-2xl animate-pulse">🔥</span>
                  <span className="text-2xl animate-pulse delay-100">💨</span>
                  <span className="text-2xl animate-pulse delay-200">🔥</span>
                </div>
              )}
            </div>

            <span className="text-orange-300 text-sm mt-3">
              {state.flags.bombDisarmed ? "空のタンク" : "煮えたぎるタンク"}
            </span>

            {/* ホバー時 */}
            {!state.flags.bombDisarmed && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                <span className="text-white font-bold text-center text-sm px-2">
                  {hasFireResistance
                    ? "🔥 手を入れる（耐火状態）"
                    : "⚠️ 熱すぎる！"}
                </span>
              </div>
            )}
          </button>
        </div>

        {/* 爆弾解除ボタン */}
        {state.items.bomb.obtained && !state.flags.bombDisarmed && (
          <div className="mt-6 text-center">
            <button
              onClick={handleDisarmBomb}
              className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-lg rounded-lg transition-all transform hover:scale-105 animate-pulse"
            >
              💣 時限爆弾を解除する
            </button>
          </div>
        )}

        {/* 下に戻る */}
        <div className="mt-6 text-center">
          <button
            onClick={handleGoDown}
            disabled={!canFly}
            className={`px-6 py-3 font-bold rounded-lg transition-all ${
              canFly
                ? "bg-yellow-600 hover:bg-yellow-500 text-white"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            {canFly ? "✨ 穴から下に飛んで戻る" : "🕳️ 飛ぶ手段がない..."}
          </button>
        </div>
      </div>

      {/* ヒント */}
      {!state.items.bomb.obtained && !hasFireResistance && (
        <div className="bg-red-900/30 border border-red-600 rounded-lg p-4 max-w-md">
          <p className="text-red-400 text-sm">
            💡 ヒント: 熱さに耐える方法があるかもしれない...
          </p>
        </div>
      )}

      {hasFireResistance && !state.items.bomb.obtained && (
        <div className="bg-red-900/30 border border-red-600 rounded-lg p-4 max-w-md">
          <p className="text-red-400 text-sm">
            💊 赤い錠剤の効果: 熱さを感じない状態（残り時間あり）
          </p>
        </div>
      )}

      {!canFly && (
        <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 max-w-md">
          <p className="text-yellow-400 text-sm">
            ⚠️ 飛ぶ手段がないと下に戻れません
          </p>
        </div>
      )}
    </div>
  );
}
