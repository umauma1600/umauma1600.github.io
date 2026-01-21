import { useGame } from "../GameContext";

export default function TableArea() {
  const { state, dispatch, showDialog } = useGame();

  const handleCarpet = () => {
    if (!state.flags.carpetRemoved) {
      dispatch({ type: "REMOVE_CARPET" });
      showDialog("カーペットをめくると、床に何かがあることに気づいた。");
    }
  };

  const handleTrapdoor = () => {
    if (state.flags.trapdoorUnlocked) {
      showDialog("扉が開いている。下の階に行けそうだ。");
    } else {
      showDialog(
        "床に扉のようなものがある。\n「3つのボタンを押せ」と書かれており、鍵がかかっている。",
      );
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* テーブルのビジュアル */}
      <div className="relative bg-gray-600 rounded-lg p-8 w-full max-w-md">
        {/* テーブル */}
        <div className="relative">
          <div className="w-full h-32 bg-gradient-to-b from-amber-200 to-amber-300 rounded-lg shadow-lg relative">
            {/* 木目 */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className="absolute h-px bg-amber-600"
                  style={{ top: `${25 + i * 20}%`, left: "10%", right: "10%" }}
                />
              ))}
            </div>
          </div>
          {/* 脚 */}
          <div className="flex justify-between px-8 -mt-2">
            <div className="w-4 h-16 bg-amber-700 rounded-b transform -skew-x-6" />
            <div className="w-4 h-16 bg-amber-700 rounded-b" />
            <div className="w-4 h-16 bg-amber-700 rounded-b" />
            <div className="w-4 h-16 bg-amber-700 rounded-b transform skew-x-6" />
          </div>
        </div>

        {/* カーペット / 扉 */}
        <div className="mt-8 flex justify-center">
          {!state.flags.carpetRemoved ? (
            <button
              onClick={handleCarpet}
              className="w-48 h-24 bg-red-800 hover:bg-red-700 rounded-lg border-2 border-red-600 flex items-center justify-center text-white transition-colors"
            >
              <span className="text-sm">カーペットを調べる</span>
            </button>
          ) : (
            <button
              onClick={handleTrapdoor}
              className={`w-48 h-24 rounded-lg border-2 flex flex-col items-center justify-center text-white transition-colors ${
                state.flags.trapdoorUnlocked
                  ? "bg-green-700 hover:bg-green-600 border-green-500"
                  : "bg-gray-700 hover:bg-gray-600 border-gray-500"
              }`}
            >
              {state.flags.trapdoorUnlocked ? (
                <>
                  <span className="text-2xl mb-1">🪜</span>
                  <span className="text-sm">扉が開いている</span>
                </>
              ) : (
                <>
                  <span className="text-sm mb-1">「3つのボタンを押せ」</span>
                  <span className="text-2xl">🔒</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ボタン状態の表示 */}
      {state.flags.carpetRemoved && !state.flags.trapdoorUnlocked && (
        <div className="flex gap-4 mt-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
              state.flags.button1Pressed ? "bg-green-500" : "bg-gray-600"
            }`}
          >
            {state.flags.button1Pressed ? "✓" : "1"}
          </div>
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
              state.flags.button2Pressed ? "bg-green-500" : "bg-gray-600"
            }`}
          >
            {state.flags.button2Pressed ? "✓" : "2"}
          </div>
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
              state.flags.button3Pressed ? "bg-green-500" : "bg-gray-600"
            }`}
          >
            {state.flags.button3Pressed ? "✓" : "3"}
          </div>
        </div>
      )}
    </div>
  );
}
