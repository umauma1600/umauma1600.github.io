import { useGame } from "../GameContext";

export default function DoorArea() {
  const { state, obtainItem, dispatch, showDialog } = useGame();

  const handlePillPurple = () => {
    if (!state.items.pill_purple.obtained) {
      obtainItem("pill_purple");
      showDialog("紫の錠剤を手に入れた！");
    }
  };

  const handleDoor = () => {
    if (state.selectedItem === "key") {
      // 鍵を使ってドアを開ける
      dispatch({ type: "USE_KEY" });
    } else if (state.flags.keyObtained) {
      showDialog("ドアには鍵がかかっている。\n鍵を使えば開けられそうだ。");
    } else {
      showDialog(
        "ドアには鍵がかかっている。\n防音扉のように隙間はない。\nここから出るには鍵が必要だ。",
      );
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* ドアのビジュアル */}
      <div className="relative bg-gray-600 rounded-lg p-6 w-full max-w-md">
        <div className="flex gap-6 items-end justify-center">
          {/* ドア */}
          <button onClick={handleDoor} className="relative group">
            <div className="w-32 h-56 bg-amber-900 rounded-t flex flex-col items-center justify-center border-4 border-amber-700 transition-all hover:bg-amber-800">
              {/* ドアの装飾 */}
              <div className="w-24 h-20 border-2 border-amber-600 rounded mb-4" />
              <div className="w-24 h-20 border-2 border-amber-600 rounded" />

              {/* ドアノブ */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-6 h-10 bg-yellow-600 rounded-full" />
              </div>

              {/* 鍵穴 */}
              <div className="absolute right-6 top-1/2 translate-y-4">
                <div className="w-3 h-4 bg-gray-800 rounded-full" />
              </div>
            </div>

            {/* ホバー時のテキスト */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-t">
              <span className="text-white font-bold">
                {state.flags.keyObtained
                  ? "🔑 鍵を使う"
                  : "🔒 鍵がかかっている"}
              </span>
            </div>
          </button>

          {/* 紫の錠剤（ドアの近くに落ちている） */}
          <button
            onClick={handlePillPurple}
            disabled={state.items.pill_purple.obtained}
            className={`w-16 h-20 rounded-lg flex flex-col items-center justify-center transition-all ${
              state.items.pill_purple.obtained
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-purple-900/50 hover:bg-purple-800/50 hover:scale-105 border-2 border-purple-400"
            }`}
          >
            {state.items.pill_purple.obtained ? (
              <span className="text-gray-400 text-xs">取得済</span>
            ) : (
              <>
                <span className="text-2xl">💜</span>
                <span className="text-purple-300 text-xs mt-1">紫の錠剤</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 説明 */}
      <div className="text-gray-300 text-sm max-w-md space-y-2">
        <p>• ドアには鍵がかかっている</p>
        <p>• 防音扉のように隙間はない</p>
        <p>• ドアの近くに紫の錠剤が落ちている</p>
        {state.flags.keyObtained && (
          <p className="text-green-400">✓ 鍵を持っている。ドアを開けられる！</p>
        )}
      </div>

      {/* 脱出ボタン */}
      {state.flags.keyObtained && (
        <div className="mt-4">
          <button
            onClick={handleDoor}
            className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-xl rounded-lg transition-all transform hover:scale-105 animate-pulse"
          >
            🔑 鍵を使ってドアを開ける
          </button>
          {!state.flags.bombDisarmed && (
            <p className="text-yellow-400 text-sm mt-2 text-center">
              ⚠️ 爆弾を解除していません。このまま出ますか？
            </p>
          )}
        </div>
      )}
    </div>
  );
}
