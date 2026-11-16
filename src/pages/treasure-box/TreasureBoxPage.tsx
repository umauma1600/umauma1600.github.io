import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  BulbIcon,
  ChestArt,
  EnvelopeArt,
  CrumpledPaperArt,
  LampArt,
  LockArt,
  MemoArt,
  TableArt,
} from "./art";
import { formatTime, isFinalAnswer, KEYWORD } from "./data";
import {
  ClearModal,
  DialModal,
  HintModal,
  LetterModal,
  MemoModal,
  PaperModal,
} from "./modals";
import { useChestLift } from "./useChestLift";
import "./treasure-box.css";

/** これ以上持ち上げると、底のない宝箱から紙が落ちる(px) */
const PAPER_REVEAL_LIFT = 36;
/** ひとこと（場面下のナレーション）を表示しておく時間 */
const CAPTION_MS = 4500;

type ModalName = "letter" | "memo" | "dial" | "hint" | "paper" | "clear";

/** 机の上に落ちた紙。x は落ちた位置、drop は落ち始めの高さ */
interface FallenPaper {
  x: number;
  drop: number;
}

function ElapsedTime({ startedAt }: { startedAt: number | null }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (startedAt === null) return;
    const tick = () => {
      setSeconds(Math.floor((Date.now() - startedAt) / 1000));
    };
    tick();
    const timer = window.setInterval(tick, 500);
    return () => {
      window.clearInterval(timer);
    };
  }, [startedAt]);

  return <>{formatTime(seconds)}</>;
}

