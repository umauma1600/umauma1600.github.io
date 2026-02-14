import { useState } from "react";
import { useGame } from "../GameContext";
import type { ItemType } from "../types";
import { pillInfo } from "../types";

// アイテムの画像パス（存在するもののみ）
const itemImages: Partial<Record<ItemType, { src: string; alt: string }>> = {
  message: { src: "/assets/escape/message.png", alt: "メッセージ" },
  pill_purple: {
    src: "/assets/escape/pill-icon-triangle.png",
    alt: "紫の錠剤",
  },
  pill_white: {
    src: "/assets/escape/pill-icon-circle.png",
    alt: "白い錠剤",
  },
  pill_red: { src: "/assets/escape/pill-icon-heart.png", alt: "赤い錠剤" },
  pill_yellow: {
    src: "/assets/escape/pill-icon-star.png",
    alt: "黄色い錠剤",
  },
  pill_blue: { src: "/assets/escape/pill-icon-cloud.png", alt: "青い錠剤" },
};

// 画像がないアイテム用の絵文字フォールバック
const itemFallbackIcons: Record<ItemType, string> = {
  message: "✉️",
  pill_purple: "💜",
  pill_white: "⚪",
  pill_red: "❤️",
  pill_yellow: "⭐",
  pill_blue: "☁️",
  cooking_tools: "🍳",
  locked_box: "📦",
  key: "🔑",
  bomb: "💣",
};

// アイテムの説明文
const itemDescriptions: Record<ItemType, string> = {
  message: "やまーたからの手紙。何が書いてあるのだろう…",
  pill_purple: "紫色の錠剤。飲むと何か起こりそうだ。",
  pill_white: "白い錠剤。飲むと何か起こりそうだ。",
  pill_red: "赤い錠剤。飲むと何か起こりそうだ。",
  pill_yellow: "黄色い錠剤。飲むと何か起こりそうだ。",
  pill_blue: "青い錠剤。飲むと何か起こりそうだ。",
  cooking_tools: "キッチンにあった調理器具。切ったり水を運んだりできそうだ。",
  locked_box: "3桁の番号錠がついた箱。中に何か入っているようだ。",
  key: "どこかの扉を開けられそうな鍵。",
  bomb: "時限爆弾！早く処理しないと危険だ。",
};

// 箱の中身の画像データ
const boxContentPages = [
  {
    label: "一覧表",
    src: "/assets/escape/pill-chart.png",
    alt: "錠剤の効果一覧",
  },
  {
    label: "ドクガアール",
    src: "/assets/escape/pill-dokugaaru.png",
    alt: "ドクガアール",
  },
  {
    label: "アツクナーイ",
    src: "/assets/escape/pill-atsukunai.png",
    alt: "アツクナーイ",
  },
  {
    label: "タカクトーブ",
    src: "/assets/escape/pill-takakutobu.png",
    alt: "タカクトーブ",
  },
  {
    label: "オボレナーイ",
    src: "/assets/escape/pill-oborenai.png",
    alt: "オボレナーイ",
  },
  {
    label: "チカラモーチ",
    src: "/assets/escape/pill-chikaramochi.png",
    alt: "チカラモーチ",
  },
];

interface ItemPopupProps {
  itemId: ItemType;
  onClose: () => void;
}

