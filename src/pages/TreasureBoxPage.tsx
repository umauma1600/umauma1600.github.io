import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

// ===== 定数定義 =====
const CONSTANTS = {
  DRAG_THRESHOLD: 30,
  PAPER_SHOW_THRESHOLD: 50,
  FALL_DURATION_BASE: 0.3,
  FALL_DURATION_MAX: 0.6,
  MODAL_FADE_DELAY: 300,
  CONFETTI_COUNT: 100,
  CONFETTI_INTERVAL: 30,
  CONFETTI_DURATION: 5000,
  PAPER_OPENING_DELAY: 800,
  TIMER_INTERVAL: 1000,
};

// ===== ヒント情報 =====
const hints = [
  {
    step: 1,
    text: "ダイヤル錠の数字は「1600」です。<br>まずはダイヤルを回して錠を開けてみましょう。",
  },
  {
    step: 2,
    text: '錠は外れたのに開きません...何か別の方法があるのでは？<br><span class="highlight">固定観念にとらわれないで</span>考えてみましょう。',
  },
  {
    step: 3,
    text: '宝箱を<span class="highlight">違う方向から</span>アプローチしてみては？<br>クリックではなく、ドラッグで動かしてみましょう。',
  },
  {
    step: 4,
    text: '宝箱を<span class="highlight">上に持ち上げて</span>みてください！<br>底が抜けて...何か落ちてくるかもしれません。',
  },
];

// ===== 正解 =====
const correctDial = [1, 6, 0, 0];
const correctAnswers = [
  "逆転の発想",
  "ぎゃくてんのはっそう",
  "ギャクテンノハッソウ",
];

