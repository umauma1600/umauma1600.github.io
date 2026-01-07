import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function CafeEntrance() {
  const navigate = useNavigate();
  const [isEntering, setIsEntering] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const handleEnter = () => {
    if (isEntering) return;

    setIsEntering(true);

    // ドアが開くアニメーション
    setTimeout(() => {
      setShowWelcome(true);
    }, 800);

    // メニュー画面へ遷移
    setTimeout(() => {
      void navigate("/cafe/menu");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1510] via-[#2d2318] to-[#1a1510] flex flex-col items-center justify-center relative overflow-hidden">
      {/* 背景の装飾 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 border border-amber-700/30 rounded-full" />
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-amber-700/30 rounded-full" />
        <div className="absolute top-1/3 right-10 w-16 h-16 border border-amber-700/30 rotate-45" />
      </div>

      {/* 街灯の光 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

      {/* 戻るリンク */}
      <Link
        to="/"
        className="absolute top-6 left-6 text-amber-200/60 hover:text-amber-200 transition-colors text-sm flex items-center gap-2 z-20"
      >
        <span>←</span>
        <span>トップに戻る</span>
      </Link>

      {/* メインコンテンツ */}
      <div className="relative z-10 text-center">
        {/* カフェ名の看板 */}
        <div className="mb-8">
          <div className="inline-block px-8 py-4 border-2 border-amber-600/50 rounded-lg bg-[#1a1510]/80 backdrop-blur-sm">
            <p className="text-amber-500/80 text-xs tracking-[0.3em] mb-1">
              PUZZLE CAFE
            </p>
            <h1
              className="text-3xl md:text-4xl font-bold text-amber-100"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Café ひみつの鍵
            </h1>
          </div>
        </div>

        {/* ドア */}
        <div
          className={`relative cursor-pointer transition-all duration-700 ${
            isEntering ? "scale-110" : "hover:scale-105"
          }`}
          onClick={handleEnter}
        >
          {/* ドアフレーム */}
          <div className="relative w-48 md:w-56 mx-auto">
            {/* 外枠 */}
            <div className="absolute -inset-4 border-4 border-amber-800/60 rounded-t-3xl bg-amber-900/20" />

            {/* ドア本体 */}
            <div
              className={`relative bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900 rounded-t-2xl overflow-hidden transition-all duration-700 ${
                isEntering ? "opacity-0 scale-x-0" : ""
              }`}
              style={{
                height: "280px",
                boxShadow: "inset 0 0 30px rgba(0,0,0,0.5)",
              }}
            >
              {/* ドアの装飾パネル */}
              <div className="absolute top-6 left-4 right-4 h-20 border-2 border-amber-700/50 rounded-lg" />
              <div className="absolute top-32 left-4 right-4 h-28 border-2 border-amber-700/50 rounded-lg" />

              {/* ドアノブ */}
              <div className="absolute top-1/2 right-4 w-4 h-8 bg-amber-500 rounded-full shadow-lg" />

              {/* 鍵穴 */}
              <div className="absolute top-1/2 right-5 mt-6 w-2 h-3 bg-amber-950 rounded-sm" />

              {/* OPENサイン */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-100 rounded text-amber-900 text-xs font-bold tracking-wider">
                OPEN
              </div>
            </div>

            {/* ドアが開いた時の中の光 */}
            {isEntering && (
              <div
                className="absolute inset-0 bg-gradient-to-b from-amber-200 via-amber-100 to-amber-200 rounded-t-2xl animate-pulse"
                style={{ height: "280px" }}
              />
            )}
          </div>

          {/* クリックガイド */}
          {!isEntering && (
            <p className="mt-6 text-amber-400/80 text-sm animate-pulse">
              ドアをクリックして入店
            </p>
          )}
        </div>

        {/* ウェルカムメッセージ */}
        {showWelcome && (
          <div className="fixed inset-0 flex items-center justify-center bg-amber-50 z-50 animate-fadeIn">
            <div className="text-center">
              <p className="text-amber-800 text-lg mb-2">いらっしゃいませ</p>
              <h2
                className="text-2xl md:text-3xl font-bold text-amber-900"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Café ひみつの鍵へようこそ
              </h2>
              <div className="mt-4 flex justify-center">
                <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 営業時間（雰囲気作り） */}
      <div className="absolute bottom-8 text-center text-amber-600/40 text-xs">
        <p>営業時間: 24時間</p>
        <p className="mt-1">※謎解きとドリンクをお楽しみいただけます</p>
      </div>

      {/* スタイル */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
