// 探索画面の上に重ねて開くもの（資料・錠・アイテム・ヒント）
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ItemArt } from "./art";
import {
  DOCS,
  DOC_ORDER,
  ENDINGS,
  ITEM_DESCRIPTIONS,
  formatClock,
  type Doc,
} from "./data";
import {
  BOMB_MS,
  BOX_CODE,
  ENDING_ORDER,
  ITEM_NAMES,
  has,
  isPill,
  type DocId,
  type Ending,
  type GameState,
  type Hint,
  type ItemId,
  type PillId,
} from "./game";

// ===== 共通の枠 =====

interface SheetProps {
  title: string;
  wide?: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Sheet({ title, wide = false, onClose, children }: SheetProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  useEffect(() => {
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
      className="eg-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        className={`eg-sheet${wide ? " eg-sheet-wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <header className="eg-sheet-head">
          <h2>{title}</h2>
          <button
            type="button"
            className="eg-close"
            aria-label="閉じる"
            onClick={onClose}
          >
            &times;
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}

// ===== 画像の拡大表示 =====

function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  // マウスでつかんで動かしたあとの「離す」を、閉じる操作と区別する
  const drag = useRef({ active: false, moved: false, x: 0, y: 0 });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey, true);
    return () => {
      window.removeEventListener("keydown", handleKey, true);
    };
  }, [onClose]);

  // 画面からはみ出す大きさのときは、中央から見はじめる
  const center = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
  };

  return (
    <div
      className="eg-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <div
        ref={scrollRef}
        className="eg-lightbox-scroll"
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") return;
          drag.current = {
            active: true,
            moved: false,
            x: e.clientX,
            y: e.clientY,
          };
        }}
        onPointerMove={(e) => {
          const state = drag.current;
          const el = scrollRef.current;
          if (!state.active || !el) return;
          const dx = e.clientX - state.x;
          const dy = e.clientY - state.y;
          if (Math.abs(dx) + Math.abs(dy) < 4 && !state.moved) return;
          state.moved = true;
          el.scrollLeft -= dx;
          el.scrollTop -= dy;
          state.x = e.clientX;
          state.y = e.clientY;
        }}
        onPointerUp={() => {
          drag.current.active = false;
        }}
        onPointerLeave={() => {
          drag.current.active = false;
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!drag.current.moved) onClose();
          drag.current.moved = false;
        }}
      >
        <img src={src} alt={alt} draggable={false} onLoad={center} />
      </div>
      <p className="eg-lightbox-note">タップで閉じる</p>
    </div>
  );
}

/** タップすると画面いっぱいに拡大できる画像 */
export function ZoomImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <button
        type="button"
        className={`eg-zoom ${className}`}
        aria-label="拡大する"
        onClick={() => {
          setOpen(true);
        }}
      >
        <img src={src} alt={alt} draggable={false} />
      </button>
      {open && <Lightbox src={src} alt={alt} onClose={close} />}
    </>
  );
}

// ===== 資料（本・手紙・箱の中の紙） =====

