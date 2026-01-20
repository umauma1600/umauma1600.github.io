import { useState } from "react";
import { useGame } from "../GameContext";
import type { AreaType } from "../types";

// 各エリアの説明テキスト
const areaDescriptions: Record<AreaType | "room", string> = {
  room: "気になる場所をタップして調べよう",
  tank: "壁際に置かれた水槽。魚が泳いでいる",
  kitchen: "キッチン。コンロとシンクがある",
  door: "重厚な木製のドア。鍵がかかっている",
  fireplace: "暖炉。炎が燃えていて暖かい",
  table: "部屋の中央にあるテーブル",
  statue: "石でできた像。誰かを象っているようだ",
  shelf: "本や小物が並んだ棚",
  ceiling: "天井のシャンデリア。キラキラ輝いている",
  lower: "下の階への階段",
  upper: "上の階への階段",
};

// 水槽のSVGアイコン
function TankIcon() {
  return (
    <svg viewBox="0 0 60 40" className="w-full h-full">
      {/* 水槽本体 */}
      <rect
        x="2"
        y="5"
        width="56"
        height="30"
        rx="2"
        fill="#87CEEB"
        stroke="#5F9EA0"
        strokeWidth="2"
      />
      {/* 水 */}
      <rect x="4" y="10" width="52" height="23" fill="#4169E1" opacity="0.6" />
      {/* 魚 */}
      <ellipse cx="20" cy="22" rx="6" ry="3" fill="#FFA500" />
      <polygon points="14,22 10,18 10,26" fill="#FFA500" />
      <ellipse cx="40" cy="18" rx="5" ry="2.5" fill="#FF6347" />
      <polygon points="45,18 49,15 49,21" fill="#FF6347" />
      {/* 水草 */}
      <path d="M15 33 Q17 25 15 20 Q13 25 15 33" fill="#228B22" opacity="0.8" />
      <path d="M45 33 Q47 27 45 22 Q43 27 45 33" fill="#228B22" opacity="0.8" />
    </svg>
  );
}

