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
      {/* キッチンのビジュアル（画像ベース） */}
      <div className="relative w-full max-w-md">
        <img
          src="/assets/escape/kitchen-bg.png"
          alt="キッチン"
          className="w-full rounded-lg"
        />

        {/* クリッカブルエリアのオーバーレイ */}

        {/* 換気扇 */}
        <button
          onClick={handleVent}
          className="absolute top-[5%] right-[18%] w-[20%] h-[22%] rounded-full hover:bg-white/20 transition-colors"
          aria-label="換気扇を調べる"
        />

        {/* 水道 */}
        <button
          onClick={handleSink}
          className="absolute top-[30%] left-[18%] w-[20%] h-[20%] rounded hover:bg-white/20 transition-colors"
          aria-label="水道を調べる"
        />

        {/* コンロ */}
        <button
          onClick={handleStove}
          className="absolute top-[35%] right-[10%] w-[28%] h-[25%] rounded hover:bg-white/20 transition-colors"
          aria-label="コンロを調べる"
        />

        {/* 白い錠剤の瓶（カウンター上） */}
        {!state.items.pill_white.obtained && (
          <button
            onClick={handlePillWhite}
            className="absolute top-[32%] left-[42%] w-[12%] h-[15%] rounded hover:bg-white/30 transition-colors"
            aria-label="白い錠剤を調べる"
          >
            <img
              src="/assets/escape/pill-icon-circle.png"
              alt="白い錠剤"
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </button>
        )}

        {/* 調理器具（下の棚エリア） */}
        {!state.items.cooking_tools.obtained && (
          <button
            onClick={handleCookingTools}
            className="absolute bottom-[5%] left-[10%] w-[45%] h-[18%] rounded hover:bg-white/20 transition-colors flex items-center justify-center"
            aria-label="調理器具を調べる"
          />
        )}
      </div>

      {/* 取得済みアイテム表示 */}
      <div className="flex gap-4 text-sm text-gray-400">
        {state.items.pill_white.obtained && (
          <span className="bg-gray-700 px-3 py-1 rounded-full">白い錠剤 ✓</span>
        )}
        {state.items.cooking_tools.obtained && (
          <span className="bg-gray-700 px-3 py-1 rounded-full">調理器具 ✓</span>
        )}
      </div>
    </div>
  );
}
