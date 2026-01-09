import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function CafeInterior() {
  const navigate = useNavigate();
  const [showMascot, setShowMascot] = useState(false);
  const [showDialogue, setShowDialogue] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  // やまーたのセリフ
  const dialogues = [
    "いらっしゃいませ〜！",
    "Café ひみつの鍵へようこそ！",
    "私は看板娘のやまーたです♪",
    "ここでは謎解きとドリンクが楽しめますよ",
    "メニューをどうぞ！",
  ];

  useEffect(() => {
    // 順番にアニメーション表示
    const timer1 = setTimeout(() => {
      setShowMascot(true);
    }, 300);
    const timer2 = setTimeout(() => {
      setShowDialogue(true);
    }, 800);
    const timer3 = setTimeout(() => {
      setShowMenu(true);
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // セリフを進める
  const advanceDialogue = () => {
    if (dialogueIndex < dialogues.length - 1) {
      setDialogueIndex((prev) => prev + 1);
    }
  };

  // メニューへ遷移
  const goToMenu = () => {
    void navigate("/cafe/menu");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf8f5] via-[#f5efe6] to-[#faf8f5] relative overflow-hidden">
      {/* 背景装飾：店内の雰囲気 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 窓からの光 */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-amber-100/40 to-transparent" />
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-amber-100/30 to-transparent" />

        {/* 床のパターン */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-amber-900/10 to-transparent" />

        {/* 装飾的な棚のシルエット */}
        <div className="absolute top-20 left-8 w-16 h-24 md:w-24 md:h-32 border-2 border-amber-800/10 rounded-sm" />
        <div className="absolute top-32 left-12 w-12 h-16 md:w-16 md:h-20 border-2 border-amber-800/10 rounded-sm" />

        {/* コーヒーカップのシルエット */}
        <div className="absolute top-16 right-12 md:right-24 opacity-20">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-amber-800"
          >
            <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
            <line x1="6" y1="2" x2="6" y2="4" />
            <line x1="10" y1="2" x2="10" y2="4" />
            <line x1="14" y1="2" x2="14" y2="4" />
          </svg>
        </div>

        {/* 鍵のモチーフ */}
        <div className="absolute bottom-24 right-8 md:right-16 opacity-15 rotate-12">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-amber-700"
          >
            <circle cx="8" cy="8" r="5" />
            <path d="M12 12l7 7" />
            <path d="M17 17l2 2" />
            <path d="M15 19l2-2" />
          </svg>
        </div>

        {/* 観葉植物のシルエット */}
        <div className="absolute bottom-0 left-4 opacity-20">
          <svg
            width="60"
            height="80"
            viewBox="0 0 60 80"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-green-700"
          >
            <path d="M30 80 V 50" />
            <ellipse cx="30" cy="35" rx="20" ry="25" />
            <path d="M20 40 Q 30 30, 40 40" />
            <path d="M15 35 Q 30 20, 45 35" />
          </svg>
        </div>
      </div>

      {/* 戻るリンク */}
      <Link
        to="/cafe"
        className="absolute top-6 left-6 text-amber-800/60 hover:text-amber-800 transition-colors text-sm flex items-center gap-2 z-20"
      >
        <span>←</span>
        <span>外に出る</span>
      </Link>

      {/* メインコンテンツ */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">
        {/* カフェ名 */}
        <div className="mb-8 text-center">
          <p className="text-amber-600/80 text-xs tracking-[0.3em] mb-1">
            PUZZLE CAFE
          </p>
          <h1
            className="text-2xl md:text-3xl font-bold text-amber-900"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Café ひみつの鍵
          </h1>
        </div>

        {/* やまーた（看板娘） */}
        <div
          className={`relative transition-all duration-700 ease-out ${
            showMascot ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* 吹き出し */}
          {showDialogue && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 -translate-y-full transition-all duration-500 opacity-100 scale-100">
              <div
                className="relative bg-white px-6 py-4 rounded-2xl shadow-lg border-2 border-amber-200 cursor-pointer hover:bg-amber-50 transition-colors min-w-[200px] max-w-[280px]"
                onClick={advanceDialogue}
              >
                <p className="text-amber-900 text-center font-medium">
                  {dialogues[dialogueIndex]}
                </p>
                {/* 吹き出しの尻尾 */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                  <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
                </div>
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 translate-y-full">
                  <div className="w-0 h-0 border-l-10 border-r-10 border-t-10 border-l-transparent border-r-transparent border-t-amber-200" />
                </div>
                {/* クリックヒント */}
                {dialogueIndex < dialogues.length - 1 && (
                  <span className="absolute bottom-1 right-2 text-amber-400 text-xs animate-pulse">
                    ▼
                  </span>
                )}
              </div>
            </div>
          )}

          {/* やまーた画像 */}
          <div className="relative">
            <img
              src="/assets/yama-ta.png"
              alt="やまーた"
              className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-lg"
              style={{
                animation: showMascot
                  ? "float 3s ease-in-out infinite"
                  : "none",
              }}
            />
            {/* 名札 */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 shadow-sm">
              <span className="text-amber-800 text-xs font-medium">
                看板娘 やまーた
              </span>
            </div>
          </div>
        </div>

        {/* メニューボタン */}
        <div
          className={`mt-12 transition-all duration-700 delay-500 ${
            showMenu ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <button
            onClick={goToMenu}
            className="group relative px-8 py-4 bg-amber-800 hover:bg-amber-700 text-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <span className="flex items-center gap-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="transition-transform group-hover:rotate-12"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
              <span
                className="font-bold tracking-wide"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                メニューを見る
              </span>
            </span>
          </button>
        </div>

        {/* 店内の雰囲気テキスト */}
        <p className="mt-8 text-amber-700/50 text-xs text-center max-w-xs">
          店内にはコーヒーの香りと
          <br />
          ほのかな謎の気配が漂っています...
        </p>
      </div>

      {/* カウンター風の装飾（画面下部） */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-900/20 to-transparent pointer-events-none" />

      {/* スタイル */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}
