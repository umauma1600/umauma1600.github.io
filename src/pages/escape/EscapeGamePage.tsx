import { useCallback, useEffect, useReducer, useState } from "react";
import type { Dispatch } from "react";
import { Link } from "react-router-dom";
import {
  EnvelopeArt,
  ItemArt,
  PillMark,
  SceneArt,
  type SceneTarget,
} from "./art";
import {
  DOCS,
  ENDINGS,
  LETTER_DOC,
  LETTER_IMAGE,
  OPENING_LINES,
  VIEW_NAMES,
  formatClock,
  type Doc,
} from "./data";
import {
  AIR_MS,
  BOMB_MS,
  ENDING_ORDER,
  ITEM_NAMES,
  PILLS,
  clearSave,
  getHint,
  initialState,
  isActive,
  isWall,
  loadEndings,
  loadGame,
  recordEnding,
  reducer,
  saveGame,
  turn,
  type Action,
  type DocId,
  type GameState,
  type ItemId,
  type View,
} from "./game";
import {
  DialLock,
  DocList,
  DocViewer,
  EndingList,
  HintSheet,
  ItemSheet,
  ZoomImage,
} from "./overlays";
import "./escape.css";

type Overlay =
  | { type: "doc"; doc: Doc }
  | { type: "docs" }
  | { type: "dial" }
  | { type: "item"; item: ItemId }
  | { type: "hint" };

interface ScreenProps {
  state: GameState;
  dispatch: Dispatch<Action>;
}

// ===== タイトル =====

function TitleScreen({ dispatch }: ScreenProps) {
  const [saved] = useState(loadGame);
  const [seen] = useState(loadEndings);
  const [listOpen, setListOpen] = useState(false);

  return (
    <div className="eg-page eg-title">
      <Link to="/nazo" className="eg-back">
        ← もどる
      </Link>
      <div className="eg-title-main">
        <p className="eg-kicker">脱出ゲーム</p>
        <h1>
          やまーたからの
          <br />
          <em>挑戦状</em>
        </h1>
        <p className="eg-lead">
          目を覚ますと、見知らぬ部屋。
          <br />
          残された時間は、20分。
        </p>
        <div className="eg-actions">
          {saved && (
            <button
              type="button"
              className="eg-btn eg-btn-primary eg-btn-wide"
              onClick={() => {
                dispatch({ type: "load", state: saved });
              }}
            >
              つづきから（{Math.floor(saved.elapsed / 60000)}分経過）
            </button>
          )}
          <button
            type="button"
            className={`eg-btn eg-btn-wide${saved ? "" : " eg-btn-primary"}`}
            onClick={() => {
              dispatch({ type: "start" });
            }}
          >
            はじめから
          </button>
          {seen.length > 0 && (
            <button
              type="button"
              className="eg-btn eg-btn-wide"
              onClick={() => {
                setListOpen(true);
              }}
            >
              エンディング一覧（{seen.length} / {ENDING_ORDER.length}）
            </button>
          )}
        </div>
      </div>
      {listOpen && (
        <EndingList
          seen={seen}
          onClose={() => {
            setListOpen(false);
          }}
        />
      )}
      <ul className="eg-cautions">
        <li>紙とペンの用意をおすすめします。</li>
        <li>
          この作品はフィクションです。登場する物や事柄は、現実のものと異なる場合があります。
        </li>
        <li>
          ネタバレは禁止ですが、プレイ後の感想は大歓迎です。<b>#やま謎</b>{" "}
          でお待ちしています。
        </li>
        <li>制作：やまーた ／ 制限時間：20分</li>
      </ul>
    </div>
  );
}

// ===== オープニング =====

