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

// ===== 手掛かり情報 =====
const clues = [
  {
    step: 1,
    text: "Numek-n es n.<br>Numek-ki es wrils.<br>Numek-zam es grovinas.<br>Numek-befo es ki.",
  },
  {
    step: 2,
    text: "この言語はケルナ語という言語だ",
  },
  {
    step: 3,
    text: "解錠されることは想定していないようだ",
  },
];

// ===== ヒント情報 =====
const hints = [
  {
    step: 1,
    text: "ここからヒントを確認できます。<br>ヒントは段階的に公開されますので、必要に応じて「次のヒント」ボタンを押してください。",
  },
  {
    step: 2,
    text: 'ダイヤル錠を開けるための手がかりは、どうやら<span class="highlight">大変難しい</span>ようです。',
  },
  {
    step: 3,
    text: '「ケルナ語」とは<span class="highlight">架空の言語</span>のようです。',
  },
  {
    step: 4,
    text: '手掛かりには以下のように書かれているようです：<br><br>「最初の数字は<span class="clue-number">1</span>だよ。<br>2番目の数字は<span class="clue-number">5</span>だよ。<br>3番目の数字は<span class="clue-number">8</span>だよ。<br>4番目の数字は<span class="clue-number">2</span>だよ。」',
  },
  {
    step: 5,
    text: 'ダイヤル錠を開けるための番号は「<span class="highlight">1582</span>」になるようです。',
  },
  {
    step: 6,
    text: 'どうやらダイヤル錠を解錠しても宝箱は開かないようです。<br><span class="highlight">逆転の発想</span>が必要になりそうです。',
  },
  {
    step: 7,
    text: 'もしかすると<span class="highlight">宝箱自体</span>に何か仕掛けがあるかもしれません。',
  },
  {
    step: 8,
    text: 'この宝箱は<span class="highlight">最初から机に置いてありました</span>ね。',
  },
  {
    step: 9,
    text: '宝箱の<span class="highlight">底がない</span>可能性を考えてみてください。',
  },
  {
    step: 10,
    text: '底がない宝箱であれば、宝箱を<span class="highlight">上に持ち上げる</span>ことで中の紙を見つけることができそうです！',
  },
];

