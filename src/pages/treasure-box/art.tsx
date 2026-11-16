/**
 * 「逆転の宝箱」のイラスト一式。
 * すべて同じタッチ（焦げ茶の主線 + サイトのブラウン／ゴールド系）の SVG で描いている。
 */

const INK = "#2a1a10";

/** 机（天板・手前の縁・幕板）。横幅いっぱいに引き伸ばして使う */
export function TableArt() {
  // 奥から手前へ広がる板の継ぎ目
  const seams = [-30, -10, 10, 30, 50, 70, 90, 110, 130];
  return (
    <svg
      className="tb-table"
      viewBox="0 0 100 63"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="tbTableTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#84532e" />
          <stop offset="1" stopColor="#b47b4a" />
        </linearGradient>
        <linearGradient id="tbTableApron" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#603a20" />
          <stop offset="1" stopColor="#372012" />
        </linearGradient>
        <radialGradient id="tbTablePool">
          <stop offset="0" stopColor="#ffe2ae" stopOpacity="0.38" />
          <stop offset="1" stopColor="#ffe2ae" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100" height="50" fill="url(#tbTableTop)" />
      {seams.map((x) => (
        <line
          key={x}
          x1={x}
          y1="0"
          x2={50 + (x - 50) * 1.6}
          y2="50"
          stroke="#4f2d14"
          strokeOpacity="0.35"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <ellipse cx="50" cy="24" rx="46" ry="24" fill="url(#tbTablePool)" />
      <rect width="100" height="0.7" fill="#e0b584" opacity="0.55" />
      <rect y="50" width="100" height="3.6" fill="#cb925b" />
      <rect y="53.6" width="100" height="9.4" fill="url(#tbTableApron)" />
      <rect y="53.6" width="100" height="0.9" fill={INK} opacity="0.55" />
    </svg>
  );
}

/** 天井から下がるランプ */
export function LampArt() {
  return (
    <svg className="tb-lamp" viewBox="0 0 100 84" aria-hidden="true">
      <line x1="50" y1="0" x2="50" y2="38" stroke="#15100c" strokeWidth="2" />
      <rect x="45" y="34" width="10" height="8" rx="2" fill="#8d6b3f" />
      <circle cx="50" cy="68" r="7" fill="#fff3d1" />
      <path
        d="M38 42 H62 L80 66 H20 Z"
        fill="#33443b"
        stroke="#15100c"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M41 46 H52 L47 62 H27 Z" fill="#4c6155" opacity="0.7" />
      <ellipse cx="50" cy="66" rx="29" ry="3.5" fill="#ffe2a6" />
    </svg>
  );
}

/** 宝箱（正面） */
export function ChestArt() {
  const rivets: [number, number][] = [
    [52, 22],
    [52, 44],
    [52, 86],
    [52, 110],
    [148, 22],
    [148, 44],
    [148, 86],
    [148, 110],
    [20, 64],
    [78, 64],
    [122, 64],
    [180, 64],
    [20, 138],
    [100, 138],
    [180, 138],
  ];
  return (
    <svg className="tb-art" viewBox="0 0 200 150" aria-hidden="true">
      <defs>
        <linearGradient id="tbChestLid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#94603a" />
          <stop offset="1" stopColor="#663d22" />
        </linearGradient>
        <linearGradient id="tbChestBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#774828" />
          <stop offset="1" stopColor="#4f2e19" />
        </linearGradient>
        <linearGradient id="tbChestGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0d7a4" />
          <stop offset="0.45" stopColor="#c69c6d" />
          <stop offset="1" stopColor="#96703f" />
        </linearGradient>
      </defs>

      {/* 蓋 */}
      <path
        d="M12 64 V46 Q12 10 48 10 H152 Q188 10 188 46 V64 Z"
        fill="url(#tbChestLid)"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M16 30 H184 M13 47 H187"
        stroke="#3b2212"
        strokeWidth="1.3"
        opacity="0.55"
      />
      <path
        d="M64 16 H136"
        stroke="#c08a58"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* 本体 */}
      <rect
        x="12"
        y="64"
        width="176"
        height="78"
        fill="url(#tbChestBody)"
        stroke={INK}
        strokeWidth="2.5"
      />
      <path
        d="M13 92 H187 M13 118 H187"
        stroke="#3b2212"
        strokeWidth="1.3"
        opacity="0.55"
      />
      <path
        d="M70 80 q10 -4 20 0 M114 104 q12 4 24 0 M68 126 q8 -3 16 0 M22 104 q6 -3 12 0 M168 82 q6 3 12 0"
        fill="none"
        stroke="#3b2212"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* 縦の帯金 */}
      <rect
        x="44"
        y="10"
        width="16"
        height="132"
        fill="url(#tbChestGold)"
        stroke={INK}
        strokeWidth="2"
      />
      <rect
        x="140"
        y="10"
        width="16"
        height="132"
        fill="url(#tbChestGold)"
        stroke={INK}
        strokeWidth="2"
      />

      {/* 蓋の合わせ目と底の帯金 */}
      <rect
        x="7"
        y="58"
        width="186"
        height="12"
        rx="2"
        fill="url(#tbChestGold)"
        stroke={INK}
        strokeWidth="2"
      />
      <rect
        x="7"
        y="132"
        width="186"
        height="12"
        rx="2"
        fill="url(#tbChestGold)"
        stroke={INK}
        strokeWidth="2"
      />

      {/* 角の金具 */}
      <path
        d="M7 132 V112 L27 132 Z M193 132 V112 L173 132 Z"
        fill="url(#tbChestGold)"
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {rivets.map(([cx, cy]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="2.3"
          fill="#f6e3ba"
          stroke={INK}
          strokeWidth="0.9"
        />
      ))}

      {/* 掛け金 */}
      <path
        d="M89 52 H111 V80 Q111 88 100 88 Q89 88 89 80 Z"
        fill="url(#tbChestGold)"
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="100" cy="78" r="4.2" fill={INK} />
    </svg>
  );
}

/** 宝箱に掛かっているダイヤル錠。現在のダイヤルの数字をそのまま表示する */
export function LockArt({ digits }: { digits: number[] }) {
  return (
    <svg className="tb-art" viewBox="0 0 60 66" aria-hidden="true">
      <defs>
        <linearGradient id="tbLockBrass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ecd09a" />
          <stop offset="1" stopColor="#a47a3f" />
        </linearGradient>
      </defs>
      <g className="tb-lock-shackle">
        <path
          d="M19 30 V17 a11 11 0 0 1 22 0 V30"
          fill="none"
          stroke={INK}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M19 30 V17 a11 11 0 0 1 22 0 V30"
          fill="none"
          stroke="#cdd2d6"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      </g>
      <rect
        x="4"
        y="26"
        width="52"
        height="36"
        rx="6"
        fill="url(#tbLockBrass)"
        stroke={INK}
        strokeWidth="2"
      />
      {digits.map((digit, i) => (
        <g key={i}>
          <rect
            x={8.2 + 11.2 * i}
            y="34"
            width="10"
            height="20"
            rx="1.6"
            fill="#241a12"
          />
          <text
            x={13.2 + 11.2 * i}
            y="48.6"
            textAnchor="middle"
            fontSize="12.5"
            fontWeight="700"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
            fill="#f6ecd8"
          >
            {digit}
          </text>
        </g>
      ))}
    </svg>
  );
}

/** 封蝋つきの封筒（挑戦状） */
export function EnvelopeArt() {
  return (
    <svg className="tb-art" viewBox="0 0 120 80" aria-hidden="true">
      <rect
        x="2"
        y="2"
        width="116"
        height="76"
        rx="3"
        fill="#efe0c2"
        stroke={INK}
        strokeWidth="2"
      />
      <path
        d="M3 77 L47 40 M117 77 L73 40"
        stroke="#b79a6c"
        strokeWidth="1.5"
      />
      <path
        d="M3 4 L60 48 L117 4"
        fill="#f8eed8"
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle
        cx="60"
        cy="47"
        r="10.5"
        fill="#a23b2c"
        stroke={INK}
        strokeWidth="1.5"
      />
      <circle
        cx="60"
        cy="47"
        r="7"
        fill="none"
        stroke="#cf6f5a"
        strokeWidth="1.2"
      />
      <circle cx="60" cy="45" r="2.3" fill="#5a1b12" />
      <path d="M58.8 46 L57.8 51.5 H62.2 L61.2 46 Z" fill="#5a1b12" />
    </svg>
  );
}

/** 重ねたメモ用紙（ダイヤル錠の手がかり） */
export function MemoArt() {
  return (
    <svg className="tb-art" viewBox="0 0 90 110" aria-hidden="true">
      <rect
        x="10"
        y="8"
        width="70"
        height="94"
        rx="2"
        fill="#dccba6"
        stroke={INK}
        strokeWidth="1.6"
        transform="rotate(-7 45 55)"
      />
      <g transform="rotate(3 45 55)">
        <rect
          x="10"
          y="8"
          width="70"
          height="94"
          rx="2"
          fill="#f5ead0"
          stroke={INK}
          strokeWidth="2"
        />
        <path
          d="M20 26 H58 M20 39 H68 M20 52 H52 M20 65 H63"
          stroke="#75634b"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M20 84 H46"
          stroke="#a23b2c"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/** 宝箱の下から出てくる、くしゃっと丸められた紙 */
export function CrumpledPaperArt() {
  return (
    <svg className="tb-art" viewBox="0 0 60 52" aria-hidden="true">
      <path
        d="M14 10 L27 4 L41 7 L52 16 L56 29 L50 42 L37 49 L22 48 L9 40 L4 27 L7 16 Z"
        fill="#fdf8ea"
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M27 4 L41 7 L34 18 L22 15 Z M37 49 L50 42 L44 30 L32 36 Z"
        fill="#efe4c9"
      />
      <path
        d="M52 16 L56 29 L44 30 L40 20 Z M9 40 L22 48 L26 36 L14 30 Z"
        fill="#e2d3b1"
      />
      <path
        d="M14 10 L22 15 L34 18 L40 20 L52 16 M22 15 L14 30 L4 27 M7 16 L14 30 M34 18 L30 28 L14 30 M30 28 L44 30 L56 29 M30 28 L26 36 L32 36 L44 30 M26 36 L22 48 M32 36 L37 49 M14 30 L9 40"
        fill="none"
        stroke="#8a7658"
        strokeWidth="1.1"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 広げた紙に残る、しわの跡 */
export function CreasesArt() {
  return (
    <svg
      className="tb-note-creases"
      viewBox="0 0 140 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 30 L38 22 L52 0 L38 22 L60 48 Z M140 64 L104 58 L92 100 L140 100 Z M60 48 L104 58 L96 28 Z M0 78 L30 70 L44 100 L0 100 Z"
        fill="#7a5f3c"
        opacity="0.06"
      />
      <path
        d="M0 30 L38 22 L52 0 M38 22 L60 48 L30 70 L0 78 M30 70 L44 100 M60 48 L104 58 L140 64 M104 58 L92 100 M60 48 L96 28 L104 58 M96 28 L88 0 M96 28 L140 20 M60 48 L70 76 L92 100 M70 76 L44 100"
        fill="none"
        stroke="#c9b68e"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function BulbIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2.2h5c.1-1 .5-1.7 1.1-2.2A6 6 0 0 0 12 3Z" />
    </svg>
  );
}

export function ChevronIcon({ direction }: { direction: "up" | "down" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === "up" ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} />
    </svg>
  );
}
