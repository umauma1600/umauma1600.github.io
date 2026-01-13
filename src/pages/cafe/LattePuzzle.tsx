import { useState } from "react";
import { Link } from "react-router-dom";
import { useCafeProgress } from "../../hooks/useCafeProgress";

// 正解の答え（ひらがなで設定、複数対応）
const CORRECT_ANSWERS = ["くるみ", "いそ"];

export default function LattePuzzle() {
  const { isCleared, markAsCleared } = useCafeProgress();
  const [answer, setAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const cleared = isCleared("latte");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 正解判定（ひらがな・カタカナ・漢字などを統一して比較）
    const normalizedAnswer = answer
      .toLowerCase()
      .replace(/[\u30a1-\u30f6]/g, (match) =>
        String.fromCharCode(match.charCodeAt(0) - 0x60),
      )
      .trim();

    const correct = CORRECT_ANSWERS.includes(normalizedAnswer);
    setIsCorrect(correct);
    setShowResult(true);

    if (correct && !cleared) {
      markAsCleared("latte");
    }
  };

  const handleRetry = () => {
    setAnswer("");
    setShowResult(false);
    setIsCorrect(false);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom, #faf8f5 0%, #f5f0e8 50%, #faf8f5 100%)",
      }}
    >
      {/* ヘッダー */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md shadow-sm z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/cafe/menu"
            className="text-amber-800 hover:text-amber-600 transition-colors flex items-center gap-2"
          >
            <span>←</span>
            <span className="text-sm">メニューに戻る</span>
          </Link>
          <h1
            className="text-xl font-bold text-amber-900"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            カフェラテ
          </h1>
          <div className="w-20" />
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* クリア済み表示 */}
        {cleared && !showResult && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <span className="text-green-600 font-bold">✓ クリア済み</span>
          </div>
        )}

        {/* 謎の画像 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <img
            src="/assets/cafe/cafe-latte.png"
            alt="カフェラテの謎"
            className="w-full h-auto"
          />
        </div>

        {/* 回答フォームまたは結果表示 */}
        {!showResult ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="answer"
                className="block text-amber-800 font-bold mb-2"
              >
                答えを入力してください
              </label>
              <input
                type="text"
                id="answer"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                }}
                placeholder="ひらがなで入力"
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:border-amber-500 focus:outline-none text-lg"
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              disabled={!answer.trim()}
              className="w-full py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              回答する
            </button>
          </form>
        ) : (
          <div className="text-center">
            {isCorrect ? (
              <div className="space-y-4">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-green-600">正解！</h2>
                <p className="text-amber-700">
                  おめでとうございます！カフェラテの謎を解きました。
                </p>
                <Link
                  to="/cafe/menu"
                  className="inline-block mt-4 px-6 py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors"
                >
                  メニューに戻る
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-6xl mb-4">🤔</div>
                <h2 className="text-2xl font-bold text-red-600">不正解...</h2>
                <p className="text-amber-700">もう一度考えてみてください。</p>
                <button
                  onClick={handleRetry}
                  className="mt-4 px-6 py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors"
                >
                  もう一度挑戦する
                </button>
              </div>
            )}
          </div>
        )}

        {/* ヒント */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-700 text-sm text-center">
            <span className="font-bold">ヒント：</span>
            上の例を参考に、カフェラテが何になるか考えてみましょう。
          </p>
        </div>
      </main>
    </div>
  );
}
