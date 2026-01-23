import { useState } from "react";
import { useGame } from "../GameContext";

export default function OpeningScreen() {
  const { dispatch } = useGame();
  const [showMessage, setShowMessage] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(true);

  const handleEnvelopeClick = () => {
    setShowEnvelope(false);
    setShowMessage(true);
  };

  const handleStartTimer = () => {
    dispatch({ type: "START_TIMER" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4">
      {/* オープニングテキスト */}
      {!showMessage && (
        <div className="text-center mb-8 animate-fade-in">
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl">
            あなたが目を覚ますと
            <br />
            見知らぬ部屋に閉じ込められていました。
            <br />
            <br />
            前後の記憶は全くありません。
            <br />
            <br />
            すると、部屋の中央にあるテーブルに
            <br />
            封筒が置いてあることに気が付きました。
          </p>
        </div>
      )}

      {/* 封筒 */}
      {showEnvelope && (
        <div className="relative mt-8">
          <button
            onClick={handleEnvelopeClick}
            className="group relative transform hover:scale-105 transition-transform duration-300"
          >
            {/* テーブル */}
            <div className="w-80 h-40 bg-gradient-to-b from-amber-200 to-amber-300 rounded-lg shadow-xl relative">
              {/* テーブルの木目 */}
              <div className="absolute inset-0 opacity-30">
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute h-px bg-amber-600"
                    style={{
                      top: `${20 + i * 15}%`,
                      left: "10%",
                      right: "10%",
                    }}
                  />
                ))}
              </div>

              {/* 封筒 */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-24 bg-gray-900 shadow-lg group-hover:shadow-2xl transition-shadow">
                {/* 封筒のフラップ */}
                <div
                  className="absolute top-0 left-0 right-0 h-12 bg-gray-900"
                  style={{
                    clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
                    transform: "translateY(-50%)",
                  }}
                />
                {/* 封筒の線 */}
                <div className="absolute inset-2 border border-gray-600 opacity-50" />
              </div>

              {/* テーブルの脚 */}
              <div className="absolute -bottom-12 left-8 w-3 h-12 bg-amber-700 rounded-b transform -skew-x-6" />
              <div className="absolute -bottom-12 right-8 w-3 h-12 bg-amber-700 rounded-b transform skew-x-6" />
            </div>

            {/* クリック促進テキスト */}
            <p className="text-gray-400 text-center mt-16 animate-pulse">
              封筒をクリックして読む
            </p>
          </button>
        </div>
      )}

      {/* メッセージ */}
      {showMessage && (
        <div className="max-w-2xl w-full animate-fade-in">
          {/* メッセージ画像 */}
          <div className="relative">
            <img
              src="/assets/escape/message.png"
              alt="脅迫文"
              className="w-full rounded-lg shadow-2xl"
            />
          </div>

          {/* スタートボタン */}
          <div className="text-center mt-8">
            <button
              onClick={handleStartTimer}
              className="px-12 py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xl rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg animate-pulse"
            >
              探索を開始する
            </button>
            <p className="text-gray-500 text-sm mt-4">
              ※ボタンを押すと60分のタイマーが開始します
            </p>
          </div>
        </div>
      )}

      {/* フェードインアニメーション用CSS */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
