import { useGame } from "../GameContext";
import type { AreaType } from "../types";

export default function RoomView() {
  const { state, changeArea } = useGame();

  const areas: {
    id: AreaType;
    name: string;
    position: string;
    size: string;
  }[] = [
    {
      id: "tank",
      name: "水槽",
      position: "top-4 left-4",
      size: "w-24 h-16",
    },
    {
      id: "kitchen",
      name: "キッチン",
      position: "top-4 right-4",
      size: "w-32 h-16",
    },
    {
      id: "door",
      name: "ドア",
      position: "left-2 top-1/2 -translate-y-1/2",
      size: "w-10 h-20",
    },
    {
      id: "fireplace",
      name: "暖炉",
      position: "right-2 top-1/2 -translate-y-1/2",
      size: "w-14 h-20",
    },
    {
      id: "table",
      name: "テーブル",
      position: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      size: "w-28 h-20",
    },
    {
      id: "statue",
      name: "像",
      position: "bottom-4 left-4",
      size: "w-14 h-14",
    },
    {
      id: "shelf",
      name: "棚",
      position: "bottom-4 left-24",
      size: "w-20 h-12",
    },
    {
      id: "ceiling",
      name: "天井",
      position: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
      size: "w-16 h-8",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 説明テキスト */}
      <div className="text-center">
        <p className="text-gray-400 text-sm">
          部屋を探索してください。各エリアをクリックすると詳しく調べられます。
        </p>
        {state.flags.lowerFloorAccessible && (
          <p className="text-green-400 text-sm mt-2">
            ✓ 下の階への扉が開いています
          </p>
        )}
        {state.flags.upperFloorAccessible && (
          <p className="text-yellow-400 text-sm mt-2">✓ 上の階に行けます</p>
        )}
      </div>

      {/* 間取り図 */}
      <div className="relative w-full max-w-md aspect-square bg-gray-700 rounded-lg border-4 border-gray-600 p-2">
        {/* 部屋の床 */}
        <div className="absolute inset-4 bg-gray-600 rounded" />

        {/* 各エリア */}
        {areas.map((area) => (
          <button
            key={area.id}
            onClick={() => {
              changeArea(area.id);
            }}
            className={`
              absolute ${area.position} ${area.size}
              bg-gray-500 hover:bg-gray-400
              rounded border-2 border-gray-400
              flex items-center justify-center
              text-white text-xs font-bold
              transition-all duration-200 hover:scale-105 hover:z-10
              shadow-lg hover:shadow-xl
            `}
          >
            <span className="text-center leading-tight">{area.name}</span>
          </button>
        ))}

        {/* 下の階への入り口（解放済みの場合） */}
        {state.flags.lowerFloorAccessible && (
          <button
            onClick={() => {
              changeArea("lower");
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-4 w-16 h-8 bg-amber-600 hover:bg-amber-500 rounded border-2 border-amber-400 flex items-center justify-center text-white text-xs font-bold transition-all hover:scale-105 animate-pulse"
          >
            ↓下の階
          </button>
        )}

        {/* 上の階への入り口（解放済みの場合） */}
        {state.flags.upperFloorAccessible && (
          <button
            onClick={() => {
              changeArea("upper");
            }}
            className="absolute top-8 left-1/2 -translate-x-1/2 w-16 h-8 bg-blue-600 hover:bg-blue-500 rounded border-2 border-blue-400 flex items-center justify-center text-white text-xs font-bold transition-all hover:scale-105 animate-pulse"
          >
            ↑上の階
          </button>
        )}
      </div>

      {/* 部屋の説明 */}
      <div className="text-gray-300 text-sm max-w-md space-y-2">
        <p>• どこかからかぐわしい香りがする</p>
        <p>• 部屋全体は暖かい</p>
        <p>• 空気が外に出ない密室のようだ</p>
      </div>
    </div>
  );
}