export function DocViewer({ doc, onClose }: { doc: Doc; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const last = doc.pages.length - 1;
  const current = doc.pages[Math.min(index, last)];

  const go = (next: number) => {
    setIndex(Math.max(0, Math.min(last, next)));
  };

  return (
    <Sheet title={doc.title} wide onClose={onClose}>
      <div className="eg-doc-page">
        <ZoomImage src={current.src} alt={current.alt} />
      </div>
      <footer className="eg-doc-foot">
        <button
          type="button"
          className="eg-btn"
          disabled={index === 0}
          onClick={() => {
            go(index - 1);
          }}
        >
          ‹ 前へ
        </button>
        <span className="eg-doc-count">
          {last > 0 ? `${index + 1} / ${last + 1} ・ ` : ""}タップで拡大
        </span>
        <button
          type="button"
          className="eg-btn"
          disabled={index === last}
          onClick={() => {
            go(index + 1);
          }}
        >
          次へ ›
        </button>
      </footer>
    </Sheet>
  );
}

/** これまでに読んだ資料の一覧 */
export function DocList({
  docs,
  onOpen,
  onClose,
}: {
  docs: DocId[];
  onOpen: (doc: DocId) => void;
  onClose: () => void;
}) {
  const read = DOC_ORDER.filter((doc) => docs.includes(doc));
  return (
    <Sheet title="読んだ資料" onClose={onClose}>
      <div className="eg-sheet-body">
        {read.length === 0 ? (
          <p className="eg-note">
            まだ何も読んでいない。部屋にある本を調べると、ここからいつでも読み返せる。
          </p>
        ) : (
          <ul className="eg-doc-list">
            {read.map((doc) => (
              <li key={doc}>
                <button
                  type="button"
                  className="eg-btn eg-btn-wide"
                  onClick={() => {
                    onOpen(doc);
                  }}
                >
                  {DOCS[doc].title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Sheet>
  );
}

// ===== 3桁錠 =====

export function DialLock({
  onOpen,
  onClose,
}: {
  onOpen: () => void;
  onClose: () => void;
}) {
  const [digits, setDigits] = useState([0, 0, 0]);
  const [wrong, setWrong] = useState(0);

  const spin = (index: number, step: number) => {
    setDigits((prev) =>
      prev.map((digit, i) => (i === index ? (digit + step + 10) % 10 : digit)),
    );
  };

  const tryOpen = () => {
    if (digits.join("") === BOX_CODE) onOpen();
    else setWrong((count) => count + 1);
  };

  return (
    <Sheet title="錠のついた箱" onClose={onClose}>
      <div className="eg-sheet-body">
        <p className="eg-note">3桁の数字を合わせると開きそうだ。</p>
        <div key={wrong} className={`eg-dial${wrong > 0 ? " is-wrong" : ""}`}>
          {digits.map((digit, i) => (
            <div key={i} className="eg-dial-col">
              <button
                type="button"
                aria-label={`${i + 1}桁目を進める`}
                onClick={() => {
                  spin(i, 1);
                }}
              >
                ▲
              </button>
              <output aria-label={`${i + 1}桁目`}>{digit}</output>
              <button
                type="button"
                aria-label={`${i + 1}桁目を戻す`}
                onClick={() => {
                  spin(i, -1);
                }}
              >
                ▼
              </button>
            </div>
          ))}
        </div>
        <p className="eg-dial-msg" role="status">
          {wrong > 0 ? "開かない。番号が違うようだ。" : " "}
        </p>
        <button
          type="button"
          className="eg-btn eg-btn-primary eg-btn-wide"
          onClick={tryOpen}
        >
          開ける
        </button>
      </div>
    </Sheet>
  );
}

// ===== アイテムの詳細 =====

export function ItemSheet({
  item,
  state,
  onDrink,
  onRead,
  onClose,
}: {
  item: ItemId;
  state: GameState;
  onDrink: (pill: PillId) => void;
  onRead: () => void;
  onClose: () => void;
}) {
  let extra: ReactNode = null;
  if (item === "pot") {
    extra = (
      <p className="eg-note">
        {state.potWater ? "水がなみなみと入っている。" : "中は空っぽだ。"}
      </p>
    );
  } else if (item === "bomb") {
    extra = (
      <p className="eg-note">
        爆発まで、あと {formatClock(BOMB_MS - state.elapsed)}
      </p>
    );
  }

  return (
    <Sheet title={ITEM_NAMES[item]} onClose={onClose}>
      <div className="eg-sheet-body eg-item-sheet">
        <div className="eg-item-big">
          <ItemArt item={item} water={state.potWater} />
        </div>
        <p>{ITEM_DESCRIPTIONS[item]}</p>
        {extra}
        {item === "letter" && (
          <button
            type="button"
            className="eg-btn eg-btn-primary eg-btn-wide"
            onClick={onRead}
          >
            読み返す
          </button>
        )}
        {isPill(item) && has(state, item) && (
          <>
            <button
              type="button"
              className="eg-btn eg-btn-primary eg-btn-wide"
              onClick={() => {
                onDrink(item);
              }}
            >
              飲む
            </button>
            <p className="eg-note">一度飲むと、なくなってしまう。</p>
          </>
        )}
        {!isPill(item) && (
          <p className="eg-note">
            選んだまま、使いたい場所をタップすると使える。
          </p>
        )}
      </div>
    </Sheet>
  );
}

// ===== ヒント =====

export function HintSheet({
  hint,
  page,
  revealed,
  onPage,
  onReveal,
  onClose,
}: {
  hint: Hint;
  /** いま開いているページ（0はじまり） */
  page: number;
  /** 答えを表示済みか */
  revealed: boolean;
  onPage: (page: number) => void;
  onReveal: () => void;
  onClose: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const last = hint.steps.length - 1;
  const index = Math.min(page, last);

  const go = (next: number) => {
    setConfirming(false);
    onPage(next);
  };

  let answer: ReactNode = null;
  if (hint.answer !== undefined && index === last) {
    if (revealed) {
      answer = (
        <p className="eg-hint-answer">
          <b>答え</b>
          {hint.answer}
        </p>
      );
    } else if (confirming) {
      answer = (
        <div className="eg-hint-confirm">
          <p className="eg-note">
            答えそのものが表示されます。本当に見ますか？
          </p>
          <div className="eg-hint-nav">
            <button
              type="button"
              className="eg-btn"
              onClick={() => {
                setConfirming(false);
              }}
            >
              やめておく
            </button>
            <button
              type="button"
              className="eg-btn eg-btn-danger"
              onClick={onReveal}
            >
              答えを見る
            </button>
          </div>
        </div>
      );
    } else {
      answer = (
        <button
          type="button"
          className="eg-hint-giveup"
          onClick={() => {
            setConfirming(true);
          }}
        >
          どうしてもわからないときは……答えを見る
        </button>
      );
    }
  }

  return (
    <Sheet title="ヒント" onClose={onClose}>
      <div className="eg-sheet-body">
        <p className="eg-hint-count">
          ヒント {index + 1} / {last + 1}
        </p>
        <p className="eg-hint-text">{hint.steps[index]}</p>
        {last > 0 && (
          <div className="eg-hint-nav">
            <button
              type="button"
              className="eg-btn"
              disabled={index === 0}
              onClick={() => {
                go(index - 1);
              }}
            >
              ‹ 前のヒント
            </button>
            <button
              type="button"
              className="eg-btn"
              disabled={index === last}
              onClick={() => {
                go(index + 1);
              }}
            >
              次のヒント ›
            </button>
          </div>
        )}
        {answer}
        <button
          type="button"
          className="eg-btn eg-btn-primary eg-btn-wide"
          onClick={onClose}
        >
          ゲームに戻る
        </button>
      </div>
    </Sheet>
  );
}

// ===== エンディング一覧 =====

export function EndingList({
  seen,
  onClose,
}: {
  seen: Ending[];
  onClose: () => void;
}) {
  return (
    <Sheet title="エンディング一覧" onClose={onClose}>
      <div className="eg-sheet-body">
        <p className="eg-note">
          {seen.length} / {ENDING_ORDER.length} 種類のエンディングを見ました。
        </p>
        <ul className="eg-ending-list">
          {ENDING_ORDER.map((ending) => {
            const data = ENDINGS[ending];
            if (!seen.includes(ending)) {
              return (
                <li key={ending} className="is-locked">
                  ？？？
                </li>
              );
            }
            return (
              <li key={ending} className={`is-${data.tone}`}>
                <details>
                  <summary>
                    <b>{data.label}</b>
                    <span>{data.subtitle}</span>
                  </summary>
                  <p>
                    {data.lines.map((line, i) => (
                      <span key={i}>{line === "" ? "\u00a0" : line}</span>
                    ))}
                  </p>
                </details>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          className="eg-btn eg-btn-primary eg-btn-wide"
          onClick={onClose}
        >
          もどる
        </button>
      </div>
    </Sheet>
  );
}