export default function ItemPopup({ itemId, onClose }: ItemPopupProps) {
  const gameContext = useGame();
  const { state, selectItem, openBox, showDialog } = gameContext;
  const item = state.items[itemId];
  const image = itemImages[itemId];
  const fallbackIcon = itemFallbackIcons[itemId];
  const description = itemDescriptions[itemId];

  // 3桁錠の状態
  const [boxCode, setBoxCode] = useState(["0", "0", "0"]);
  const [showBoxDial, setShowBoxDial] = useState(false);
  const [showBoxContent, setShowBoxContent] = useState(false);
  const [boxContentPage, setBoxContentPage] = useState(0);

  // 錠剤かどうか
  const isPill = itemId.startsWith("pill_");
  const pillData = isPill ? pillInfo[itemId] : null;

  // 「使う」ボタン（アイテムを選択して使用場所を選ぶ）
  const handleSelectForUse = () => {
    selectItem(itemId);
    onClose();
  };

  // 錠剤を飲む
  const handleDrinkPill = () => {
    gameContext.useItem(itemId);
    onClose();
    showDialog(
      `${item.name}（${pillData?.name}）を飲んだ！\n効果：${pillData?.effect}（1分間）`,
    );
  };

  // 3桁錠のダイヤル操作
  const handleCodeChange = (index: number, direction: number) => {
    setBoxCode((prev) => {
      const newCode = [...prev];
      let num = parseInt(newCode[index]) + direction;
      if (num < 0) num = 9;
      if (num > 9) num = 0;
      newCode[index] = num.toString();
      return newCode;
    });
  };

  // 箱を開ける
  const handleOpenBox = () => {
    const code = boxCode.join("");
    if (openBox(code)) {
      setShowBoxDial(false);
      setShowBoxContent(true);
    } else {
      showDialog("開かない...。番号が違うようだ。");
    }
  };

  // メッセージの表示
  const renderMessageContent = () => (
    <div className="mt-4">
      <img
        src="/assets/escape/message.png"
        alt="やまーたからのメッセージ"
        className="w-full rounded-lg border border-gray-600"
      />
    </div>
  );

  // 錠剤の情報表示
  const renderPillInfo = () => {
    if (!pillData) return null;
    const isUsed = item.used;
    const hasActiveEffect = state.activePillEffects.some(
      (e) =>
        e.type === itemId && e.expiresAt !== null && e.expiresAt > Date.now(),
    );

    return (
      <div className="mt-4 space-y-3">
        {/* 錠剤名 */}
        <div className="bg-gray-700/50 rounded-lg p-3">
          <p className="text-gray-400 text-xs mb-1">錠剤名</p>
          <p className="text-white font-bold">{pillData.name}</p>
        </div>

        {/* 効果（箱が開いてたら表示） */}
        {state.flags.boxOpened && (
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">効果</p>
            <p className="text-white">{pillData.effect}（1分間）</p>
          </div>
        )}

        {/* ステータス */}
        {hasActiveEffect && (
          <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-3">
            <p className="text-green-400 text-sm font-bold">効果発動中！</p>
          </div>
        )}

        {/* 飲むボタン */}
        {!isUsed && !hasActiveEffect && (
          <button
            onClick={handleDrinkPill}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-lg font-bold transition-all active:scale-95"
          >
            💊 飲む
          </button>
        )}

        {isUsed && !hasActiveEffect && (
          <div className="bg-gray-700/50 rounded-lg p-3 text-center">
            <p className="text-gray-400 text-sm">使用済み</p>
          </div>
        )}
      </div>
    );
  };

  // 3桁錠の箱の表示
  const renderLockedBox = () => {
    const isOpened = state.flags.boxOpened;

    return (
      <div className="mt-4 space-y-3">
        {/* 箱を開ける（ダイヤル表示） */}
        {!isOpened && !showBoxDial && (
          <button
            onClick={() => {
              setShowBoxDial(true);
            }}
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-lg font-bold transition-all active:scale-95"
          >
            🔢 番号を入力して開ける
          </button>
        )}

        {/* ダイヤルUI */}
        {!isOpened && showBoxDial && (
          <div className="bg-gray-700/50 rounded-lg p-4">
            <p className="text-gray-300 text-sm mb-3 text-center">
              3桁の番号を入力してください
            </p>
            <div className="flex justify-center gap-4 mb-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <button
                    onClick={() => {
                      handleCodeChange(i, 1);
                    }}
                    className="w-14 h-10 bg-gray-600 hover:bg-gray-500 active:bg-gray-400 rounded-t-lg text-white text-lg font-bold transition-colors"
                  >
                    ▲
                  </button>
                  <div className="w-14 h-16 bg-gray-800 border-x-2 border-amber-500/50 flex items-center justify-center text-white text-3xl font-mono">
                    {boxCode[i]}
                  </div>
                  <button
                    onClick={() => {
                      handleCodeChange(i, -1);
                    }}
                    className="w-14 h-10 bg-gray-600 hover:bg-gray-500 active:bg-gray-400 rounded-b-lg text-white text-lg font-bold transition-colors"
                  >
                    ▼
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleOpenBox}
              className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold transition-colors active:scale-95"
            >
              開ける
            </button>
          </div>
        )}

        {/* 開封済み */}
        {isOpened && (
          <button
            onClick={() => {
              setShowBoxContent(true);
            }}
            className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-lg font-bold transition-all active:scale-95"
          >
            📄 中身を確認する
          </button>
        )}
      </div>
    );
  };

  // 使う系アイテムの表示（key, cooking_tools, bomb）
  const renderUsableItem = () => {
    if (item.used) {
      return (
        <div className="mt-4 bg-gray-700/50 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-sm">使用済み</p>
        </div>
      );
    }
    return (
      <div className="mt-4">
        <button
          onClick={handleSelectForUse}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-lg font-bold transition-all active:scale-95"
        >
          👆 選択して使う
        </button>
        <p className="text-gray-500 text-xs text-center mt-2">
          使用したい場所をタップしてください
        </p>
      </div>
    );
  };

  // アイテム種類ごとのコンテンツ
  const renderItemContent = () => {
    if (itemId === "message") return renderMessageContent();
    if (isPill) return renderPillInfo();
    if (itemId === "locked_box") return renderLockedBox();
    return renderUsableItem();
  };

  // 箱の中身モーダル（別レイヤー）
  if (showBoxContent) {
    return (
      <div
        className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowBoxContent(false);
            setBoxContentPage(0);
          }
        }}
      >
        <div className="bg-amber-100 rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
          {/* ヘッダー */}
          <div className="bg-amber-800 text-white px-4 py-3 flex items-center justify-between">
            <h2 className="text-lg font-bold">箱の中身</h2>
            <button
              onClick={() => {
                setShowBoxContent(false);
                setBoxContentPage(0);
              }}
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* コンテンツ */}
          <div className="p-4 flex justify-center bg-amber-50">
            <img
              src={boxContentPages[boxContentPage].src}
              alt={boxContentPages[boxContentPage].alt}
              className="max-w-full max-h-[50vh] object-contain"
            />
          </div>

          {/* ページナビ */}
          <div className="bg-amber-200 px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => {
                setBoxContentPage((p) => Math.max(0, p - 1));
              }}
              disabled={boxContentPage === 0}
              className="px-4 py-2 bg-amber-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              ◀ 前へ
            </button>
            <span className="text-amber-800 text-sm">
              {boxContentPage + 1} / {boxContentPages.length}
            </span>
            <button
              onClick={() => {
                setBoxContentPage((p) =>
                  Math.min(boxContentPages.length - 1, p + 1),
                );
              }}
              disabled={boxContentPage === boxContentPages.length - 1}
              className="px-4 py-2 bg-amber-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              次へ ▶
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full border border-gray-600 overflow-hidden animate-[popIn_0.2s_ease-out]">
        {/* ヘッダー */}
        <div className="relative bg-gray-700/50 px-5 pt-5 pb-4 flex flex-col items-center">
          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors p-1"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* アイコン */}
          <div className="w-24 h-24 rounded-2xl bg-gray-600/50 border-2 border-gray-500/50 flex items-center justify-center mb-3 overflow-hidden">
            {image ? (
              <img
                src={image.src}
                alt={image.alt}
                className="w-20 h-20 object-contain"
              />
            ) : (
              <span className="text-5xl">{fallbackIcon}</span>
            )}
          </div>

          {/* 名前 */}
          <h2 className="text-white text-xl font-bold">{item.name}</h2>
        </div>

        {/* コンテンツ */}
        <div className="px-5 pb-5">
          {/* 説明文 */}
          <p className="text-gray-400 text-sm mt-3 leading-relaxed">
            {description}
          </p>

          {/* アイテム種類ごとのコンテンツ */}
          {renderItemContent()}
        </div>
      </div>
    </div>
  );
}
