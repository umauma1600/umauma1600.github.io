import { useGame } from "../GameContext";

export default function StatueArea() {
  const { state, obtainItem, pressButton, showDialog, hasPillEffect } =
    useGame();

  const handlePillBlue = () => {
    if (!state.items.pill_blue.obtained) {
      obtainItem("pill_blue");
      showDialog("青い錠剤を手に入れた！");
    }
  };

  const handleStatue = () => {
    if (state.flags.button3Pressed) {
      showDialog("像は既に動かしてある。後ろのボタン③は押した。");
      return;
    }

    if (hasPillEffect("pill_purple")) {
      pressButton(3);
      showDialog(
        "怪力になっているので、像を簡単に動かせた！\n後ろにあったボタン③を押した！",
      );
    } else {
      showDialog(
        "像を調べる。後ろに何かがあるようだが、像は重くて通常の力では動かすことができない。",
      );
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 像のビジュアル */}
      <div className="relative bg-gray-600 rounded-lg p-6 w-full max-w-md">
        <div className="flex gap-6 items-end justify-center">
          {/* 像 */}
          <button onClick={handleStatue} className="relative group">
            <div className="w-32 h-48 bg-gray-400 rounded-t-full flex flex-col items-center justify-center transition-all hover:bg-gray-300">
              <div className="text-6xl">🗿</div>
              <p className="text-gray-600 text-sm mt-2">像</p>
            </div>
            {/* 台座 */}
            <div className="w-36 h-8 bg-gray-500 rounded -mx-2" />

            {/* ボタン（像の後ろ） */}
            {state.flags.button3Pressed && (
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                ✓
              </div>
            )}
          </button>

          {/* 青い錠剤 */}
          <button
            onClick={handlePillBlue}
            disabled={state.items.pill_blue.obtained}
            className={`w-16 h-20 rounded-lg flex flex-col items-center justify-center transition-all ${
              state.items.pill_blue.obtained
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-900/50 hover:bg-blue-800/50 hover:scale-105 border-2 border-blue-400"
            }`}
          >
            {state.items.pill_blue.obtained ? (
              <span className="text-gray-400 text-xs">取得済</span>
            ) : (
              <>
                <span className="text-2xl">☁️</span>
                <span className="text-blue-300 text-xs mt-1">青い錠剤</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ヒント */}
      {!state.flags.button3Pressed &&
        state.items.pill_purple.obtained &&
        !state.items.pill_purple.used && (
          <div className="bg-purple-900/30 border border-purple-600 rounded-lg p-4 max-w-md">
            <p className="text-purple-400 text-sm">
              💡 紫の錠剤を使えば、力が強くなって像を動かせるかもしれない
            </p>
          </div>
        )}
    </div>
  );
}