export default function TreasureBoxPage() {
  // ゲーム状態
  const [dialValues, setDialValues] = useState([0, 0, 0, 0]);
  const [isBottomDropped, setIsBottomDropped] = useState(false);
  const [isCleared, setIsCleared] = useState(false);
  const [startTime] = useState(Date.now());
  const [currentHintStep, setCurrentHintStep] = useState(0);
  const [timerDisplay, setTimerDisplay] = useState("00:00");

  // モーダル状態
  const [showDialModal, setShowDialModal] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [showPaperModal, setShowPaperModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [paperStep, setPaperStep] = useState(1);

  // UI状態
  const [dialFeedback, setDialFeedback] = useState("");
  const [dialFeedbackType, setDialFeedbackType] = useState<
    "correct" | "wrong" | ""
  >("");
  const [keywordInput, setKeywordInput] = useState("");
  const [answerFeedback, setAnswerFeedback] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [lockVisible, setLockVisible] = useState(true);
  const [lockFading, setLockFading] = useState(false);

  // ドラッグ状態
  const [boxTransform, setBoxTransform] = useState("translate(0, 0)");
  const [isDragging, setIsDragging] = useState(false);
  const [paperPositionX, setPaperPositionX] = useState(0); // 紙が落下した時の宝箱のX位置を記録
  const paperPositionSetRef = useRef(false); // 紙の位置が設定済みかどうか
  const isDragModeRef = useRef(false);
  const startYRef = useRef(0);
  const startXRef = useRef(0);
  const currentYRef = useRef(0);
  const currentXRef = useRef(0);
  const boxOffsetXRef = useRef(0);
  const boxOffsetYRef = useRef(0);

  // Refs
  const treasureBoxRef = useRef<HTMLDivElement>(null);
  const keywordInputRef = useRef<HTMLInputElement>(null);

  // タイマー更新
  useEffect(() => {
    if (isCleared) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      setTimerDisplay(
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
      );
    }, CONSTANTS.TIMER_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [startTime, isCleared]);

  // ダイヤル回転
  const rotateDial = (index: number, direction: number) => {
    setDialValues((prev) => {
      const newValues = [...prev];
      newValues[index] = (newValues[index] + direction + 10) % 10;
      return newValues;
    });
  };

  // ダイヤル錠の答え確認
  const checkDialAnswer = () => {
    const isCorrect = dialValues.every((val, idx) => val === correctDial[idx]);

    if (isCorrect) {
      setDialFeedback("✅ 錠が開きました！");
      setDialFeedbackType("correct");

      setTimeout(() => {
        setLockFading(true);
        setTimeout(() => {
          setLockVisible(false);
        }, 500);
        setShowDialModal(false);
      }, 1500);
    } else {
      setDialFeedback("❌ 番号が違うようです...");
      setDialFeedbackType("wrong");
    }
  };

  // ドラッグ制限の取得
  const getDragLimits = useCallback(() => {
    const tableImage = document.querySelector(".table-image");
    if (!tableImage) {
      return { maxOffset: 400 };
    }
    const tableWidth = tableImage.getBoundingClientRect().width;
    return { maxOffset: tableWidth / 2 };
  }, []);

  const clampX = useCallback(
    (x: number) => {
      const { maxOffset } = getDragLimits();
      return Math.max(-maxOffset, Math.min(maxOffset, x));
    },
    [getDragLimits],
  );

  // ドラッグ処理
  const handleDragMove = useCallback(
    (deltaX: number, deltaY: number) => {
      if (!isDragModeRef.current) {
        const dragDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (dragDistance > CONSTANTS.DRAG_THRESHOLD) {
          isDragModeRef.current = true;
          setIsDragging(true);
        } else {
          return;
        }
      }

      currentYRef.current = deltaY;
      currentXRef.current = deltaX;

      const totalX = clampX(boxOffsetXRef.current + currentXRef.current);
      let totalY = boxOffsetYRef.current;
      if (currentYRef.current > 0) {
        totalY = boxOffsetYRef.current + currentYRef.current;
      }

      setBoxTransform(`translate(${totalX}px, ${-totalY}px) scale(1.02)`);

      // 紙の位置は ref を使って同期的に制御（state は非同期なので追従してしまう）
      if (totalY > CONSTANTS.PAPER_SHOW_THRESHOLD && !paperPositionSetRef.current) {
        setIsBottomDropped(true);
        setPaperPositionX(totalX);
        paperPositionSetRef.current = true;
      }
    },
    [clampX],
  );

  const endDrag = useCallback(() => {
    if (!isDragModeRef.current) return;

    setIsDragging(false);
    isDragModeRef.current = false;

    boxOffsetXRef.current = clampX(boxOffsetXRef.current + currentXRef.current);
    boxOffsetYRef.current = boxOffsetYRef.current + currentYRef.current;

    if (boxOffsetYRef.current < 0) {
      boxOffsetYRef.current = 0;
    }

    const fallDuration = Math.min(
      CONSTANTS.FALL_DURATION_MAX,
      CONSTANTS.FALL_DURATION_BASE + boxOffsetYRef.current / 500,
    );

    // 落下アニメーション
    if (treasureBoxRef.current) {
      treasureBoxRef.current.style.transition = `transform ${fallDuration}s cubic-bezier(0.55, 0.085, 0.68, 0.53)`;
    }
    setBoxTransform(`translate(${boxOffsetXRef.current}px, 0) scale(1)`);

    boxOffsetYRef.current = 0;

    setTimeout(() => {
      if (treasureBoxRef.current) {
        treasureBoxRef.current.style.transition = "";
      }
    }, fallDuration * 1000);
  }, [clampX]);

  // マウスイベント
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("#lockIcon")) return;

    setIsDragging(false);
    isDragModeRef.current = false;
    startYRef.current = e.clientY;
    startXRef.current = e.clientX;
    currentYRef.current = 0;
    currentXRef.current = 0;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = startYRef.current - moveEvent.clientY;
      const deltaX = moveEvent.clientX - startXRef.current;
      handleDragMove(deltaX, deltaY);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      endDrag();
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // タッチイベント
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest("#lockIcon")) return;

    setIsDragging(false);
    isDragModeRef.current = false;
    startYRef.current = e.touches[0].clientY;
    startXRef.current = e.touches[0].clientX;
    currentYRef.current = 0;
    currentXRef.current = 0;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const deltaY = startYRef.current - moveEvent.touches[0].clientY;
      const deltaX = moveEvent.touches[0].clientX - startXRef.current;
      handleDragMove(deltaX, deltaY);
      if (isDragModeRef.current) {
        moveEvent.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      endDrag();
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
  };

  // 最終解答チェック
  const checkAnswer = () => {
    const input = keywordInput.trim();
    const isCorrect = correctAnswers.some(
      (answer) => input.toLowerCase() === answer.toLowerCase(),
    );

    if (isCorrect) {
      setAnswerFeedback("");
      clearGame();
    } else {
      setAnswerFeedback("❌ 違うようです...もう一度考えてみましょう。");
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, 500);
    }
  };

  // クリア処理
  const clearGame = () => {
    setIsCleared(true);
    setTimeout(() => {
      setShowClearModal(true);
    }, 500);
  };

  // 紙吹雪生成
  const createConfetti = () => {
    const colors = [
      "#c69c6d",
      "#3d2f23",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#ec4899",
    ];
    const container = document.getElementById("confettiContainer");
    if (!container) return;

    for (let i = 0; i < CONSTANTS.CONFETTI_COUNT; i++) {
      setTimeout(() => {
        const confetti = document.createElement("div");
        confetti.className = "confetti";
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.backgroundColor =
          colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = `${Math.random() * 3}s`;
        confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
        container.appendChild(confetti);

        setTimeout(() => {
          confetti.remove();
        }, CONSTANTS.CONFETTI_DURATION);
      }, i * CONSTANTS.CONFETTI_INTERVAL);
    }
  };

  useEffect(() => {
    if (showClearModal) {
      createConfetti();
    }
  }, [showClearModal]);

  // 紙のステップ進行
  const handlePaperStep1Click = () => {
    if (paperStep === 1) {
      setPaperStep(2);
      setTimeout(() => {
        setPaperStep(3);
        setTimeout(() => {
          keywordInputRef.current?.focus();
        }, 500);
      }, CONSTANTS.PAPER_OPENING_DELAY);
    }
  };

  const handlePaperStep2Click = () => {
    if (paperStep === 2) {
      setPaperStep(3);
      setTimeout(() => {
        keywordInputRef.current?.focus();
      }, 500);
    }
  };

  const handlePaperStep3Click = () => {
    if (paperStep === 3) {
      setShowPaperModal(false);
      setTimeout(() => {
        setPaperStep(1);
      }, CONSTANTS.MODAL_FADE_DELAY);
    }
  };

  // Xシェア
  const shareOnX = () => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeString = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    const text = `「逆転の宝箱」をクリアしました！⏱️ ${timeString}\n固定観念を逆転させる謎解きに挑戦しよう！\n#やまーたの謎解きアトリエ`;
    const url = window.location.href;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

    window.open(tweetUrl, "_blank", "width=550,height=420");
  };

  // リトライ
  const retry = () => {
    window.location.reload();
  };

  // ヒント表示更新
  const updateHintDisplay = () => {
    return hints[currentHintStep]?.text || "";
  };

  return (
    <>
      {/* ナビゲーション */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/contents/nazo"
              className="font-semibold text-lg hover:opacity-70 transition-colors"
              style={{
                color: "var(--color-primary)",
                fontFamily: "Space Grotesk, sans-serif",
              }}
            >
              ← 謎解き一覧に戻る
            </Link>
            <div
              className="text-sm"
              style={{ color: "var(--color-text)", opacity: 0.6 }}
            >
              プレイ時間: <span className="font-mono">{timerDisplay}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main
        className="pt-24 pb-12 px-4"
        style={{ background: "var(--color-bg)" }}
      >
        {/* タイトルセクション */}
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              color: "var(--color-primary)",
              fontFamily: "Space Grotesk, sans-serif",
            }}
          >
            逆転の宝箱
          </h1>
          <p
            className="text-lg mb-2"
            style={{ color: "var(--color-text)", opacity: 0.8 }}
          >
            常識にとらわれていませんか？
          </p>
          <p
            className="text-sm"
            style={{ color: "var(--color-text)", opacity: 0.6 }}
          >
            難易度: ★☆☆☆☆ (初心者向け) | 想定プレイ時間: 10分
          </p>
        </div>

        {/* ストーリー */}
        <div className="max-w-2xl mx-auto mb-12 p-6 bg-white rounded-lg shadow-sm">
          <h2
            className="text-xl font-semibold mb-3"
            style={{
              color: "var(--color-primary)",
              fontFamily: "Space Grotesk, sans-serif",
            }}
          >
            Story
          </h2>
          <div
            className="text-sm leading-relaxed space-y-2"
            style={{ color: "var(--color-text)" }}
          >
            <p>あなたは古い部屋で不思議な宝箱を見つけた。</p>
            <p>宝箱には4桁のダイヤル錠がかかっている。</p>
            <p>しかし、錠を外しても宝箱は開かない...</p>
            <p
              className="pt-2 font-medium"
              style={{
                borderTop: "1px solid rgba(198, 156, 109, 0.2)",
                color: "var(--color-accent)",
              }}
            >
              固定観念を逆転させて、中にある紙に書かれたキーワードを見つけよう！
            </p>
          </div>
        </div>

        {/* ゲームエリア */}
        <div className="max-w-6xl mx-auto">
          <div
            className="relative p-8 rounded-2xl min-h-[700px] flex items-center justify-center"
            style={{
              background:
                "linear-gradient(to bottom, rgba(198, 156, 109, 0.05), transparent)",
            }}
          >
            {/* テーブルエリア */}
            <div className="table-area">
              <img
                src="/assets/treasure-box/table1.png"
                alt="テーブル"
                className="table-image"
                draggable={false}
              />
            </div>

            {/* テーブル上のオブジェクト - 左: 封筒 */}
            <div className="table-object-left">
              <img
                src="/assets/treasure-box/card1.png"
                alt="封筒"
                className="w-16 md:w-20 h-auto"
                style={{
                  filter: "drop-shadow(0 10px 15px rgb(0 0 0 / 0.1))",
                  transform: "rotate(-15deg)",
                }}
                draggable={false}
              />
            </div>

            {/* テーブル上のオブジェクト - 右: メモ */}
            <div className="table-object-right">
              <img
                src="/assets/treasure-box/memo1.png"
                alt="メモ"
                className="w-16 md:w-20 h-auto"
                style={{
                  filter: "drop-shadow(0 10px 15px rgb(0 0 0 / 0.1))",
                }}
                draggable={false}
              />
            </div>

            {/* 宝箱コンテナ */}
            <div className="treasure-box-container">
              {/* 宝箱本体 */}
              <div
                ref={treasureBoxRef}
                className={`treasure-box relative cursor-grab active:cursor-grabbing ${isDragging ? "dragging" : ""}`}
                style={{ transform: boxTransform }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              >
                {/* 宝箱画像 */}
                <img
                  src="/assets/treasure-box/treasure-box2.png"
                  alt="宝箱"
                  className="treasure-box-image w-32 md:w-40 max-w-full h-auto select-none"
                  style={{
                    filter: "drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))",
                  }}
                  draggable={false}
                />

                {/* ダイヤル錠画像 */}
                {lockVisible && (
                  <div
                    id="lockIcon"
                    className="absolute top-1/2 left-1/2 w-12 md:w-14 cursor-pointer hover:scale-110 transition-transform z-20 select-none"
                    style={{
                      transform: "translate(-50%, 4px)",
                      opacity: lockFading ? 0 : 1,
                      transition: lockFading
                        ? "opacity 0.5s ease, transform 0.5s ease"
                        : undefined,
                    }}
                    draggable={false}
                    onClick={() => {
                      setShowDialModal(true);
                    }}
                  >
                    <img
                      src="/assets/treasure-box/dial-lock2.png"
                      alt="ダイヤル錠"
                      className="w-full h-auto"
                      draggable={false}
                    />
                  </div>
                )}
              </div>

              {/* 折りたたまれた紙 */}
              {isBottomDropped && (
                <div
                  className="cursor-pointer hover:scale-105 transition-transform"
                  style={{
                    transform: `translateX(${paperPositionX}px)`,
                  }}
                  onClick={() => {
                    setPaperStep(1);
                    setShowPaperModal(true);
                  }}
                >
                  <img
                    src="/assets/treasure-box/kami-Photoroom.png"
                    alt="落ちてきた紙"
                    className="w-12 h-auto"
                    style={{
                      filter: "drop-shadow(0 10px 8px rgb(0 0 0 / 0.04))",
                    }}
                    draggable={false}
                  />
                </div>
              )}
            </div>
          </div>

          {/* キーワード入力欄 */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm max-w-2xl mx-auto">
            <h3
              className="text-lg font-semibold mb-3"
              style={{
                color: "var(--color-primary)",
                fontFamily: "Space Grotesk, sans-serif",
              }}
            >
              最終解答
            </h3>
            <div className="flex gap-2">
              <input
                ref={keywordInputRef}
                type="text"
                value={keywordInput}
                onChange={(e) => {
                  setKeywordInput(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    checkAnswer();
                  }
                }}
                placeholder="ひらがな または 漢字で入力"
                className={`flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none ${isShaking ? "animate-shake" : ""}`}
                style={{ borderColor: isShaking ? "#ef4444" : undefined }}
              />
              <button
                onClick={checkAnswer}
                className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-colors font-medium"
                style={{ background: "var(--color-accent)" }}
              >
                答えを確認
              </button>
            </div>
            {answerFeedback && (
              <div className="mt-2 text-sm feedback-wrong">
                {answerFeedback}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ヒントボタン */}
      <button
        onClick={() => {
          setShowHintModal(true);
        }}
        className="fixed bottom-8 right-8 w-14 h-14 text-white rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center text-2xl z-50 hint-button"
        style={{ background: "var(--color-accent)" }}
      >
        💡
      </button>

      {/* ダイヤル錠モーダル */}
      {showDialModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-show"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDialModal(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <h3
                className="text-2xl font-bold"
                style={{
                  color: "var(--color-primary)",
                  fontFamily: "Space Grotesk, sans-serif",
                }}
              >
                🔒 ダイヤル錠
              </h3>
              <button
                onClick={() => {
                  setShowDialModal(false);
                }}
                className="text-2xl leading-none hover:opacity-70"
                style={{ color: "var(--color-text)", opacity: 0.4 }}
              >
                &times;
              </button>
            </div>
            <p
              className="text-sm mb-4"
              style={{ color: "var(--color-text)", opacity: 0.8 }}
            >
              4桁の番号を合わせて、OPENボタンを押してください。
            </p>

            {/* ダイヤル */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-4">
              <div className="flex gap-3 justify-center">
                {dialValues.map((value, index) => (
                  <div key={index} className="dial-container">
                    <button
                      className="w-12 h-8 bg-gray-600 hover:bg-gray-500 rounded-t text-white text-xs font-bold"
                      onClick={() => {
                        rotateDial(index, 1);
                      }}
                    >
                      ▲
                    </button>
                    <div className="w-12 h-16 bg-white flex items-center justify-center font-mono text-3xl font-bold border-2 border-gray-700">
                      <span>{value}</span>
                    </div>
                    <button
                      className="w-12 h-8 bg-gray-600 hover:bg-gray-500 rounded-b text-white text-xs font-bold"
                      onClick={() => {
                        rotateDial(index, -1);
                      }}
                    >
                      ▼
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={checkDialAnswer}
              className="w-full px-6 py-3 text-white rounded-lg hover:opacity-90 transition-colors font-bold text-lg"
              style={{ background: "var(--color-accent)" }}
            >
              OPEN
            </button>
            {dialFeedback && (
              <div
                className={`mt-3 text-sm text-center ${dialFeedbackType === "correct" ? "feedback-correct" : "feedback-wrong"}`}
              >
                {dialFeedback}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 紙モーダル */}
      {showPaperModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-show"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPaperModal(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <h3
                className="text-2xl font-bold"
                style={{
                  color: "var(--color-primary)",
                  fontFamily: "Space Grotesk, sans-serif",
                }}
              >
                📄 紙
              </h3>
              <button
                onClick={() => {
                  setShowPaperModal(false);
                }}
                className="text-2xl leading-none hover:opacity-70"
                style={{ color: "var(--color-text)", opacity: 0.4 }}
              >
                &times;
              </button>
            </div>

            {/* ステップ1: 閉じた紙 */}
            {paperStep === 1 && (
              <div
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={handlePaperStep1Click}
              >
                <div className="w-full flex items-center justify-center p-6">
                  <div className="text-center">
                    <img
                      src="/assets/treasure-box/kami-Photoroom.png"
                      alt="折りたたまれた紙"
                      className="max-w-full h-auto mx-auto mb-3"
                      draggable={false}
                    />
                    <div
                      className="text-sm"
                      style={{ color: "var(--color-text)", opacity: 0.8 }}
                    >
                      どうやら底が開いていたようだ
                    </div>
                    <div
                      className="text-xs mt-2"
                      style={{ color: "var(--color-text)", opacity: 0.6 }}
                    >
                      クリックして紙を開く
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ステップ2: 開きかけ */}
            {paperStep === 2 && (
              <div className="cursor-pointer" onClick={handlePaperStep2Click}>
                <div className="w-full flex items-center justify-center p-6">
                  <img
                    src="/assets/treasure-box/hirakutotyu-Photoroom.png"
                    alt="開きかけの紙"
                    className="max-w-full h-auto mx-auto paper-opening-animation"
                    draggable={false}
                  />
                </div>
              </div>
            )}

            {/* ステップ3: 完全に開いた状態 */}
            {paperStep === 3 && (
              <div className="cursor-pointer" onClick={handlePaperStep3Click}>
                <div className="w-full flex items-center justify-center p-6 relative">
                  <img
                    src="/assets/treasure-box/kamikami-Photoroom.png"
                    alt="開いた紙"
                    className="max-w-full h-auto mx-auto"
                    draggable={false}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center bg-white/90 px-6 py-4 rounded-lg shadow-lg">
                      <div
                        className="text-xs mb-2"
                        style={{ color: "var(--color-text)", opacity: 0.6 }}
                      >
                        正解のキーワード
                      </div>
                      <div
                        className="text-3xl font-bold leading-tight"
                        style={{
                          color: "var(--color-primary)",
                          fontFamily: "Space Grotesk, sans-serif",
                        }}
                      >
                        逆転の発想
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ヒントモーダル */}
      {showHintModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-show"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowHintModal(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <h3
                className="text-2xl font-bold"
                style={{
                  color: "var(--color-primary)",
                  fontFamily: "Space Grotesk, sans-serif",
                }}
              >
                💡 ヒント
              </h3>
              <button
                onClick={() => {
                  setShowHintModal(false);
                }}
                className="text-2xl leading-none hover:opacity-70"
                style={{ color: "var(--color-text)", opacity: 0.4 }}
              >
                &times;
              </button>
            </div>
            <div
              className="mb-4 leading-relaxed"
              style={{ color: "var(--color-text)" }}
              dangerouslySetInnerHTML={{ __html: updateHintDisplay() }}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setCurrentHintStep((prev) => Math.max(0, prev - 1));
                }}
                disabled={currentHintStep === 0}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ color: "var(--color-text)" }}
              >
                ← 前のヒント
              </button>
              <button
                onClick={() => {
                  setCurrentHintStep((prev) =>
                    Math.min(hints.length - 1, prev + 1),
                  );
                }}
                disabled={currentHintStep === hints.length - 1}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "var(--color-accent)" }}
              >
                次のヒント →
              </button>
            </div>
            <div
              className="mt-2 text-center text-xs"
              style={{ color: "var(--color-text)", opacity: 0.6 }}
            >
              ヒント {currentHintStep + 1} / {hints.length}
            </div>
          </div>
        </div>
      )}

      {/* クリアモーダル */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-show">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl text-center relative overflow-hidden">
            {/* 紙吹雪エリア */}
            <div
              id="confettiContainer"
              className="absolute inset-0 pointer-events-none"
            ></div>

            <div className="relative z-10">
              <div className="text-6xl mb-4">🎉</div>
              <h2
                className="text-3xl font-bold mb-4"
                style={{
                  color: "var(--color-primary)",
                  fontFamily: "Space Grotesk, sans-serif",
                }}
              >
                おめでとうございます！
              </h2>
              <p
                className="text-lg mb-6"
                style={{ color: "var(--color-text)" }}
              >
                「逆転の宝箱」をクリアしました！
              </p>

              <div
                className="rounded-lg p-4 mb-6"
                style={{ background: "rgba(198, 156, 109, 0.1)" }}
              >
                <div
                  className="text-sm mb-1"
                  style={{ color: "var(--color-text)", opacity: 0.6 }}
                >
                  クリアタイム
                </div>
                <div
                  className="text-2xl font-mono font-bold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {timerDisplay}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={shareOnX}
                  className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <span>𝕏</span>
                  <span>クリアを X でシェア</span>
                </button>
                <Link
                  to="/contents/nazo"
                  className="block w-full px-6 py-3 text-white rounded-lg hover:opacity-90 transition-colors font-medium"
                  style={{ background: "var(--color-accent)" }}
                >
                  謎解き一覧に戻る
                </Link>
                <button
                  onClick={retry}
                  className="w-full px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  style={{ color: "var(--color-text)" }}
                >
                  もう一度挑戦
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* カスタムスタイル */}
      <style>{`
        /* テーブル関連 */
        .table-area {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
          width: 100%;
        }

        .table-image {
          width: 70%;
          max-width: 1550px;
          height: auto;
          display: block;
          margin: 0 auto;
        }

        /* 宝箱コンテナ */
        .treasure-box-container {
          position: absolute;
          bottom: 280px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
        }

        /* テーブル上のオブジェクト - 左: 封筒 */
        .table-object-left {
          position: absolute;
          bottom: 290px;
          left: calc(50% - 140px);
          transform: translateX(-100%);
          z-index: 9;
        }

        /* テーブル上のオブジェクト - 右: メモ */
        .table-object-right {
          position: absolute;
          bottom: 285px;
          right: calc(50% - 140px);
          transform: translateX(100%);
          z-index: 9;
        }

        /* 宝箱関連 */
        .treasure-box {
          transition: transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform;
        }

        .treasure-box.dragging {
          transition: none;
        }

        /* モーダル関連 */
        .modal-show {
          animation: modalFadeIn 0.3s ease-out;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-show > div {
          animation: modalSlideUp 0.3s ease-out;
        }

        @keyframes modalSlideUp {
          from {
            transform: scale(0.9) translateY(20px);
          }
          to {
            transform: scale(1) translateY(0);
          }
        }

        /* 紙吹雪 */
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          animation: confettiFall 3s linear infinite;
        }

        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(500px) rotate(720deg);
            opacity: 0;
          }
        }

        /* ヒントボタンのパルスアニメーション */
        .hint-button {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(198, 156, 109, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(198, 156, 109, 0);
          }
        }

        /* UI フィードバック */
        .feedback-wrong {
          color: #ef4444;
          font-weight: 500;
        }

        .feedback-correct {
          color: #22c55e;
          font-weight: 500;
        }

        /* シェイクアニメーション */
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }

        /* 紙が開くアニメーション */
        .paper-opening-animation {
          animation: paperOpening 0.8s ease-out forwards;
        }

        @keyframes paperOpening {
          0% {
            transform: scale(0.8) rotate(-5deg);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1) rotate(2deg);
            opacity: 0.8;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        /* 強調テキスト */
        .highlight {
          background: linear-gradient(transparent 60%, rgba(198, 156, 109, 0.25) 60%);
          font-weight: 500;
        }

        /* レスポンシブ対応 */
        @media (max-width: 768px) {
          .table-area {
            bottom: 0;
          }

          .treasure-box-container {
            transform: translateX(-50%) scale(0.9);
            bottom: 200px;
          }

          .table-object-left {
            bottom: 210px;
            left: calc(50% - 100px);
          }

          .table-object-right {
            bottom: 205px;
            right: calc(50% - 100px);
          }

          .hint-button {
            width: 56px;
            height: 56px;
            bottom: 20px;
            right: 20px;
          }
        }
      `}</style>
    </>
  );
}
