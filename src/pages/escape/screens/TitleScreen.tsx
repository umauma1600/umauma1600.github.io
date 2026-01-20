import { useGame } from "../GameContext";

export default function TitleScreen() {
  const { startGame } = useGame();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4">
      {/* タイトル */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-wider">
          やまーたからの
          <br />
          <span className="text-red-500">挑戦状</span>
        </h1>
        <p className="text-gray-400 text-lg">脱出ゲーム</p>
      </div>

      {/* スタートボタン */}
      <button
        onClick={startGame}
        className="group relative px-12 py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xl rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/30"
      >
        <span className="relative z-10">ゲームスタート</span>
        <div className="absolute inset-0 bg-red-400 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity" />
      </button>

      {/* フッター */}
      <div className="absolute bottom-8 text-center text-gray-500 text-sm">
        <p>制作: やまーた</p>
        <p className="mt-1">推定プレイ時間: 30〜60分</p>
      </div>

      {/* 装飾 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <div className="absolute top-20 right-20 w-3 h-3 bg-red-400 rounded-full animate-pulse delay-100" />
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-red-600 rounded-full animate-pulse delay-200" />
        <div className="absolute bottom-20 right-40 w-4 h-4 bg-red-500 rounded-full animate-pulse delay-300" />
      </div>
    </div>
  );
}