// ===== 正解 =====
const correctDial = [1, 5, 8, 2];
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
  const [currentClueStep, setCurrentClueStep] = useState(0);
  const [timerDisplay, setTimerDisplay] = useState("00:00");

  // モーダル状態
  const [showDialModal, setShowDialModal] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [showPaperModal, setShowPaperModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showClueModal, setShowClueModal] = useState(false);
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

  // ページ全体のスクロールを防止（モバイル対応）
  useEffect(() => {
    // 現在のスタイルを保存
    const originalHtmlStyle = document.documentElement.style.cssText;
    const originalBodyStyle = document.body.style.cssText;

    // スクロールを無効化
    document.documentElement.style.cssText = `
      overflow: hidden;
      height: 100%;
      position: fixed;
      width: 100%;
    `;
    document.body.style.cssText = `
      overflow: hidden;
      height: 100%;
      position: fixed;
      width: 100%;
      overscroll-behavior: none;
    `;

    // クリーンアップ: 元のスタイルに戻す
    return () => {
      document.documentElement.style.cssText = originalHtmlStyle;
      document.body.style.cssText = originalBodyStyle;
    };
  }, []);

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
      if (
        totalY > CONSTANTS.PAPER_SHOW_THRESHOLD &&
        !paperPositionSetRef.current
      ) {
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

  // ステップ3では紙クリックで閉じないようにする（×ボタンのみで閉じる）
  const handlePaperStep3Click = () => {
    // 正解キーワード表示時はクリックで閉じない
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
              to="/nazo"
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
        className="pt-16 md:pt-20 px-4 game-main"
        style={{ background: "var(--color-bg)" }}
      >
        {/* タイトルセクション */}
        <div className="max-w-4xl mx-auto text-center mb-4 md:mb-6">
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{
              color: "var(--color-primary)",
              fontFamily: "Space Grotesk, sans-serif",
            }}
          >
            逆転の宝箱
          </h1>
          <p
            className="text-base md:text-lg mb-1"
            style={{ color: "var(--color-text)", opacity: 0.8 }}
          >
            常識にとらわれていませんか？
          </p>
          <p
            className="text-xs md:text-sm"
            style={{ color: "var(--color-text)", opacity: 0.6 }}
          >
            難易度: ★☆☆☆☆ (初心者向け) | 想定プレイ時間: 10分
          </p>
        </div>

        {/* ゲームエリア */}
        <div className="max-w-6xl mx-auto game-area-container">
          <div
            className="relative p-2 md:p-4 rounded-2xl game-area flex items-end justify-center"
            style={{
              background:
                "linear-gradient(to bottom, rgba(198, 156, 109, 0.05), transparent)",
            }}
          >
            {/* テーブルエリア - すべてのオブジェクトを含む */}
            <div className="table-container">
              {/* テーブル画像 */}
              <img
                src="/assets/treasure-box/table2.png"
                alt="テーブル"
                className="table-image"
                draggable={false}
              />

              {/* テーブル上のオブジェクト - 左: 封筒（クリックでストーリー表示） */}
              <div
                className="table-object-left cursor-pointer hover:scale-110 transition-transform"
                onClick={() => {
                  setShowStoryModal(true);
                }}
              >
                <img
                  src="/assets/treasure-box/card1.png"
                  alt="封筒"
                  className="w-18 md:w-24 h-auto"
                  style={{
                    filter: "drop-shadow(0 10px 15px rgb(0 0 0 / 0.1))",
                    transform: "rotate(-15deg)",
                  }}
                  draggable={false}
                />
              </div>

              {/* テーブル上のオブジェクト - 右: メモ（クリックで手掛かり表示） */}
              <div
                className="table-object-right cursor-pointer hover:scale-110 transition-transform"
                onClick={() => {
                  setShowClueModal(true);
                }}
              >
                <img
                  src="/assets/treasure-box/memo1.png"
                  alt="メモ"
                  className="w-18 md:w-24 h-auto"
                  style={{
                    filter: "drop-shadow(0 10px 15px rgb(0 0 0 / 0.1))",
                    transform: "rotate(8deg)",
                  }}
                  draggable={false}
                />
              </div>

              {/* 宝箱コンテナ */}
              <div className="treasure-box-wrapper">
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
                    className="fallen-paper cursor-pointer hover:scale-105 transition-transform"
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
                      className="w-10 md:w-12 h-auto"
                      style={{
                        filter: "drop-shadow(0 10px 8px rgb(0 0 0 / 0.04))",
                      }}
                      draggable={false}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 固定フッター：解答欄とヒントボタン */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-2 md:gap-3">
          <div className="flex-1 flex items-center gap-2">
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
              placeholder="最終解答を入力"
              className={`flex-1 px-3 py-2 text-sm md:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 ${isShaking ? "animate-shake" : ""}`}
              style={{ borderColor: isShaking ? "#ef4444" : undefined }}
            />
            <button
              onClick={checkAnswer}
              className="px-4 md:px-6 py-2 text-white rounded-lg hover:opacity-90 transition-colors font-medium text-sm md:text-base whitespace-nowrap"
              style={{ background: "var(--color-accent)" }}
            >
              確認
            </button>
          </div>
          {/* ヒントボタン */}
          <button
            onClick={() => {
              setShowHintModal(true);
            }}
            className="w-10 h-10 md:w-12 md:h-12 text-white rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center text-xl md:text-2xl hint-button flex-shrink-0"
            style={{ background: "var(--color-accent)" }}
          >
            💡
          </button>
        </div>
        {answerFeedback && (
          <div className="max-w-2xl mx-auto mt-1 text-sm feedback-wrong text-center">
            {answerFeedback}
          </div>
        )}
      </div>

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
            // ステップ3（正解キーワード表示時）は背景クリックで閉じない
            if (e.target === e.currentTarget && paperStep !== 3) {
              setShowPaperModal(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            {/* 閉じるボタン（右上） */}
            <div className="flex justify-end mb-2">
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
                <div className="w-full flex flex-col items-center justify-center py-4 px-6">
                  <div
                    className="text-base font-medium mb-4 text-center"
                    style={{ color: "var(--color-primary)" }}
                  >
                    どうやら宝箱の底が抜けていたようだ
                  </div>
                  <img
                    src="/assets/treasure-box/kami-Photoroom.png"
                    alt="折りたたまれた紙"
                    className="max-w-full h-auto mx-auto mb-4"
                    draggable={false}
                  />
                  <div
                    className="text-xs py-2 px-4 rounded-full"
                    style={{
                      color: "var(--color-accent)",
                      background: "rgba(198, 156, 109, 0.1)",
                    }}
                  >
                    タップして紙を開く
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

      {/* ストーリーモーダル（挑戦状風） */}
      {showStoryModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-show"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowStoryModal(false);
            }
          }}
        >
          <div
            className="bg-amber-50 rounded-lg max-w-md w-full p-8 shadow-2xl relative overflow-hidden"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #fef7e8 0%, #fdf4dc 50%, #f9edd0 100%)",
              border: "3px double var(--color-accent)",
            }}
          >
            {/* 装飾的な角の飾り */}
            <div
              className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2"
              style={{ borderColor: "var(--color-accent)" }}
            />
            <div
              className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2"
              style={{ borderColor: "var(--color-accent)" }}
            />
            <div
              className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2"
              style={{ borderColor: "var(--color-accent)" }}
            />
            <div
              className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2"
              style={{ borderColor: "var(--color-accent)" }}
            />

            {/* 閉じるボタン */}
            <button
              onClick={() => {
                setShowStoryModal(false);
              }}
              className="absolute top-4 right-4 text-2xl leading-none hover:opacity-70 z-10"
              style={{ color: "var(--color-primary)", opacity: 0.6 }}
            >
              &times;
            </button>

            {/* タイトル */}
            <div className="text-center mb-6">
              <div
                className="text-sm tracking-widest mb-2"
                style={{ color: "var(--color-accent)" }}
              >
                ── 挑戦状 ──
              </div>
              <h3
                className="text-2xl font-bold"
                style={{
                  color: "var(--color-primary)",
                  fontFamily: "Space Grotesk, sans-serif",
                }}
              >
                謎解きへの招待
              </h3>
            </div>

            {/* 本文 */}
            <div
              className="space-y-4 text-center leading-relaxed"
              style={{
                color: "var(--color-primary)",
                fontFamily: "serif",
              }}
            >
              <p className="text-sm">親愛なる挑戦者へ</p>

              <p>
                ここには
                <span
                  className="font-bold"
                  style={{ color: "var(--color-accent)" }}
                >
                  4桁のダイヤル錠
                </span>
                がかかっている
                <br />
                古びた宝箱があります。
              </p>

              <p>
                この宝箱の中にある紙に書かれた
                <br />
                <span className="font-bold">キーワード</span>
                を送信できれば、
                <br />
                あなたの勝利です。
              </p>

              <div
                className="py-4 my-4"
                style={{
                  borderTop: "1px dashed var(--color-accent)",
                  borderBottom: "1px dashed var(--color-accent)",
                }}
              >
                <p
                  className="font-medium"
                  style={{ color: "var(--color-accent)" }}
                >
                  固定観念を逆転させ、
                  <br />
                  宝箱の中に隠されたキーワードを
                  <br />
                  見つけ出してください。
                </p>
              </div>

              <p
                className="text-xs pt-4"
                style={{ opacity: 0.6, fontStyle: "italic" }}
              >
                あなたの健闘を祈ります ──
              </p>
            </div>

            {/* 閉じるボタン */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setShowStoryModal(false);
                }}
                className="px-8 py-2 text-white rounded-full hover:opacity-90 transition-colors font-medium text-sm"
                style={{ background: "var(--color-accent)" }}
              >
                謎解きを始める
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 手掛かりモーダル（メモクリック時） */}
      {showClueModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-show"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowClueModal(false);
            }
          }}
        >
          <div
            className="bg-amber-50 rounded-lg max-w-sm w-full p-6 shadow-2xl relative overflow-hidden"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #fffef5 0%, #fff8e1 50%, #ffecb3 100%)",
              border: "2px solid var(--color-accent)",
            }}
          >
            {/* 閉じるボタン */}
            <button
              onClick={() => {
                setShowClueModal(false);
              }}
              className="absolute top-3 right-3 text-2xl leading-none hover:opacity-70 z-10"
              style={{ color: "var(--color-primary)", opacity: 0.6 }}
            >
              &times;
            </button>

            {/* タイトル */}
            <div className="text-center mb-4">
              <h3
                className="text-xl font-bold"
                style={{
                  color: "var(--color-primary)",
                  fontFamily: "Space Grotesk, sans-serif",
                }}
              >
                ダイヤル錠の手がかり
              </h3>
            </div>

            {/* 本文 */}
            <div
              className="mb-4 leading-relaxed text-center"
              style={{
                color: "var(--color-primary)",
                fontFamily: "serif",
              }}
            >
              <div
                className="py-4 px-3 rounded min-h-[100px] flex items-center justify-center"
                style={{
                  background: "rgba(198, 156, 109, 0.1)",
                  borderLeft: "3px solid var(--color-accent)",
                }}
              >
                <p
                  className="font-medium text-lg"
                  style={{ color: "var(--color-primary)" }}
                  dangerouslySetInnerHTML={{
                    __html: clues[currentClueStep]?.text || "",
                  }}
                />
              </div>
            </div>

            {/* ページ切り替えボタン */}
            <div className="flex gap-2 justify-center mb-3">
              <button
                onClick={() => {
                  setCurrentClueStep((prev) => Math.max(0, prev - 1));
                }}
                disabled={currentClueStep === 0}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                style={{ color: "var(--color-text)" }}
              >
                ← 前
              </button>
              <button
                onClick={() => {
                  setCurrentClueStep((prev) =>
                    Math.min(clues.length - 1, prev + 1),
                  );
                }}
                disabled={currentClueStep === clues.length - 1}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                style={{ background: "var(--color-accent)" }}
              >
                次 →
              </button>
            </div>

            {/* ページ番号 */}
            <div
              className="text-center text-xs"
              style={{ color: "var(--color-text)", opacity: 0.6 }}
            >
              手掛かり {currentClueStep + 1} / {clues.length}
            </div>
          </div>
        </div>
      )}

      {/* クリアモーダル */}
      {showClearModal && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-show"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(198, 156, 109, 0.3) 0%, rgba(0,0,0,0.7) 100%)",
          }}
        >
          {/* 背景の装飾 - キラキラ */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="floating-sparkle sparkle-1">🌟</div>
            <div className="floating-sparkle sparkle-2">✨</div>
            <div className="floating-sparkle sparkle-3">⭐</div>
            <div className="floating-sparkle sparkle-4">✨</div>
            <div className="floating-sparkle sparkle-5">🌟</div>
            <div className="floating-sparkle sparkle-6">✨</div>
            <div className="floating-sparkle sparkle-7">⭐</div>
            <div className="floating-sparkle sparkle-8">✨</div>
          </div>

          <div
            className="rounded-2xl max-w-md w-full p-6 text-center relative overflow-hidden clear-modal-card"
            style={{
              background:
                "linear-gradient(145deg, #fffcf7 0%, #fff9f0 30%, #fff5e6 70%, #fffcf7 100%)",
              border: "3px solid var(--color-accent)",
            }}
          >
            {/* 紙吹雪エリア */}
            <div
              id="confettiContainer"
              className="absolute inset-0 pointer-events-none overflow-hidden"
            ></div>

            {/* 上部の装飾リボン */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
              <div
                className="px-8 py-2 rounded-full text-sm font-bold shadow-lg ribbon-bounce flex items-center gap-1"
                style={{
                  background:
                    "linear-gradient(135deg, #e8a54d 0%, #c69c6d 50%, #e8a54d 100%)",
                  color: "white",
                  boxShadow: "0 4px 15px rgba(198, 156, 109, 0.5)",
                }}
              >
                <span>🎊</span>
                <span>CLEAR!</span>
                <span>🎊</span>
              </div>
            </div>

            <div className="relative z-10 pt-6">
              {/* キャラクター画像 */}
              <div className="character-bounce mb-3">
                <img
                  src="/assets/images/yama-tahappy.png"
                  alt="やまーた"
                  className="w-40 h-auto mx-auto"
                  style={{
                    filter: "drop-shadow(0 8px 16px rgba(198, 156, 109, 0.3))",
                  }}
                  draggable={false}
                />
              </div>

              <h2
                className="text-2xl md:text-3xl font-bold mb-2"
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  color: "var(--color-primary)",
                }}
              >
                🎉 おめでとう！ 🎉
              </h2>
              <p
                className="text-base mb-4"
                style={{ color: "var(--color-text)" }}
              >
                「逆転の宝箱」をクリアしました！
              </p>

              {/* クリアタイム */}
              <div
                className="rounded-xl p-4 mb-5 relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(232, 165, 77, 0.15) 0%, rgba(198, 156, 109, 0.1) 100%)",
                  border: "2px solid rgba(198, 156, 109, 0.4)",
                }}
              >
                <div className="absolute top-1 right-2 text-lg">⏱️</div>
                <div
                  className="text-xs mb-1 font-semibold tracking-wide"
                  style={{ color: "var(--color-accent)" }}
                >
                  クリアタイム
                </div>
                <div
                  className="text-3xl font-mono font-bold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {timerDisplay}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={shareOnX}
                  className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <span>𝕏</span>
                  <span>クリアを X でシェア</span>
                </button>
                <Link
                  to="/nazo"
                  className="block w-full px-6 py-3 text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-md hover:shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #d4a574 0%, #c69c6d 100%)",
                  }}
                >
                  謎解き一覧に戻る
                </Link>
                <button
                  onClick={retry}
                  className="w-full px-6 py-3 rounded-lg transition-all font-medium border-2 hover:bg-amber-50"
                  style={{
                    color: "var(--color-text)",
                    borderColor: "var(--color-accent)",
                    background: "transparent",
                  }}
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
        /* メインコンテンツ - 画面に収まるように */
        .game-main {
          height: calc(100vh - 64px);
          height: calc(100dvh - 64px); /* 動的ビューポート高さ（iOS Safari対応） */
          display: flex;
          flex-direction: column;
          overflow: hidden;
          touch-action: none; /* タッチスクロールを防止 */
        }

        /* ゲームエリアコンテナ */
        .game-area-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        /* ゲームエリア */
        .game-area {
          flex: 1;
          min-height: 0;
          position: relative;
        }

        /* テーブルコンテナ - テーブルとすべてのオブジェクトを含む */
        .table-container {
          position: relative;
          width: 60%;
          max-width: 700px;
          margin: 0 auto;
        }

        .table-image {
          width: 100%;
          height: auto;
          display: block;
        }

        /* 宝箱ラッパー - テーブル上に配置 */
        .treasure-box-wrapper {
          position: absolute;
          top: -5%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* 落ちてきた紙 */
        .fallen-paper {
          margin-top: -15px;
        }

        /* テーブル上のオブジェクト - 左: 封筒 */
        .table-object-left {
          position: absolute;
          top: 5%;
          left: 18%;
          transform: translateY(-50%);
          z-index: 9;
        }

        /* テーブル上のオブジェクト - 右: メモ */
        .table-object-right {
          position: absolute;
          top: 5%;
          right: 18%;
          transform: translateY(-50%);
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
          top: -10px;
          animation: confettiFall 3s linear forwards;
        }

        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(600px) rotate(720deg);
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

        /* 手掛かりの数字 */
        .clue-number {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--color-accent);
          display: inline-block;
          padding: 0.25rem 0.5rem;
          background: rgba(198, 156, 109, 0.15);
          border-radius: 4px;
        }

        /* レスポンシブ対応 - PC版 */
        @media (min-width: 769px) {
          .game-main {
            height: calc(100vh - 80px - 80px); /* ナビとフッターを除く */
            height: calc(100dvh - 80px - 80px); /* 動的ビューポート高さ */
            padding-bottom: 0;
          }

          .table-container {
            width: 70%;
            max-width: 800px;
          }

          .table-object-left {
            left: 12%;
          }

          .table-object-right {
            right: 12%;
          }
        }

        /* レスポンシブ対応 - モバイル版 */
        @media (max-width: 768px) {
          .game-main {
            height: calc(100vh - 64px - 80px); /* ナビとフッターを除く */
            height: calc(100dvh - 64px - 80px); /* 動的ビューポート高さ（iOS Safari対応） */
            padding-bottom: 0;
            box-sizing: border-box;
          }

          .table-container {
            width: 90%;
          }

          .table-object-left {
            top: 8%;
            left: 8%;
            transform: translateY(-40%) scale(0.85);
          }

          .table-object-right {
            top: 8%;
            right: 8%;
            transform: translateY(-40%) scale(0.85);
          }
        }

        /* ===== クリアモーダル用アニメーション ===== */

        /* キャラクターのバウンスアニメーション */
        .character-bounce {
          animation: characterBounce 2.5s ease-in-out infinite;
        }

        @keyframes characterBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        /* リボンのバウンスアニメーション */
        .ribbon-bounce {
          animation: ribbonBounce 2s ease-in-out infinite;
        }

        @keyframes ribbonBounce {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.03);
          }
        }

        /* モーダルカードの光沢効果 */
        .clear-modal-card {
          box-shadow:
            0 0 40px rgba(232, 165, 77, 0.3),
            0 0 80px rgba(198, 156, 109, 0.2),
            0 25px 50px rgba(0, 0, 0, 0.15);
        }

        /* キラキラのフローティングアニメーション */
        .floating-sparkle {
          position: absolute;
          font-size: 1.5rem;
          animation: floatSparkle 3s ease-in-out infinite;
        }

        .sparkle-1 {
          top: 15%;
          left: 10%;
          animation-delay: 0s;
          font-size: 1.8rem;
        }

        .sparkle-2 {
          top: 25%;
          right: 12%;
          animation-delay: 0.4s;
          font-size: 1.3rem;
        }

        .sparkle-3 {
          bottom: 40%;
          left: 8%;
          animation-delay: 0.8s;
          font-size: 1.6rem;
        }

        .sparkle-4 {
          top: 50%;
          right: 8%;
          animation-delay: 1.2s;
          font-size: 1.2rem;
        }

        .sparkle-5 {
          bottom: 20%;
          left: 15%;
          animation-delay: 1.6s;
          font-size: 1.7rem;
        }

        .sparkle-6 {
          top: 35%;
          left: 5%;
          animation-delay: 2s;
          font-size: 1.1rem;
        }

        .sparkle-7 {
          bottom: 30%;
          right: 15%;
          animation-delay: 2.4s;
          font-size: 1.4rem;
        }

        .sparkle-8 {
          top: 18%;
          right: 5%;
          animation-delay: 2.8s;
          font-size: 1rem;
        }

        @keyframes floatSparkle {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.4) rotate(15deg);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