// キッチンのSVGアイコン
function KitchenIcon() {
  return (
    <svg viewBox="0 0 80 50" className="w-full h-full">
      {/* カウンター */}
      <rect x="2" y="30" width="76" height="18" fill="#8B4513" rx="2" />
      <rect x="4" y="32" width="72" height="14" fill="#A0522D" rx="1" />
      {/* コンロ */}
      <rect x="10" y="8" width="25" height="20" fill="#2F4F4F" rx="2" />
      <circle cx="17" cy="18" r="4" fill="#1a1a1a" stroke="#333" />
      <circle cx="28" cy="18" r="4" fill="#1a1a1a" stroke="#333" />
      {/* 鍋 */}
      <ellipse cx="17" cy="16" rx="5" ry="2" fill="#4a4a4a" />
      {/* シンク */}
      <rect x="45" y="8" width="30" height="20" fill="#C0C0C0" rx="2" />
      <rect x="50" y="12" width="20" height="12" fill="#A9A9A9" rx="1" />
      {/* 蛇口 */}
      <path
        d="M55 8 L55 5 L65 5 L65 12"
        stroke="#B8860B"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

// ドアのSVGアイコン
function DoorIcon() {
  return (
    <svg viewBox="0 0 40 70" className="w-full h-full">
      {/* ドア枠 */}
      <rect x="2" y="2" width="36" height="66" fill="#654321" rx="1" />
      {/* ドア本体 */}
      <rect x="5" y="5" width="30" height="60" fill="#8B4513" rx="1" />
      {/* パネル装飾 */}
      <rect
        x="8"
        y="10"
        width="24"
        height="20"
        fill="#A0522D"
        stroke="#654321"
        strokeWidth="1"
        rx="1"
      />
      <rect
        x="8"
        y="38"
        width="24"
        height="22"
        fill="#A0522D"
        stroke="#654321"
        strokeWidth="1"
        rx="1"
      />
      {/* ドアノブ */}
      <circle cx="28" cy="35" r="3" fill="#DAA520" />
      <ellipse cx="28" cy="35" rx="2" ry="1.5" fill="#FFD700" />
    </svg>
  );
}

// 暖炉のSVGアイコン
function FireplaceIcon() {
  return (
    <svg viewBox="0 0 60 70" className="w-full h-full">
      {/* 暖炉外枠 */}
      <rect x="2" y="10" width="56" height="58" fill="#8B0000" rx="2" />
      {/* 暖炉内側 */}
      <rect x="8" y="25" width="44" height="40" fill="#1a1a1a" rx="2" />
      {/* マントルピース */}
      <rect x="0" y="5" width="60" height="8" fill="#654321" rx="1" />
      <rect x="5" y="0" width="50" height="6" fill="#8B4513" rx="1" />
      {/* 炎 */}
      <ellipse cx="30" cy="55" rx="15" ry="8" fill="#FF4500" opacity="0.9" />
      <ellipse cx="25" cy="50" rx="6" ry="12" fill="#FF6347" opacity="0.8" />
      <ellipse cx="35" cy="48" rx="5" ry="14" fill="#FFA500" opacity="0.8" />
      <ellipse cx="30" cy="45" rx="4" ry="10" fill="#FFD700" opacity="0.9" />
      {/* 薪 */}
      <rect
        x="15"
        y="58"
        width="30"
        height="5"
        fill="#4a3728"
        rx="2"
        transform="rotate(-5 30 60)"
      />
      <rect
        x="18"
        y="60"
        width="25"
        height="4"
        fill="#5a4738"
        rx="2"
        transform="rotate(8 30 62)"
      />
    </svg>
  );
}

// テーブルのSVGアイコン
function TableIcon() {
  return (
    <svg viewBox="0 0 90 60" className="w-full h-full">
      {/* テーブル天板 */}
      <ellipse cx="45" cy="20" rx="42" ry="15" fill="#8B4513" />
      <ellipse cx="45" cy="18" rx="38" ry="12" fill="#A0522D" />
      {/* テーブル脚 */}
      <rect x="20" y="25" width="6" height="30" fill="#654321" />
      <rect x="64" y="25" width="6" height="30" fill="#654321" />
      {/* テーブルの上のアイテム */}
      <ellipse cx="30" cy="16" rx="6" ry="3" fill="#F5DEB3" opacity="0.8" />
      <rect x="50" y="12" width="8" height="10" fill="#4169E1" opacity="0.7" />
      <circle cx="60" cy="16" r="4" fill="#DC143C" opacity="0.8" />
    </svg>
  );
}

// 像のSVGアイコン
function StatueIcon() {
  return (
    <svg viewBox="0 0 50 60" className="w-full h-full">
      {/* 台座 */}
      <rect x="10" y="50" width="30" height="8" fill="#696969" rx="1" />
      <rect x="15" y="45" width="20" height="6" fill="#808080" rx="1" />
      {/* 像本体 */}
      <ellipse cx="25" cy="35" rx="8" ry="12" fill="#A9A9A9" />
      {/* 頭 */}
      <circle cx="25" cy="18" r="8" fill="#C0C0C0" />
      {/* 腕 */}
      <rect
        x="12"
        y="28"
        width="4"
        height="15"
        fill="#A9A9A9"
        rx="2"
        transform="rotate(-15 14 35)"
      />
      <rect
        x="34"
        y="28"
        width="4"
        height="15"
        fill="#A9A9A9"
        rx="2"
        transform="rotate(15 36 35)"
      />
    </svg>
  );
}

// 棚のSVGアイコン
function ShelfIcon() {
  return (
    <svg viewBox="0 0 70 50" className="w-full h-full">
      {/* 棚本体 */}
      <rect x="2" y="2" width="66" height="46" fill="#654321" rx="2" />
      <rect x="5" y="5" width="60" height="40" fill="#8B4513" rx="1" />
      {/* 棚板 */}
      <rect x="5" y="18" width="60" height="3" fill="#654321" />
      <rect x="5" y="32" width="60" height="3" fill="#654321" />
      {/* 本 */}
      <rect x="10" y="7" width="5" height="10" fill="#DC143C" />
      <rect x="16" y="8" width="4" height="9" fill="#4169E1" />
      <rect x="21" y="6" width="6" height="11" fill="#228B22" />
      <rect x="28" y="7" width="4" height="10" fill="#FFD700" />
      {/* 小物 */}
      <circle cx="50" cy="12" r="4" fill="#DEB887" />
      <rect x="12" y="21" width="8" height="10" fill="#8B0000" />
      <rect x="25" y="22" width="6" height="9" fill="#4682B4" />
      <circle cx="45" cy="27" r="5" fill="#CD853F" />
      {/* 下段 */}
      <rect x="10" y="36" width="15" height="8" fill="#2F4F4F" rx="1" />
      <rect x="30" y="37" width="10" height="7" fill="#8B4513" rx="1" />
    </svg>
  );
}

// 天井（シャンデリア）のSVGアイコン
function CeilingIcon() {
  return (
    <svg viewBox="0 0 60 35" className="w-full h-full">
      {/* チェーン */}
      <rect x="28" y="0" width="4" height="8" fill="#B8860B" />
      {/* シャンデリア本体 */}
      <ellipse cx="30" cy="15" rx="25" ry="8" fill="#DAA520" />
      <ellipse cx="30" cy="13" rx="20" ry="5" fill="#FFD700" />
      {/* キャンドル */}
      <rect x="10" y="18" width="3" height="8" fill="#FFFACD" />
      <ellipse cx="11.5" cy="17" rx="2" ry="3" fill="#FFA500" opacity="0.9" />
      <rect x="22" y="16" width="3" height="10" fill="#FFFACD" />
      <ellipse cx="23.5" cy="15" rx="2" ry="3" fill="#FFA500" opacity="0.9" />
      <rect x="35" y="16" width="3" height="10" fill="#FFFACD" />
      <ellipse cx="36.5" cy="15" rx="2" ry="3" fill="#FFA500" opacity="0.9" />
      <rect x="47" y="18" width="3" height="8" fill="#FFFACD" />
      <ellipse cx="48.5" cy="17" rx="2" ry="3" fill="#FFA500" opacity="0.9" />
      {/* 装飾 */}
      <circle cx="30" cy="28" r="4" fill="#B8860B" />
    </svg>
  );
}

export default function RoomView() {
  const { state, changeArea } = useGame();
  const [hoveredArea, setHoveredArea] = useState<AreaType | "room">("room");

  return (
    <div className="flex flex-col items-center gap-4">
      {/* フロア移動ステータス */}
      {(state.flags.lowerFloorAccessible ||
        state.flags.upperFloorAccessible) && (
        <div className="text-center">
          {state.flags.lowerFloorAccessible && (
            <p className="text-green-400 text-sm">
              ✓ 下の階への扉が開いています
            </p>
          )}
          {state.flags.upperFloorAccessible && (
            <p className="text-yellow-400 text-sm">✓ 上の階に行けます</p>
          )}
        </div>
      )}

      {/* 部屋のビジュアル */}
      <div className="relative w-full max-w-md aspect-square overflow-hidden rounded-xl shadow-2xl">
        {/* 壁（上部） */}
        <div
          className="absolute top-0 left-0 right-0 h-1/3"
          style={{
            background:
              "linear-gradient(180deg, #4a3728 0%, #5a4738 50%, #6a5748 100%)",
          }}
        >
          {/* 壁の模様 */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent, transparent 30px, #3a2718 30px, #3a2718 32px)",
            }}
          />
        </div>

        {/* 床（木目調） */}
        <div
          className="absolute bottom-0 left-0 right-0 h-2/3"
          style={{
            background:
              "linear-gradient(180deg, #8B4513 0%, #A0522D 30%, #CD853F 100%)",
          }}
        >
          {/* 木目パターン */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent, transparent 40px, #654321 40px, #654321 42px), repeating-linear-gradient(0deg, transparent, transparent 80px, #5a3d2b 80px, #5a3d2b 82px)",
            }}
          />
        </div>

        {/* 壁と床の境界線 */}
        <div
          className="absolute top-1/3 left-0 right-0 h-2 bg-gradient-to-b from-amber-900 to-amber-800"
          style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
        />

        {/* 天井（シャンデリア） */}
        <button
          onClick={() => {
            changeArea("ceiling");
          }}
          onMouseEnter={() => {
            setHoveredArea("ceiling");
          }}
          onMouseLeave={() => {
            setHoveredArea("room");
          }}
          className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-12 hover:scale-110 transition-transform duration-200 drop-shadow-lg z-10 cursor-pointer"
          title="天井を調べる"
        >
          <CeilingIcon />
        </button>

        {/* 水槽（左上） */}
        <button
          onClick={() => {
            changeArea("tank");
          }}
          onMouseEnter={() => {
            setHoveredArea("tank");
          }}
          onMouseLeave={() => {
            setHoveredArea("room");
          }}
          className="absolute top-[15%] left-[5%] w-24 h-16 hover:scale-110 transition-transform duration-200 drop-shadow-lg cursor-pointer"
          title="水槽を調べる"
        >
          <TankIcon />
        </button>

        {/* キッチン（右上） */}
        <button
          onClick={() => {
            changeArea("kitchen");
          }}
          onMouseEnter={() => {
            setHoveredArea("kitchen");
          }}
          onMouseLeave={() => {
            setHoveredArea("room");
          }}
          className="absolute top-[12%] right-[3%] w-32 h-20 hover:scale-110 transition-transform duration-200 drop-shadow-lg cursor-pointer"
          title="キッチンを調べる"
        >
          <KitchenIcon />
        </button>

        {/* ドア（左壁） */}
        <button
          onClick={() => {
            changeArea("door");
          }}
          onMouseEnter={() => {
            setHoveredArea("door");
          }}
          onMouseLeave={() => {
            setHoveredArea("room");
          }}
          className="absolute top-[38%] left-[2%] w-14 h-24 hover:scale-110 transition-transform duration-200 drop-shadow-xl cursor-pointer"
          title="ドアを調べる"
        >
          <DoorIcon />
        </button>

        {/* 暖炉（右壁） */}
        <button
          onClick={() => {
            changeArea("fireplace");
          }}
          onMouseEnter={() => {
            setHoveredArea("fireplace");
          }}
          onMouseLeave={() => {
            setHoveredArea("room");
          }}
          className="absolute top-[35%] right-[2%] w-20 h-28 hover:scale-110 transition-transform duration-200 drop-shadow-xl cursor-pointer"
          title="暖炉を調べる"
        >
          <FireplaceIcon />
        </button>

        {/* テーブル（中央） */}
        <button
          onClick={() => {
            changeArea("table");
          }}
          onMouseEnter={() => {
            setHoveredArea("table");
          }}
          onMouseLeave={() => {
            setHoveredArea("room");
          }}
          className="absolute top-[55%] left-1/2 -translate-x-1/2 w-36 h-24 hover:scale-110 transition-transform duration-200 drop-shadow-xl cursor-pointer"
          title="テーブルを調べる"
        >
          <TableIcon />
        </button>

        {/* 像（左下） */}
        <button
          onClick={() => {
            changeArea("statue");
          }}
          onMouseEnter={() => {
            setHoveredArea("statue");
          }}
          onMouseLeave={() => {
            setHoveredArea("room");
          }}
          className="absolute bottom-[8%] left-[8%] w-16 h-20 hover:scale-110 transition-transform duration-200 drop-shadow-lg cursor-pointer"
          title="像を調べる"
        >
          <StatueIcon />
        </button>

        {/* 棚（下部中央寄り） */}
        <button
          onClick={() => {
            changeArea("shelf");
          }}
          onMouseEnter={() => {
            setHoveredArea("shelf");
          }}
          onMouseLeave={() => {
            setHoveredArea("room");
          }}
          className="absolute bottom-[5%] left-[30%] w-28 h-18 hover:scale-110 transition-transform duration-200 drop-shadow-lg cursor-pointer"
          title="棚を調べる"
        >
          <ShelfIcon />
        </button>

        {/* 下の階への入り口（解放済みの場合） */}
        {state.flags.lowerFloorAccessible && (
          <button
            onClick={() => {
              changeArea("lower");
            }}
            onMouseEnter={() => {
              setHoveredArea("lower");
            }}
            onMouseLeave={() => {
              setHoveredArea("room");
            }}
            className="absolute top-[70%] left-1/2 -translate-x-1/2 px-4 py-2 bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 rounded-lg border-2 border-amber-400 text-white text-sm font-bold transition-all hover:scale-110 shadow-lg cursor-pointer animate-pulse"
            title="下の階へ"
          >
            ↓ 下の階へ
          </button>
        )}

        {/* 上の階への入り口（解放済みの場合） */}
        {state.flags.upperFloorAccessible && (
          <button
            onClick={() => {
              changeArea("upper");
            }}
            onMouseEnter={() => {
              setHoveredArea("upper");
            }}
            onMouseLeave={() => {
              setHoveredArea("room");
            }}
            className="absolute top-[5%] right-[35%] px-4 py-2 bg-gradient-to-b from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 rounded-lg border-2 border-blue-400 text-white text-sm font-bold transition-all hover:scale-110 shadow-lg cursor-pointer animate-pulse"
            title="上の階へ"
          >
            ↑ 上の階へ
          </button>
        )}

        {/* 部屋の雰囲気を出すためのオーバーレイ */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 80% 40%, rgba(255,150,50,0.15) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* エリア説明（ホバー時に表示） */}
      <div className="h-8 flex items-center justify-center">
        <p className="text-gray-300 text-sm text-center transition-opacity duration-200">
          {areaDescriptions[hoveredArea]}
        </p>
      </div>
    </div>
  );
}
