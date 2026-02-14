import { useState } from "react";
import { useGame } from "../GameContext";
import type { ItemType } from "../types";
import ItemPopup from "./ItemPopup";

// アイテムのアイコンと色
const itemConfig: Record<
  ItemType,
  { icon: string; color: string; bgColor: string }
> = {
  message: { icon: "✉️", color: "text-gray-300", bgColor: "bg-gray-700" },
  pill_purple: {
    icon: "💜",
    color: "text-purple-400",
    bgColor: "bg-purple-900/50",
  },
  pill_white: { icon: "⚪", color: "text-gray-200", bgColor: "bg-gray-600" },
  pill_red: { icon: "❤️", color: "text-red-400", bgColor: "bg-red-900/50" },
  pill_yellow: {
    icon: "⭐",
    color: "text-yellow-400",
    bgColor: "bg-yellow-900/50",
  },
  pill_blue: { icon: "☁️", color: "text-blue-400", bgColor: "bg-blue-900/50" },
  cooking_tools: {
    icon: "🍳",
    color: "text-orange-400",
    bgColor: "bg-orange-900/50",
  },
  locked_box: {
    icon: "📦",
    color: "text-amber-400",
    bgColor: "bg-amber-900/50",
  },
  key: { icon: "🔑", color: "text-yellow-400", bgColor: "bg-yellow-900/50" },
  bomb: { icon: "💣", color: "text-red-400", bgColor: "bg-red-900/50" },
};

export default function Inventory() {
  const { state, selectItem } = useGame();
  const [isExpanded, setIsExpanded] = useState(true);
  const [inspectingItem, setInspectingItem] = useState<ItemType | null>(null);

  // 取得済みで未使用のアイテムを取得（locked_boxは開封済みでも表示）
  const availableItems = Object.values(state.items).filter(
    (item) => item.obtained && (!item.used || item.id === "locked_box"),
  );

  const handleItemClick = (itemId: ItemType) => {
    // 既に選択中のアイテムをタップ → 選択解除
    if (state.selectedItem === itemId) {
      selectItem(null);
      return;
    }
    // ポップアップを開く
    setInspectingItem(itemId);
  };

  const handlePopupClose = () => {
    setInspectingItem(null);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-40">
        {/* ヘッダー */}
        <button
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
          className="w-full px-4 py-2 flex items-center justify-between text-gray-300 hover:bg-gray-700/50 transition-colors"
        >
          <span className="font-bold flex items-center gap-2">
            <span>🎒</span>
            <span>アイテム</span>
            <span className="text-sm text-gray-500">
              ({availableItems.length})
            </span>
          </span>
          <svg
            className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>

        {/* アイテムリスト */}
        {isExpanded && (
          <div className="px-4 py-3 flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {availableItems.length === 0 ? (
              <p className="text-gray-500 text-sm">
                アイテムはまだありません。部屋を探索してみましょう。
              </p>
            ) : (
              availableItems.map((item) => {
                const config = itemConfig[item.id];
                const isSelected = state.selectedItem === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleItemClick(item.id);
                    }}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg transition-all
                      ${config.bgColor} ${config.color}
                      ${
                        isSelected
                          ? "ring-2 ring-white scale-105"
                          : "hover:scale-105"
                      }
                    `}
                  >
                    <span className="text-xl">{config.icon}</span>
                    <span className="text-sm font-medium">{item.name}</span>
                  </button>
                );
              })
            )}
          </div>
        )}

        {/* 選択中のアイテム表示 */}
        {state.selectedItem && (
          <div className="px-4 py-2 bg-gray-700 border-t border-gray-600 flex items-center justify-between">
            <span className="text-yellow-400 text-sm">
              <span className="text-xl mr-2">
                {itemConfig[state.selectedItem].icon}
              </span>
              {state.items[state.selectedItem].name}を選択中
            </span>
            <button
              onClick={() => {
                selectItem(null);
              }}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              解除
            </button>
          </div>
        )}
      </div>

      {/* アイテムポップアップ */}
      {inspectingItem && (
        <ItemPopup itemId={inspectingItem} onClose={handlePopupClose} />
      )}
    </>
  );
}
