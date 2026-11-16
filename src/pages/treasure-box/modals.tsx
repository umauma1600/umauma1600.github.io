import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronIcon, CreasesArt, CrumpledPaperArt } from "./art";
import { DIAL_ANSWER, HINTS, KEYWORD, MEMO_PAGES } from "./data";

// ===== 共通部品 =====

interface ModalProps {
  /** 見出し要素の id（aria-labelledby 用） */
  titleId: string;
  className?: string;
  /** 背景タップ・Esc・×ボタンで閉じる。省略すると閉じられないモーダルになる */
  onClose?: () => void;
  children: ReactNode;
}

function Modal({ titleId, className = "", onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!onClose) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      className="tb-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={dialogRef}
        className={`tb-modal ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        {onClose && (
          <button
            type="button"
            className="tb-close"
            aria-label="閉じる"
            onClick={onClose}
          >
            &times;
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

interface PagerProps {
  page: number;
  total: number;
  label: string;
  prevLabel: string;
  nextLabel: string;
  onChange: (page: number) => void;
}

function Pager({
  page,
  total,
  label,
  prevLabel,
  nextLabel,
  onChange,
}: PagerProps) {
  return (
    <div className="tb-pager">
      <button
        type="button"
        className="tb-btn tb-btn--ghost"
        disabled={page === 0}
        onClick={() => {
          onChange(page - 1);
        }}
      >
        ← {prevLabel}
      </button>
      <span className="tb-pager-count">
        {label} {page + 1} / {total}
      </span>
      <button
        type="button"
        className="tb-btn"
        disabled={page === total - 1}
        onClick={() => {
          onChange(page + 1);
        }}
      >
        {nextLabel} →
      </button>
    </div>
  );
}

// ===== 挑戦状 =====

export function LetterModal({
  started,
  onClose,
}: {
  started: boolean;
  onClose: () => void;
}) {
  return (
    <Modal titleId="tb-letter-title" className="tb-letter" onClose={onClose}>
      <p className="tb-letter-kicker">── 挑戦状 ──</p>
      <h2 id="tb-letter-title" className="tb-letter-title">
        謎解きへの招待
      </h2>
      <div className="tb-letter-body">
        <p className="tb-letter-small">親愛なる挑戦者へ</p>
        <p>
          ここには<strong>4桁のダイヤル錠</strong>がかかっている
          <br />
          古びた宝箱があります。
        </p>
        <p>
          この宝箱の中にある紙に書かれた
          <br />
          <strong>キーワード</strong>を送信できれば、
          <br />
          あなたの勝利です。
        </p>
        <p className="tb-letter-emphasis">
          固定観念を逆転させ、
          <br />
          宝箱の中に隠されたキーワードを
          <br />
          見つけ出してください。
        </p>
        <p className="tb-letter-small">あなたの健闘を祈ります ──</p>
      </div>
      <div className="tb-actions">
        <button type="button" className="tb-btn" onClick={onClose}>
          {started ? "机に戻る" : "謎解きを始める"}
        </button>
      </div>
    </Modal>
  );
}

// ===== メモ（ダイヤル錠の手がかり） =====

export function MemoModal({
  page,
  onPageChange,
  onClose,
}: {
  page: number;
  onPageChange: (page: number) => void;
  onClose: () => void;
}) {
  return (
    <Modal titleId="tb-memo-title" className="tb-memo-modal" onClose={onClose}>
      <h2 id="tb-memo-title" className="tb-modal-title">
        ダイヤル錠の手がかり
      </h2>
      <div className="tb-memo-sheet" key={page}>
        {MEMO_PAGES[page]}
      </div>
      <Pager
        page={page}
        total={MEMO_PAGES.length}
        label="メモ"
        prevLabel="前"
        nextLabel="次"
        onChange={onPageChange}
      />
    </Modal>
  );
}

// ===== ダイヤル錠 =====

const UNLOCK_DELAY_MS = 1100;

export function DialModal({
  digits,
  onRotate,
  onUnlock,
  onClose,
}: {
  digits: number[];
  onRotate: (index: number, direction: 1 | -1) => void;
  onUnlock: () => void;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "wrong" | "open">("idle");
  const [attempt, setAttempt] = useState(0);

  // 解錠の手応えを見せてから閉じる（親の再描画でタイマーがやり直しにならないよう ref 経由で呼ぶ）
  const onUnlockRef = useRef(onUnlock);
  useEffect(() => {
    onUnlockRef.current = onUnlock;
  });
  useEffect(() => {
    if (status !== "open") return;
    const timer = window.setTimeout(() => {
      onUnlockRef.current();
    }, UNLOCK_DELAY_MS);
    return () => {
      window.clearTimeout(timer);
    };
  }, [status]);

  const tryOpen = () => {
    if (digits.every((digit, i) => digit === DIAL_ANSWER[i])) {
      setStatus("open");
    } else {
      setStatus("wrong");
      setAttempt((n) => n + 1);
    }
  };

  const locked = status !== "open";

  return (
    <Modal
      titleId="tb-dial-title"
      className="tb-dial-modal"
      onClose={locked ? onClose : undefined}
    >
      <h2 id="tb-dial-title" className="tb-modal-title">
        ダイヤル錠
      </h2>
      <p className="tb-modal-lead">4桁の番号を合わせて、錠を開けてください。</p>

      <div
        className={`tb-dial ${status === "wrong" ? "is-wrong" : ""} ${locked ? "" : "is-open"}`}
        key={attempt}
      >
        {digits.map((digit, i) => (
          <div className="tb-dial-col" key={i}>
            <button
              type="button"
              className="tb-dial-step"
              aria-label={`${i + 1}桁目を1つ進める`}
              disabled={!locked}
              onClick={() => {
                setStatus("idle");
                onRotate(i, 1);
              }}
            >
              <ChevronIcon direction="up" />
            </button>
            <div className="tb-dial-window" aria-live="polite">
              <span className="tb-dial-digit" key={digit}>
                {digit}
              </span>
            </div>
            <button
              type="button"
              className="tb-dial-step"
              aria-label={`${i + 1}桁目を1つ戻す`}
              disabled={!locked}
              onClick={() => {
                setStatus("idle");
                onRotate(i, -1);
              }}
            >
              <ChevronIcon direction="down" />
            </button>
          </div>
        ))}
      </div>

      <p className={`tb-feedback tb-feedback--${status}`} role="status">
        {status === "wrong" && "番号が違うようです……"}
        {status === "open" && "カチッ。錠が開きました！"}
      </p>

      <div className="tb-actions">
        <button
          type="button"
          className="tb-btn tb-btn--wide"
          disabled={!locked}
          onClick={tryOpen}
        >
          OPEN
        </button>
      </div>
    </Modal>
  );
}

// ===== ヒント =====

export function HintModal({
  step,
  onStepChange,
  onClose,
}: {
  step: number;
  onStepChange: (step: number) => void;
  onClose: () => void;
}) {
  return (
    <Modal titleId="tb-hint-title" onClose={onClose}>
      <h2 id="tb-hint-title" className="tb-modal-title">
        ヒント
      </h2>
      <div className="tb-hint-body" key={step}>
        {HINTS[step]}
      </div>
      <Pager
        page={step}
        total={HINTS.length}
        label="ヒント"
        prevLabel="前のヒント"
        nextLabel="次のヒント"
        onChange={onStepChange}
      />
    </Modal>
  );
}

// ===== 宝箱の下から出てきた紙 =====

export function PaperModal({
  opened,
  onOpen,
  onClose,
  onAnswer,
}: {
  opened: boolean;
  onOpen: () => void;
  onClose: () => void;
  onAnswer: () => void;
}) {
  return (
    <Modal
      titleId="tb-paper-title"
      className="tb-paper-modal"
      onClose={onClose}
    >
      <h2 id="tb-paper-title" className="tb-modal-lead tb-paper-lead">
        どうやら宝箱の底が抜けていたようだ
      </h2>

      <div className="tb-note-wrap">
        <button
          type="button"
          className={`tb-note ${opened ? "is-open" : ""}`}
          aria-label={opened ? undefined : "紙を広げる"}
          onClick={() => {
            if (!opened) onOpen();
          }}
        >
          <span className="tb-note-ball">
            <CrumpledPaperArt />
          </span>
          <span className="tb-note-sheet">
            <CreasesArt />
            <span className="tb-note-text">
              <span className="tb-note-label">正解のキーワード</span>
              <span className="tb-note-keyword">{KEYWORD}</span>
            </span>
          </span>
        </button>
      </div>

      <div className="tb-actions">
        {opened ? (
          <button type="button" className="tb-btn" onClick={onAnswer}>
            キーワードを解答する
          </button>
        ) : (
          <span className="tb-tap-hint">
            <span className="tb-tap-hint-icon">
              <CrumpledPaperArt />
            </span>
            タップして紙を広げる
          </span>
        )}
      </div>
    </Modal>
  );
}

// ===== クリア =====

const CONFETTI_COLORS = [
  "#c69c6d",
  "#e8a54d",
  "#a23b2c",
  "#33443b",
  "#f0d7a4",
  "#7a4a2a",
];

function createConfetti() {
  return Array.from({ length: 48 }, (_, i) => ({
    id: i,
    style: {
      left: `${Math.random() * 100}%`,
      background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      animationDelay: `${Math.random() * 2.5}s`,
      animationDuration: `${2.4 + Math.random() * 2}s`,
      "--tb-spin": `${(Math.random() * 720 - 360).toFixed(0)}deg`,
    } as CSSProperties,
  }));
}

export function ClearModal({
  time,
  onRetry,
}: {
  time: string;
  onRetry: () => void;
}) {
  const [confetti] = useState(createConfetti);

  const share = () => {
    const text = `「逆転の宝箱」をクリアしました！⏱️ ${time}\n固定観念を逆転させる謎解きに挑戦しよう！\n#ひみつ箱のアトリエ`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank", "noopener,width=550,height=420");
  };

  return (
    <Modal titleId="tb-clear-title" className="tb-clear">
      <div className="tb-confetti" aria-hidden="true">
        {confetti.map((piece) => (
          <span key={piece.id} style={piece.style} />
        ))}
      </div>
      <p className="tb-clear-ribbon">CLEAR!</p>
      <img
        className="tb-clear-character"
        src="/assets/images/yama-tahappy.webp"
        alt="喜ぶやまーた"
        draggable={false}
      />
      <h2 id="tb-clear-title" className="tb-clear-title">
        おめでとう！
      </h2>
      <p className="tb-clear-text">「逆転の宝箱」をクリアしました！</p>
      <dl className="tb-clear-time">
        <dt>クリアタイム</dt>
        <dd>{time}</dd>
      </dl>
      <div className="tb-clear-actions">
        <button type="button" className="tb-btn tb-btn--dark" onClick={share}>
          𝕏 でシェア
        </button>
        <Link to="/nazo" className="tb-btn">
          謎解き一覧に戻る
        </Link>
        <button
          type="button"
          className="tb-btn tb-btn--ghost"
          onClick={onRetry}
        >
          もう一度挑戦
        </button>
      </div>
    </Modal>
  );
}