function OpeningScreen({ dispatch }: ScreenProps) {
  const [opened, setOpened] = useState(false);

  return (
    <div className="eg-page eg-opening">
      {opened ? (
        <div className="eg-fade">
          <ZoomImage
            className="eg-letter"
            src={LETTER_IMAGE}
            alt={LETTER_DOC.pages[0].alt}
          />
          <p className="eg-note">手紙をタップすると拡大できます。</p>
          <button
            type="button"
            className="eg-btn eg-btn-primary eg-btn-wide"
            onClick={() => {
              dispatch({ type: "readLetter" });
            }}
          >
            探索を開始する
          </button>
          <p className="eg-note">
            ボタンを押すと、20分のタイマーが動き出します。
          </p>
        </div>
      ) : (
        <div className="eg-fade">
          <p className="eg-story">
            {OPENING_LINES.map((line, i) => (
              <span key={i}>{line === "" ? " " : line}</span>
            ))}
          </p>
          <button
            type="button"
            className="eg-envelope"
            onClick={() => {
              setOpened(true);
            }}
          >
            <EnvelopeArt />
            <span>封筒を開ける</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ===== 探索 =====

function TimerBadge({ state }: { state: GameState }) {
  const { elapsed, flags } = state;
  if (!flags.bombDisposed) {
    const left = BOMB_MS - elapsed;
    const level =
      left < 60_000 ? " is-critical" : left < 300_000 ? " is-low" : "";
    return (
      <span className={`eg-timer${level}`} aria-label="爆発までの残り時間">
        {formatClock(left)}
      </span>
    );
  }
  if (elapsed < BOMB_MS) {
    return <span className="eg-timer is-safe">爆弾処理済</span>;
  }
  return (
    <span className="eg-timer is-critical" aria-label="空気が尽きるまでの時間">
      空気 {formatClock(AIR_MS - elapsed)}
    </span>
  );
}

function NavButtons({ state, dispatch }: ScreenProps) {
  const { view, wall } = state;
  const look = (next: View) => {
    dispatch({ type: "look", view: next });
  };

  if (!isWall(view)) {
    const back: View = view === "basement" ? "center" : wall;
    return (
      <button
        type="button"
        className="eg-nav eg-nav-back"
        onClick={() => {
          look(back);
        }}
      >
        ← {view === "basement" ? "上へ戻る" : "部屋を見回す"}
      </button>
    );
  }
  return (
    <>
      <button
        type="button"
        className="eg-nav eg-nav-left"
        aria-label="左を向く"
        onClick={() => {
          look(turn(view, -1));
        }}
      >
        ‹
      </button>
      <button
        type="button"
        className="eg-nav eg-nav-right"
        aria-label="右を向く"
        onClick={() => {
          look(turn(view, 1));
        }}
      >
        ›
      </button>
      <button
        type="button"
        className="eg-nav eg-nav-up"
        onClick={() => {
          look("ceiling");
        }}
      >
        ▲ 天井
      </button>
      <button
        type="button"
        className="eg-nav eg-nav-down"
        onClick={() => {
          look("center");
        }}
      >
        ▼ 部屋の中央
      </button>
    </>
  );
}

function DialogBox({ state, dispatch }: ScreenProps) {
  const { dialog } = state;

  useEffect(() => {
    if (!dialog || dialog.choices) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape" || e.key === " ") {
        e.preventDefault();
        dispatch({ type: "closeDialog" });
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [dialog, dispatch]);

  if (!dialog) return null;
  return (
    <div
      className="eg-dialog-layer"
      onClick={() => {
        dispatch({ type: "closeDialog" });
      }}
    >
      <div className="eg-dialog" role="status">
        {dialog.got && (
          <div className="eg-dialog-got">
            <ItemArt item={dialog.got} />
          </div>
        )}
        <div className="eg-dialog-main">
          <p>{dialog.text}</p>
          {dialog.choices ? (
            <div className="eg-choices">
              {dialog.choices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  className={`eg-btn${choice.danger ? " eg-btn-danger" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: "choose", id: choice.id });
                  }}
                >
                  {choice.label}
                </button>
              ))}
            </div>
          ) : (
            <span className="eg-dialog-next" aria-hidden="true">
              ▼
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function PlayScreen({ state, dispatch }: ScreenProps) {
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const [hintPages, setHintPages] = useState<Record<string, number>>({});
  const [hintAnswers, setHintAnswers] = useState<Record<string, boolean>>({});

  // 時計を進める。画面を閉じている間や、裏に回っている間は止まる
  useEffect(() => {
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const delta = Math.min(now - last, 1500);
      last = now;
      if (!document.hidden) dispatch({ type: "tick", delta });
    }, 500);
    return () => {
      window.clearInterval(timer);
    };
  }, [dispatch]);

  const closeOverlay = useCallback(() => {
    setOverlay(null);
  }, []);

  const openDoc = (doc: DocId) => {
    dispatch({ type: "readDoc", doc });
    setOverlay({ type: "doc", doc: DOCS[doc] });
  };

  const handleTap = (target: SceneTarget) => {
    switch (target) {
      case "book-plant":
        openDoc("plant");
        break;
      case "book-manual":
        openDoc("manual");
        break;
      case "book-mystery":
        openDoc("mystery");
        break;
      case "box":
        if (state.flags.boxOpen) openDoc("pills");
        else setOverlay({ type: "dial" });
        break;
      default:
        dispatch({ type: "tap", target });
    }
  };

  const handleItem = (item: ItemId) => {
    if (state.selected === item) setOverlay({ type: "item", item });
    else dispatch({ type: "select", item });
  };

  const hint = getHint(state);
  // 一度でもエンディングを見た人は、タイマーから時間切れまで待てる（エンディング集め用）
  const [canWait] = useState(() => loadEndings().length > 0);
  const active = PILLS.filter((pill) => isActive(state, pill));

  return (
    <div className="eg-play">
      <header className="eg-header">
        <Link to="/nazo" className="eg-back">
          ← 中断
        </Link>
        <h1>{VIEW_NAMES[state.view]}</h1>
        {canWait ? (
          <button
            type="button"
            className="eg-timer-wrap"
            title="時間が過ぎるのを待つ"
            onClick={() => {
              dispatch({ type: "askWait" });
            }}
          >
            <TimerBadge state={state} />
            <span className="eg-timer-skip" aria-hidden="true">
              ▸▸
            </span>
          </button>
        ) : (
          <span className="eg-timer-wrap">
            <TimerBadge state={state} />
          </span>
        )}
      </header>

      <div className="eg-stage">
        <div className="eg-scene">
          <div key={state.view} className="eg-scene-art">
            <SceneArt state={state} onTap={handleTap} />
          </div>
          <div className="eg-vignette" />
          <NavButtons state={state} dispatch={dispatch} />
          {active.length > 0 && (
            <ul className="eg-effects" aria-label="効いている錠剤">
              {active.map((pill) => (
                <li key={pill}>
                  <PillMark pill={pill} />
                  {Math.ceil(
                    ((state.effects[pill] ?? 0) - state.elapsed) / 1000,
                  )}
                  秒
                </li>
              ))}
            </ul>
          )}
          <DialogBox state={state} dispatch={dispatch} />
        </div>
      </div>

      <footer className="eg-footer">
        <p className="eg-selected" aria-live="polite">
          {state.selected
            ? `「${ITEM_NAMES[state.selected]}」を選択中 ― 場所をタップで使う／もう一度タップで詳しく見る`
            : "持ち物をタップして選ぶ"}
        </p>
        <div className="eg-bar">
          <ul className="eg-items">
            {state.items.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  className={`eg-slot${state.selected === item ? " is-selected" : ""}`}
                  aria-label={ITEM_NAMES[item]}
                  aria-pressed={state.selected === item}
                  onClick={() => {
                    handleItem(item);
                  }}
                >
                  <ItemArt item={item} water={state.potWater} />
                </button>
              </li>
            ))}
          </ul>
          <div className="eg-tools">
            <button
              type="button"
              className="eg-tool"
              onClick={() => {
                setOverlay({ type: "docs" });
              }}
            >
              資料
            </button>
            <button
              type="button"
              className="eg-tool"
              onClick={() => {
                setOverlay({ type: "hint" });
              }}
            >
              ヒント
            </button>
          </div>
        </div>
      </footer>

      {overlay?.type === "doc" && (
        <DocViewer doc={overlay.doc} onClose={closeOverlay} />
      )}
      {overlay?.type === "docs" && (
        <DocList docs={state.docs} onOpen={openDoc} onClose={closeOverlay} />
      )}
      {overlay?.type === "dial" && (
        <DialLock
          onOpen={() => {
            dispatch({ type: "openBox" });
            setOverlay({ type: "doc", doc: DOCS.pills });
          }}
          onClose={closeOverlay}
        />
      )}
      {overlay?.type === "item" && (
        <ItemSheet
          item={overlay.item}
          state={state}
          onDrink={(pill) => {
            dispatch({ type: "drink", pill });
            setOverlay(null);
          }}
          onRead={() => {
            setOverlay({ type: "doc", doc: LETTER_DOC });
          }}
          onClose={closeOverlay}
        />
      )}
      {overlay?.type === "hint" && (
        <HintSheet
          hint={hint}
          page={hintPages[hint.topic] ?? 0}
          revealed={hintAnswers[hint.topic] ?? false}
          onPage={(page) => {
            setHintPages({ ...hintPages, [hint.topic]: page });
          }}
          onReveal={() => {
            setHintAnswers({ ...hintAnswers, [hint.topic]: true });
          }}
          onClose={closeOverlay}
        />
      )}
    </div>
  );
}

// ===== エンディング =====

function EndingScreen({ state, dispatch }: ScreenProps) {
  const ending = state.ending ?? "explosion";
  const data = ENDINGS[ending];
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `「やまーたからの挑戦状」を${data.share}！ #やま謎`,
  )}`;

  return (
    <div className={`eg-page eg-ending eg-ending-${data.tone}`}>
      <div className="eg-fade">
        <p className="eg-ending-label">{data.label}</p>
        <p className="eg-ending-sub">{data.subtitle}</p>
        {ending === "true" && (
          <img
            className="eg-yamata"
            src="/assets/images/yama-tahappy.webp"
            alt="よろこぶやまーた"
          />
        )}
        <p className="eg-story eg-story-left">
          {data.lines.map((line, i) => (
            <span key={i}>{line === "" ? " " : line}</span>
          ))}
        </p>
        <div className="eg-actions">
          {state.checkpoint && (
            <button
              type="button"
              className="eg-btn eg-btn-primary eg-btn-wide"
              onClick={() => {
                dispatch({ type: "retry" });
              }}
            >
              少し前からやり直す
            </button>
          )}
          <button
            type="button"
            className={`eg-btn eg-btn-wide${state.checkpoint ? "" : " eg-btn-primary"}`}
            onClick={() => {
              dispatch({ type: "reset" });
            }}
          >
            {data.tone === "bad" ? "はじめからやり直す" : "タイトルへ戻る"}
          </button>
          <a
            className="eg-btn eg-btn-wide"
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Xで感想を共有する（#やま謎）
          </a>
          <Link to="/nazo" className="eg-back">
            ← 謎解き一覧へ
          </Link>
        </div>
      </div>
    </div>
  );
}

// ===== ページ =====

export default function EscapeGamePage() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 進行状況を保存する。途中でページを閉じても続きから遊べる
  useEffect(() => {
    if (state.phase === "playing") saveGame(state);
    else if (state.phase === "ending") {
      if (state.ending) recordEnding(state.ending);
      if (!state.checkpoint) clearSave();
    }
  }, [state]);

  const props = { state, dispatch };
  return (
    <div className="eg-root">
      {state.phase === "title" && <TitleScreen {...props} />}
      {state.phase === "opening" && <OpeningScreen {...props} />}
      {state.phase === "playing" && <PlayScreen {...props} />}
      {state.phase === "ending" && <EndingScreen {...props} />}
    </div>
  );
}
