import { useGame } from "../GameContext";
import Timer from "../components/Timer";
import Inventory from "../components/Inventory";
import RoomView from "../areas/RoomView";
import TableArea from "../areas/TableArea";
import KitchenArea from "../areas/KitchenArea";
import FireplaceArea from "../areas/FireplaceArea";
import TankArea from "../areas/TankArea";
import StatueArea from "../areas/StatueArea";
import ShelfArea from "../areas/ShelfArea";
import DoorArea from "../areas/DoorArea";
import CeilingArea from "../areas/CeilingArea";
import LowerFloorArea from "../areas/LowerFloorArea";
import UpperFloorArea from "../areas/UpperFloorArea";
import BookViewer from "../components/BookViewer";
import DialogBox from "../components/DialogBox";

export default function GameScreen() {
  const { state, changeArea } = useGame();

  // 現在のエリアに応じたコンポーネントを表示
  const renderArea = () => {
    switch (state.currentArea) {
      case "room":
        return <RoomView />;
      case "table":
        return <TableArea />;
      case "kitchen":
        return <KitchenArea />;
      case "fireplace":
        return <FireplaceArea />;
      case "tank":
        return <TankArea />;
      case "statue":
        return <StatueArea />;
      case "shelf":
        return <ShelfArea />;
      case "door":
        return <DoorArea />;
      case "ceiling":
        return <CeilingArea />;
      case "lower":
        return <LowerFloorArea />;
      case "upper":
        return <UpperFloorArea />;
      default:
        return <RoomView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* ヘッダー（タイマー） */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {state.currentArea !== "room" && (
            <button
              onClick={() => {
                changeArea("room");
              }}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="hidden sm:inline">部屋に戻る</span>
            </button>
          )}
          <h1 className="text-white font-bold text-lg">
            {getAreaName(state.currentArea)}
          </h1>
        </div>
        <Timer />
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-4">{renderArea()}</div>
      </main>

      {/* インベントリ */}
      <Inventory />

      {/* 本のビューワー */}
      {state.showingBook && <BookViewer />}

      {/* ダイアログ */}
      {state.dialogMessage && <DialogBox />}
    </div>
  );
}

// エリア名を取得
function getAreaName(area: string): string {
  const names: Record<string, string> = {
    room: "部屋",
    table: "テーブル",
    kitchen: "キッチン",
    fireplace: "暖炉",
    tank: "水槽",
    statue: "像",
    shelf: "棚",
    door: "ドア",
    ceiling: "天井",
    lower: "下の階",
    upper: "上の階",
  };
  return names[area] || "部屋";
}