function Game({ onRetry }: { onRetry: () => void }) {
  // 進行状況
  const [modal, setModal] = useState<ModalName | null>("letter");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [clearTime, setClearTime] = useState<string | null>(null);
  const [digits, setDigits] = useState([0, 0, 0, 0]);
  const [unlocked, setUnlocked] = useState(false);
  const [paper, setPaper] = useState<FallenPaper | null>(null);
  const [paperOpened, setPaperOpened] = useState(false);
  const [memoPage, setMemoPage] = useState(0);
  const [hintStep, setHintStep] = useState(0);

  // 解答欄とナレーション
  const [answer, setAnswer] = useState("");
  const [wrongCount, setWrongCount] = useState(0);
  const [caption, setCaption] = useState<{ id: number; text: string } | null>(
    null,
  );

  const sceneRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLInputElement>(null);
  const paperFoundRef = useRef(false);

  const say = useCallback((text: string) => {
    setCaption((prev) => ({ id: (prev?.id ?? 0) + 1, text }));
  }, []);

  useEffect(() => {
    if (!caption) return;
    const timer = window.setTimeout(() => {
      setCaption(null);
    }, CAPTION_MS);
    return () => {
      window.clearTimeout(timer);
    };
  }, [caption]);

  // ゲーム中はページをスクロールさせない
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const handleChestMove = useCallback(
    ({ x, lift }: { x: number; lift: number }) => {
      if (paperFoundRef.current || lift < PAPER_REVEAL_LIFT) return;
      paperFoundRef.current = true;
      setPaper({ x, drop: lift });
      say("宝箱の下から、丸められた紙が落ちてきた！");
    },
    [say],
  );

  const chest = useChestLift(sceneRef, handleChestMove);

  const closeLetter = () => {
    setModal(null);
    if (startedAt === null) {
      setStartedAt(Date.now());
      say("気になるところをタップして調べてみよう。");
    }
  };

  const rotateDial = (index: number, direction: 1 | -1) => {
    setDigits((prev) =>
      prev.map((digit, i) =>
        i === index ? (digit + direction + 10) % 10 : digit,
      ),
    );
  };

  const handleUnlock = () => {
    setUnlocked(true);
    setModal(null);
    say("錠は外れた。……しかし、蓋はびくともしない。");
  };

  const handleChestTap = () => {
    chest.rattle();
    say(
      unlocked
        ? "錠は外したのに、蓋は固く閉ざされたままだ。"
        : "ダイヤル錠がかかっていて、蓋は開かない。",
    );
  };

  const submitAnswer = (e: FormEvent) => {
    e.preventDefault();
    if (!isFinalAnswer(answer)) {
      setWrongCount((n) => n + 1);
      answerRef.current?.animate(
        [0, -8, 8, -6, 6, -3, 0].map((x) => ({
          transform: `translateX(${x}px)`,
        })),
        { duration: 420 },
      );
      return;
    }
    const elapsed =
      startedAt === null ? 0 : Math.floor((Date.now() - startedAt) / 1000);
    answerRef.current?.blur();
    setClearTime(formatTime(elapsed));
    setModal("clear");
  };

  const lifted = chest.position.lift > 0;
  const shadowFade = Math.min(chest.position.lift / 260, 0.65);

  return (
    <div className="tb-root">
      <header className="tb-header">
        <Link to="/nazo" className="tb-back" aria-label="謎解き一覧に戻る">
          <span aria-hidden="true">←</span> 一覧へ
        </Link>
        <h1 className="tb-title">逆転の宝箱</h1>
        <p className="tb-timer" aria-label="プレイ時間">
          {clearTime ?? <ElapsedTime startedAt={startedAt} />}
        </p>
      </header>

      <main className="tb-scene" ref={sceneRef}>
        <LampArt />
        <div className="tb-glow" />
        <TableArt />

        <div className="tb-stage">
          <div
            className="tb-chest-shadow"
            data-mode={chest.mode}
            style={{
              transform: `translateX(${chest.position.x}px) scale(${1 - shadowFade * 0.5})`,
              opacity: 1 - shadowFade,
            }}
          />

          <div
            ref={chest.chestRef}
            className="tb-chest"
            data-mode={chest.mode}
            role="group"
            aria-label="宝箱（ドラッグ、または上矢印キーで動かせます）"
            tabIndex={0}
            style={{
              transform: `translate3d(${chest.position.x}px, ${-chest.position.lift}px, 0)`,
            }}
            onClick={handleChestTap}
            {...chest.handlers}
          >
            <div
              ref={chest.innerRef}
              className={`tb-chest-inner ${lifted ? "is-lifted" : ""}`}
            >
              <ChestArt />
              <button
                type="button"
                className={`tb-lock ${unlocked ? "is-open" : ""}`}
                aria-label="ダイヤル錠を調べる"
                disabled={unlocked}
                onClick={(e) => {
                  e.stopPropagation();
                  setModal("dial");
                }}
              >
                <LockArt digits={digits} />
              </button>
            </div>
          </div>

          <button
            type="button"
            className="tb-prop tb-envelope"
            aria-label="封筒（挑戦状）を読む"
            onClick={() => {
              setModal("letter");
            }}
          >
            <EnvelopeArt />
          </button>

          <button
            type="button"
            className="tb-prop tb-memo"
            aria-label="メモを読む"
            onClick={() => {
              setModal("memo");
            }}
          >
            <MemoArt />
          </button>

          {paper && (
            <div
              className="tb-paper-pos"
              style={{ transform: `translateX(${paper.x}px)` }}
            >
              <button
                type="button"
                className="tb-prop tb-paper"
                aria-label="落ちてきた紙を調べる"
                style={{ "--tb-drop": `${-paper.drop}px` } as CSSProperties}
                onClick={() => {
                  setModal("paper");
                }}
              >
                <CrumpledPaperArt />
              </button>
            </div>
          )}
        </div>

        <p className="tb-caption-area" aria-live="polite">
          {caption && (
            <span className="tb-caption" key={caption.id}>
              {caption.text}
            </span>
          )}
        </p>
      </main>

      <footer className="tb-footer">
        <form className="tb-answer" onSubmit={submitAnswer}>
          <input
            ref={answerRef}
            type="text"
            className={`tb-answer-input ${wrongCount > 0 ? "is-wrong" : ""}`}
            value={answer}
            placeholder="最終解答を入力"
            aria-label="最終解答"
            enterKeyHint="send"
            autoComplete="off"
            onChange={(e) => {
              setAnswer(e.target.value);
            }}
          />
          <button type="submit" className="tb-btn">
            回答
          </button>
          <button
            type="button"
            className="tb-hint-button"
            aria-label="ヒントを見る"
            onClick={() => {
              setModal("hint");
            }}
          >
            <BulbIcon />
          </button>
        </form>
        {wrongCount > 0 && (
          <p className="tb-answer-error" role="alert" key={wrongCount}>
            違うようです……もう一度考えてみましょう。
          </p>
        )}
      </footer>

      {modal === "letter" && (
        <LetterModal started={startedAt !== null} onClose={closeLetter} />
      )}
      {modal === "memo" && (
        <MemoModal
          page={memoPage}
          onPageChange={setMemoPage}
          onClose={() => {
            setModal(null);
          }}
        />
      )}
      {modal === "dial" && (
        <DialModal
          digits={digits}
          onRotate={rotateDial}
          onUnlock={handleUnlock}
          onClose={() => {
            setModal(null);
          }}
        />
      )}
      {modal === "hint" && (
        <HintModal
          step={hintStep}
          onStepChange={setHintStep}
          onClose={() => {
            setModal(null);
          }}
        />
      )}
      {modal === "paper" && (
        <PaperModal
          opened={paperOpened}
          onOpen={() => {
            setPaperOpened(true);
          }}
          onClose={() => {
            setModal(null);
          }}
          onAnswer={() => {
            // 紙に書いてあったキーワードをそのまま解答欄に写す
            setAnswer(KEYWORD);
            setModal(null);
            answerRef.current?.focus();
          }}
        />
      )}
      {modal === "clear" && clearTime !== null && (
        <ClearModal time={clearTime} onRetry={onRetry} />
      )}
    </div>
  );
}

export default function TreasureBoxPage() {
  // 「もう一度挑戦」は key を変えてゲームを丸ごと作り直す
  const [round, setRound] = useState(0);
  return (
    <Game
      key={round}
      onRetry={() => {
        setRound((n) => n + 1);
      }}
    />
  );
}
