// 脱出ゲームの絵。すべてコード内の SVG で描く
import type { ReactNode } from "react";
import {
  trapOpen,
  type GameState,
  type ItemId,
  type PillId,
  type Target,
  type View,
} from "./game";

/** 場面の中でタップできるもの（本と箱は画面側で開く） */
export type SceneTarget =
  | Target
  | "book-plant"
  | "book-manual"
  | "book-mystery"
  | "box";

interface SceneProps {
  state: GameState;
  onTap: (target: SceneTarget) => void;
}

// ===== 共通部品 =====

function Hot({
  label,
  onTap,
  children,
}: {
  label: string;
  onTap: () => void;
  children: ReactNode;
}) {
  return (
    <g
      className="eg-hot"
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={onTap}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onTap();
        }
      }}
    >
      {children}
    </g>
  );
}

/** 見えない当たり判定 */
function Hit(props: { x: number; y: number; width: number; height: number }) {
  return <rect {...props} fill="transparent" />;
}

const PILL_COLOR: Record<PillId, string> = {
  red: "#e8382e",
  yellow: "#f4c532",
  white: "#f6f3ec",
  blue: "#46b0f2",
  purple: "#8d5cf2",
};

const STAR_POINTS = Array.from({ length: 10 }, (_, i) => {
  const radius = i % 2 === 0 ? 1 : 0.42;
  const angle = (Math.PI / 5) * i - Math.PI / 2;
  return `${(Math.cos(angle) * radius).toFixed(3)},${(Math.sin(angle) * radius).toFixed(3)}`;
}).join(" ");

/** 雲のふくらみの境目（＝角）の位置 */
const CLOUD_CORNERS = Array.from({ length: 7 }, (_, i) => {
  const angle = ((Math.PI * 2) / 7) * i - Math.PI / 2 + Math.PI / 7;
  return `${(Math.cos(angle) * 0.8).toFixed(3)} ${(Math.sin(angle) * 0.56).toFixed(3)}`;
});

/**
 * 雲の形。7つのふくらみをつなぎ、あいだに角が7つできるようにする
 * （箱の中の紙の数字は「角の数」なので、数を変えてはいけない）
 */
const CLOUD_PATH = `M${CLOUD_CORNERS[0]}${[
  ...CLOUD_CORNERS.slice(1),
  CLOUD_CORNERS[0],
]
  .map((point) => `A.36 .36 0 0 1 ${point}`)
  .join("")}Z`;

/** 錠剤の形。半径1の大きさで描いて拡大する */
function PillShape({
  pill,
  cx,
  cy,
  r,
}: {
  pill: PillId;
  cx: number;
  cy: number;
  r: number;
}) {
  const fill = PILL_COLOR[pill];
  let shape: ReactNode;
  switch (pill) {
    case "red":
      shape = (
        <path d="M0 .95C-.2 .7-1 .2-1-.4C-1-.85-.65-1-.45-1C-.2-1 0-.8 0-.6C0-.8 .2-1 .45-1C.65-1 1-.85 1-.4C1 .2 .2 .7 0 .95Z" />
      );
      break;
    case "yellow":
      shape = <polygon points={STAR_POINTS} />;
      break;
    case "white":
      shape = <circle r=".9" />;
      break;
    case "blue":
      shape = <path d={CLOUD_PATH} />;
      break;
    case "purple":
      shape = <polygon points="0,-.9 .98,.75 -.98,.75" />;
      break;
  }
  return (
    <g transform={`translate(${cx} ${cy}) scale(${r})`} fill={fill}>
      {shape}
    </g>
  );
}

/** 錠剤の入った小瓶（幅36 × 高さ44） */
function Jar({ pill, x, y }: { pill: PillId; x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="18" cy="44" rx="17" ry="3" fill="#000" opacity=".3" />
      <rect
        x="1.5"
        y="10"
        width="33"
        height="33"
        rx="9"
        fill="#dfeef2"
        fillOpacity=".2"
        stroke="#efe8d8"
        strokeWidth="1.6"
      />
      <rect
        x="7"
        y="1"
        width="22"
        height="10"
        rx="2.5"
        fill="#c9b48a"
        stroke="#8f7a52"
        strokeWidth="1"
      />
      <path d="M8 6h20" stroke="#8f7a52" strokeWidth="1" />
      <PillShape pill={pill} cx={18} cy={28.5} r={10} />
      <path
        d="M7 18v14"
        stroke="#fff"
        strokeOpacity=".5"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </g>
  );
}

/** 壁を押すボタン */
function WallButton({
  cx,
  cy,
  pressed,
}: {
  cx: number;
  cy: number;
  pressed: boolean;
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="13" fill="#2a2420" stroke="#8d8275" />
      <circle
        cx={cx}
        cy={cy}
        r={pressed ? 7.5 : 9}
        fill={pressed ? "#58a868" : "#c0412f"}
      />
      <circle cx={cx - 3} cy={cy - 3} r="2.4" fill="#fff" opacity=".35" />
    </g>
  );
}

/** 縦書きの背表紙の文字 */
function SpineText({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text
      x={x}
      y={y}
      fontSize="9.5"
      fontWeight="700"
      fill="#f3e6c8"
      textAnchor="middle"
    >
      {Array.from(text).map((char, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : 10.5}>
          {char}
        </tspan>
      ))}
    </text>
  );
}

/** 壁と床。4面の壁で共通 */
function Room({ id }: { id: string }) {
  const planks = [-140, -60, 20, 100, 180, 260, 340, 420, 500];
  return (
    <>
      <defs>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4b382c" />
          <stop offset="1" stopColor="#3a2a20" />
        </linearGradient>
        <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5d3f29" />
          <stop offset="1" stopColor="#7a5436" />
        </linearGradient>
      </defs>
      <rect width="400" height="380" fill={`url(#${id}-wall)`} />
      {Array.from({ length: 9 }, (_, i) => (
        <path
          key={i}
          d={`M${i * 50 + 25} 0V310`}
          stroke="#000"
          strokeOpacity=".07"
          strokeWidth="14"
        />
      ))}
      <rect x="-400" y="310" width="1200" height="70" fill="#33251b" />
      <rect x="-400" y="308" width="1200" height="5" fill="#5a4332" />
      <rect x="-400" y="372" width="1200" height="8" fill="#1f1510" />
      <rect y="380" width="400" height="120" fill={`url(#${id}-floor)`} />
      {planks.map((x) => (
        <path
          key={x}
          d={`M${200 + (x - 200) * 0.55} 380L${x} 500`}
          stroke="#2c1c11"
          strokeOpacity=".55"
          strokeWidth="1.5"
        />
      ))}
    </>
  );
}

// ===== 北の壁：暖炉と像 =====

function NorthScene({ state, onTap }: SceneProps) {
  const { flags } = state;
  const lit = !flags.fireOut;
  const shift = flags.button3 ? 44 : 0;
  return (
    <>
      <Room id="eg-n" />
      {lit && (
        <ellipse
          className="eg-glow"
          cx="130"
          cy="400"
          rx="150"
          ry="46"
          fill="#ff9a3c"
          opacity=".22"
        />
      )}

      {/* 暖炉 */}
      <Hot
        label="暖炉"
        onTap={() => {
          onTap("fire");
        }}
      >
        <rect x="38" y="180" width="184" height="200" fill="#766d64" />
        {[206, 232, 258, 284, 310, 336, 362].map((y, row) => (
          <g key={y} stroke="#4f4842" strokeWidth="1.5">
            <path d={`M38 ${y}H222`} />
            {[60, 100, 140, 180, 220].map((x) => (
              <path
                key={x}
                d={`M${x - (row % 2) * 20} ${y - 26}V${y}`}
                opacity={x - (row % 2) * 20 > 40 ? 1 : 0}
              />
            ))}
          </g>
        ))}
        <rect x="26" y="166" width="208" height="16" rx="2" fill="#9a9086" />
        <rect x="26" y="180" width="208" height="4" fill="#4f4842" />
        <path d="M68 380V252Q130 214 192 252V380Z" fill="#120c08" />
        <WallButton cx={130} cy={300} pressed={flags.button1} />
        {lit ? (
          <>
            <rect
              x="68"
              y="244"
              width="124"
              height="136"
              fill="#120c08"
              opacity=".45"
            />
            <g className="eg-flame">
              <path
                d="M92 372C80 330 112 322 106 284C128 302 126 322 138 296C152 324 176 334 168 372Z"
                fill="#f0692a"
              />
              <path
                d="M108 372C102 344 124 338 122 314C136 328 138 340 146 328C154 346 160 354 154 372Z"
                fill="#ffc94d"
              />
            </g>
          </>
        ) : (
          <>
            <ellipse cx="130" cy="368" rx="50" ry="8" fill="#55504b" />
            <path
              d="M100 366q10-6 22 0t26-2"
              stroke="#2e2a27"
              strokeWidth="3"
              fill="none"
            />
          </>
        )}
        <rect
          x="88"
          y="362"
          width="84"
          height="10"
          rx="5"
          fill="#3d2a1c"
          transform="rotate(-4 130 367)"
        />
        <rect
          x="94"
          y="368"
          width="76"
          height="9"
          rx="4.5"
          fill="#4d3524"
          transform="rotate(5 130 372)"
        />
        <rect x="26" y="376" width="208" height="10" rx="2" fill="#5d564f" />
      </Hot>

      {/* 像の裏のボタン（像を動かすと見える） */}
      <WallButton cx={288} cy={288} pressed={flags.button3} />

      {/* 像 */}
      <Hot
        label="像"
        onTap={() => {
          onTap("statue");
        }}
      >
        <g transform={`translate(${shift} 0)`}>
          <ellipse cx="310" cy="382" rx="58" ry="7" fill="#000" opacity=".35" />
          <path d="M270 324Q268 268 310 262Q352 268 350 324Z" fill="#a59e95" />
          <path
            d="M310 262Q352 268 350 324H322Q330 286 310 262Z"
            fill="#8a837b"
          />
          <rect x="300" y="238" width="20" height="30" fill="#989188" />
          <ellipse cx="310" cy="222" rx="25" ry="29" fill="#b3aca3" />
          <path d="M310 193a25 29 0 0 1 0 58q14-28 0-58Z" fill="#989188" />
          <path
            d="M298 220h8M316 220h8M304 236q6 4 12 0"
            stroke="#6f6962"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <rect x="256" y="322" width="108" height="12" rx="2" fill="#8d867e" />
          <rect x="264" y="334" width="92" height="46" fill="#777069" />
          <rect x="264" y="334" width="92" height="5" fill="#5e5852" />
        </g>
      </Hot>

      {!state.taken.includes("blue") && (
        <Hot
          label="青い錠剤の小瓶"
          onTap={() => {
            onTap("jar-blue");
          }}
        >
          <Hit x={222} y={366} width={52} height={56} />
          <Jar pill="blue" x={230} y={372} />
        </Hot>
      )}
    </>
  );
}

// ===== 東の壁：キッチン =====

function EastScene({ state, onTap }: SceneProps) {
  const door = (x: number, y: number, w: number, h: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width={w} height={h} fill="#7b5230" stroke="#4a2f1a" />
      <rect
        x={x + 7}
        y={y + 7}
        width={w - 14}
        height={h - 14}
        fill="#8b5f38"
        stroke="#5d3c22"
      />
    </g>
  );
  return (
    <>
      <Room id="eg-e" />
      {/* タイルの壁 */}
      <rect x="28" y="180" width="344" height="72" fill="#cfc8b6" />
      {[204, 228].map((y) => (
        <path key={y} d={`M28 ${y}H372`} stroke="#aaa391" />
      ))}
      {Array.from({ length: 11 }, (_, i) => (
        <path key={i} d={`M${56 + i * 30} 180V252`} stroke="#aaa391" />
      ))}

      {/* 吊り戸棚 */}
      {door(28, 70, 76, 110)}
      {door(104, 70, 76, 110)}
      {door(298, 70, 74, 110)}
      <rect x="22" y="62" width="356" height="10" fill="#5d3c22" />
      <rect x="94" y="140" width="4" height="22" rx="2" fill="#c9c2b2" />
      <rect x="110" y="140" width="4" height="22" rx="2" fill="#c9c2b2" />
      <rect x="306" y="140" width="4" height="22" rx="2" fill="#c9c2b2" />

      {/* 換気扇 */}
      <Hot
        label="換気扇"
        onTap={() => {
          onTap("fan");
        }}
      >
        <rect
          x="186"
          y="74"
          width="106"
          height="104"
          rx="4"
          fill="#d9cfae"
          stroke="#9a9072"
        />
        <circle cx="236" cy="126" r="40" fill="#2a2620" />
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse
            key={angle}
            cx="236"
            cy="104"
            rx="11"
            ry="20"
            fill="#6f9a52"
            transform={`rotate(${angle} 236 126)`}
          />
        ))}
        <circle cx="236" cy="126" r="9" fill="#547a3d" />
        <circle
          cx="236"
          cy="126"
          r="40"
          fill="none"
          stroke="#b9ae8c"
          strokeWidth="3"
        />
        <path d="M284 170V222" stroke="#b9ae8c" strokeWidth="1.5" />
        <rect x="280" y="220" width="8" height="12" rx="4" fill="#c9b48a" />
        <Hit x={274} y={170} width={22} height={66} />
      </Hot>

      {/* 調理台 */}
      <rect x="20" y="250" width="360" height="16" fill="#dccca4" />
      <rect x="20" y="264" width="360" height="4" fill="#8f8263" />

      {/* 流し */}
      <Hot
        label="流し"
        onTap={() => {
          onTap("sink");
        }}
      >
        <Hit x={44} y={192} width={112} height={72} />
        <rect x="46" y="250" width="108" height="9" rx="3" fill="#8c979d" />
        <rect x="52" y="252" width="96" height="5" rx="2" fill="#5d686e" />
        <path
          d="M92 250V214Q92 200 106 200H118Q128 200 128 212V220"
          stroke="#c3c9cc"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
        <rect x="76" y="238" width="14" height="12" rx="3" fill="#aab1b5" />
      </Hot>

      {/* コンロとオーブン */}
      <Hot
        label="コンロ"
        onTap={() => {
          onTap("stove");
        }}
      >
        <rect x="210" y="266" width="130" height="114" fill="#3a3a3d" />
        <rect x="210" y="266" width="130" height="24" fill="#8f9396" />
        {[228, 250, 272, 294, 316].map((x) => (
          <circle
            key={x}
            cx={x}
            cy="278"
            r="6"
            fill="#2c2c2f"
            stroke="#c3c9cc"
          />
        ))}
        <rect
          x="222"
          y="302"
          width="106"
          height="62"
          rx="3"
          fill="#1d1d20"
          stroke="#6b6f72"
        />
        <rect x="222" y="296" width="106" height="5" rx="2" fill="#c3c9cc" />
        <rect x="212" y="240" width="126" height="11" rx="2" fill="#242426" />
        <ellipse
          cx="244"
          cy="243"
          rx="22"
          ry="5"
          fill="none"
          stroke="#6b6f72"
          strokeWidth="2"
        />
        <ellipse
          cx="306"
          cy="243"
          rx="22"
          ry="5"
          fill="none"
          stroke="#6b6f72"
          strokeWidth="2"
        />
      </Hot>

      {!state.taken.includes("pot") && (
        <Hot
          label="鍋"
          onTap={() => {
            onTap("pot");
          }}
        >
          <Hit x={214} y={204} width={60} height={42} />
          <rect x="214" y="222" width="12" height="5" rx="2.5" fill="#3a3a3d" />
          <rect x="262" y="222" width="12" height="5" rx="2.5" fill="#3a3a3d" />
          <path
            d="M224 216h40v20a6 6 0 0 1-6 6h-28a6 6 0 0 1-6-6Z"
            fill="#8f9396"
          />
          <path d="M224 216h40v6h-40Z" fill="#b9bec2" />
          <ellipse cx="244" cy="216" rx="20" ry="4.5" fill="#3a3a3d" />
        </Hot>
      )}

      {/* 下の戸棚 */}
      <Hot
        label="戸棚"
        onTap={() => {
          onTap("cupboard");
        }}
      >
        {door(28, 268, 88, 112)}
        {door(116, 268, 88, 112)}
        <rect x="104" y="284" width="4" height="24" rx="2" fill="#c9c2b2" />
        <rect x="124" y="284" width="4" height="24" rx="2" fill="#c9c2b2" />
      </Hot>
      <rect
        x="346"
        y="268"
        width="26"
        height="112"
        fill="#7b5230"
        stroke="#4a2f1a"
      />
      <path d="M346 300H372M346 334H372" stroke="#4a2f1a" />

      {!state.taken.includes("white") && (
        <Hot
          label="白い錠剤の小瓶"
          onTap={() => {
            onTap("jar-white");
          }}
        >
          <Hit x={158} y={198} width={52} height={54} />
          <Jar pill="white" x={166} y={206} />
        </Hot>
      )}
    </>
  );
}

// ===== 南の壁：扉 =====

function SouthScene({ state, onTap }: SceneProps) {
  return (
    <>
      <Room id="eg-s" />
      {/* 壁の灯り */}
      <circle
        className="eg-glow"
        cx="62"
        cy="170"
        r="70"
        fill="#ffcf7a"
        opacity=".16"
      />
      <path d="M52 196h20l-4 14h-12Z" fill="#8f7a52" />
      <path d="M48 160q14-18 28 0l-6 36h-16Z" fill="#ffe2a6" />
      <rect x="58" y="210" width="8" height="18" fill="#6b5a3a" />

      <Hot
        label="扉"
        onTap={() => {
          onTap("door");
        }}
      >
        <rect x="114" y="74" width="172" height="306" fill="#1f1510" />
        <rect x="126" y="86" width="148" height="294" fill="#63412a" />
        <rect
          x="126"
          y="86"
          width="148"
          height="294"
          fill="none"
          stroke="#2c1c11"
          strokeWidth="2"
        />
        <rect
          x="142"
          y="110"
          width="116"
          height="104"
          fill="#70492e"
          stroke="#3d2819"
          strokeWidth="2"
        />
        <rect
          x="142"
          y="240"
          width="116"
          height="118"
          fill="#70492e"
          stroke="#3d2819"
          strokeWidth="2"
        />
        {[96, 222, 366].map((y) => (
          <g key={y}>
            <rect x="126" y={y} width="148" height="9" fill="#3a3a3d" />
            {[136, 166, 200, 234, 264].map((x) => (
              <circle key={x} cx={x} cy={y + 4.5} r="2.2" fill="#8f9396" />
            ))}
          </g>
        ))}
        <rect x="238" y="246" width="24" height="52" rx="4" fill="#8f7a52" />
        <circle cx="250" cy="260" r="8" fill="#d9b662" />
        <circle cx="247" cy="257" r="2.5" fill="#fff" opacity=".5" />
        <circle cx="250" cy="282" r="3.2" fill="#1f1510" />
        <rect x="248.6" y="282" width="2.8" height="8" fill="#1f1510" />
      </Hot>

      {!state.taken.includes("purple") && (
        <Hot
          label="紫の錠剤の小瓶"
          onTap={() => {
            onTap("jar-purple");
          }}
        >
          <Hit x={288} y={386} width={52} height={56} />
          <Jar pill="purple" x={296} y={392} />
        </Hot>
      )}
    </>
  );
}

// ===== 西の壁：棚と水槽 =====

function WestScene({ state, onTap }: SceneProps) {
  const { flags } = state;
  return (
    <>
      <Room id="eg-w" />
      <defs>
        <linearGradient id="eg-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#58a9cc" stopOpacity=".55" />
          <stop offset="1" stopColor="#1f5f86" stopOpacity=".75" />
        </linearGradient>
      </defs>

      {/* 棚 */}
      <rect x="16" y="102" width="204" height="280" fill="#553620" />
      <rect x="26" y="112" width="184" height="262" fill="#2a1a0f" />
      <rect x="26" y="196" width="184" height="9" fill="#6a4528" />
      <rect x="26" y="284" width="184" height="9" fill="#6a4528" />

      <Hot
        label="植物図鑑"
        onTap={() => {
          onTap("book-plant");
        }}
      >
        <rect x="38" y="126" width="46" height="70" rx="2" fill="#3f7349" />
        <path d="M38 136H84M38 188H84" stroke="#2a5233" strokeWidth="2" />
        <SpineText x={61} y={152} text="植物図鑑" />
      </Hot>
      <Hot
        label="取扱説明書"
        onTap={() => {
          onTap("book-manual");
        }}
      >
        <rect x="92" y="132" width="44" height="64" rx="2" fill="#3c6392" />
        <path d="M92 140H136M92 190H136" stroke="#294668" strokeWidth="2" />
        <SpineText x={114} y={151} text="取扱説明" />
      </Hot>
      <Hot
        label="謎の本"
        onTap={() => {
          onTap("book-mystery");
        }}
      >
        <rect x="144" y="122" width="48" height="74" rx="2" fill="#6d4384" />
        <path d="M144 132H192M144 188H192" stroke="#4c2d5e" strokeWidth="2" />
        <SpineText x={168} y={156} text="謎の本" />
      </Hot>

      {/* 飾りの本 */}
      <rect x="146" y="268" width="56" height="8" rx="1" fill="#8a5a2c" />
      <rect x="150" y="276" width="50" height="8" rx="1" fill="#a23b2c" />

      {!state.taken.includes("red") && (
        <Hot
          label="赤い錠剤の小瓶"
          onTap={() => {
            onTap("jar-red");
          }}
        >
          <Hit x={34} y={232} width={50} height={52} />
          <Jar pill="red" x={40} y={240} />
        </Hot>
      )}
      {!state.taken.includes("yellow") && (
        <Hot
          label="黄色い錠剤の小瓶"
          onTap={() => {
            onTap("jar-yellow");
          }}
        >
          <Hit x={88} y={232} width={50} height={52} />
          <Jar pill="yellow" x={94} y={240} />
        </Hot>
      )}

      {/* 3桁錠の箱 */}
      <Hot
        label="錠のついた箱"
        onTap={() => {
          onTap("box");
        }}
      >
        {flags.boxOpen && (
          <>
            <path d="M62 322L72 298H168L174 322Z" fill="#6f4622" />
            <rect
              x="78"
              y="306"
              width="74"
              height="18"
              fill="#f1e6c9"
              transform="rotate(-3 115 315)"
            />
          </>
        )}
        <rect
          x="58"
          y="322"
          width="120"
          height="52"
          rx="3"
          fill="#8f5d2e"
          stroke="#4a2f1a"
          strokeWidth="2"
        />
        <path d="M58 338H178" stroke="#4a2f1a" strokeWidth="2" />
        <rect x="66" y="322" width="8" height="52" fill="#3a3a3d" />
        <rect x="162" y="322" width="8" height="52" fill="#3a3a3d" />
        {!flags.boxOpen && (
          <>
            <rect
              x="94"
              y="330"
              width="48"
              height="22"
              rx="3"
              fill="#c9b48a"
              stroke="#6b5a3a"
            />
            {[100, 113, 126].map((x) => (
              <rect
                key={x}
                x={x}
                y="334"
                width="10"
                height="14"
                rx="1.5"
                fill="#2a1a0f"
              />
            ))}
          </>
        )}
      </Hot>

      {/* 水槽（高さ100センチほど） */}
      <Hot
        label="水槽"
        onTap={() => {
          onTap("tank");
        }}
      >
        <rect
          x="246"
          y="230"
          width="134"
          height="144"
          fill="#bfe3ef"
          fillOpacity=".08"
        />
        <rect x="246" y="250" width="134" height="124" fill="url(#eg-water)" />
        <path
          className="eg-wave"
          d="M246 250q11-5 22 0t22 0t22 0t22 0t22 0t24 0"
          stroke="#d7f1fa"
          strokeWidth="2"
          fill="none"
          opacity=".8"
        />
        <rect x="292" y="364" width="42" height="8" rx="2" fill="#2a2420" />
        <circle
          cx="313"
          cy="360"
          r="9"
          fill={flags.button2 ? "#58a868" : "#c0412f"}
        />
        <circle cx="310" cy="357" r="2.4" fill="#fff" opacity=".4" />
        {[
          [276, 340, 3],
          [352, 316, 2.4],
          [336, 280, 3.4],
          [268, 296, 2],
        ].map(([cx, cy, r]) => (
          <circle
            key={cx}
            className="eg-bubble"
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#d7f1fa"
            opacity=".6"
          />
        ))}
        <path
          d="M262 270L300 232M270 320L250 340"
          stroke="#fff"
          strokeOpacity=".16"
          strokeWidth="5"
        />
        <rect
          x="244"
          y="228"
          width="138"
          height="148"
          fill="none"
          stroke="#9fcfe2"
          strokeWidth="3"
        />
        <rect x="238" y="222" width="150" height="9" rx="2" fill="#56646c" />
        <rect x="238" y="374" width="150" height="8" rx="2" fill="#56646c" />
      </Hot>
    </>
  );
}

// ===== 部屋の中央：テーブルとカーペット =====

function CenterScene({ state, onTap }: SceneProps) {
  const { flags } = state;
  const open = trapOpen(state);
  const lamps = [flags.button1, flags.button2, flags.button3];

  const table = (y: number) => (
    <g>
      <rect
        x="112"
        y={y + 10}
        width="190"
        height="200"
        rx="12"
        fill="#000"
        opacity=".35"
      />
      <rect
        x="105"
        y={y}
        width="190"
        height="200"
        rx="12"
        fill="#9c6c3e"
        stroke="#5d3c22"
        strokeWidth="3"
      />
      {[40, 80, 120, 160].map((dy) => (
        <path
          key={dy}
          d={`M120 ${y + dy}q80-8 160 0`}
          stroke="#7b5230"
          strokeWidth="2"
          fill="none"
        />
      ))}
    </g>
  );

  return (
    <>
      <rect width="400" height="500" fill="#6b4a30" />
      {Array.from({ length: 10 }, (_, i) => (
        <g key={i} stroke="#3d2819" strokeOpacity=".6" strokeWidth="1.5">
          <path d={`M${i * 44 + 2} 0V500`} />
          <path d={`M${i * 44 + 2} ${(i % 3) * 150 + 90}h44`} />
        </g>
      ))}

      {flags.carpetMoved ? (
        <>
          {/* 床の扉 */}
          <Hot
            label="床の扉"
            onTap={() => {
              onTap("trapdoor");
            }}
          >
            <rect
              x="96"
              y="150"
              width="208"
              height="262"
              rx="4"
              fill="#3a3a3d"
            />
            <rect x="106" y="160" width="188" height="54" fill="#2a2420" />
            <text
              x="200"
              y="182"
              fontSize="14"
              fontWeight="700"
              fill="#d9cfae"
              textAnchor="middle"
            >
              ３つのボタンを押せ
            </text>
            {lamps.map((on, i) => (
              <g key={i}>
                {on && (
                  <circle
                    cx={166 + i * 34}
                    cy="200"
                    r="11"
                    fill="#ffd36b"
                    opacity=".35"
                  />
                )}
                <circle
                  cx={166 + i * 34}
                  cy="200"
                  r="6.5"
                  fill={on ? "#ffd36b" : "#1a1512"}
                  stroke="#8d8275"
                />
              </g>
            ))}
            {open ? (
              <>
                <rect x="106" y="222" width="188" height="180" fill="#070504" />
                <path
                  d="M150 222L164 402M250 222L236 402"
                  stroke="#8a5a2c"
                  strokeWidth="6"
                />
                {[250, 290, 330, 370].map((y, i) => (
                  <path
                    key={y}
                    d={`M${153 + i * 3} ${y}H${247 - i * 3}`}
                    stroke="#8a5a2c"
                    strokeWidth="5"
                    opacity={1 - i * 0.2}
                  />
                ))}
              </>
            ) : (
              <>
                <rect x="106" y="222" width="188" height="180" fill="#5a4030" />
                {[152, 200, 248].map((x) => (
                  <path
                    key={x}
                    d={`M${x} 222V402`}
                    stroke="#2c1c11"
                    strokeWidth="2"
                  />
                ))}
                <rect x="106" y="240" width="188" height="10" fill="#3a3a3d" />
                <rect x="106" y="374" width="188" height="10" fill="#3a3a3d" />
                <circle
                  cx="200"
                  cy="312"
                  r="13"
                  fill="none"
                  stroke="#b9bec2"
                  strokeWidth="4"
                />
              </>
            )}
          </Hot>
          {/* 巻いたカーペット */}
          <Hot
            label="カーペット"
            onTap={() => {
              onTap("carpet");
            }}
          >
            <rect
              x="18"
              y="120"
              width="52"
              height="330"
              rx="26"
              fill="#7c2a26"
              stroke="#4d1715"
              strokeWidth="2"
            />
            <path
              d="M30 140V430M56 140V430"
              stroke="#c69c6d"
              strokeWidth="2"
              strokeDasharray="6 8"
            />
            <ellipse cx="44" cy="446" rx="22" ry="8" fill="#5e1f1c" />
            <path
              d="M32 446a12 4 0 1 0 24 0a8 3 0 1 0-16 0"
              stroke="#c69c6d"
              fill="none"
            />
          </Hot>
          {/* ずらしたテーブル */}
          <Hot
            label="テーブル"
            onTap={() => {
              onTap("table");
            }}
          >
            <g transform="translate(64 0)">{table(-84)}</g>
          </Hot>
        </>
      ) : (
        <>
          <Hot
            label="カーペット"
            onTap={() => {
              onTap("carpet");
            }}
          >
            <rect
              x="44"
              y="96"
              width="312"
              height="348"
              rx="5"
              fill="#7c2a26"
              stroke="#4d1715"
              strokeWidth="3"
            />
            <rect
              x="58"
              y="110"
              width="284"
              height="320"
              fill="none"
              stroke="#c69c6d"
              strokeWidth="2.5"
            />
            <rect
              x="68"
              y="120"
              width="264"
              height="300"
              fill="none"
              stroke="#c69c6d"
              strokeWidth="1"
              strokeDasharray="8 6"
            />
            {Array.from({ length: 16 }, (_, i) => (
              <g key={i} stroke="#c69c6d" strokeWidth="2">
                <path d={`M${52 + i * 19.6} 86v10`} />
                <path d={`M${52 + i * 19.6} 444v10`} />
              </g>
            ))}
          </Hot>
          <Hot
            label="テーブル"
            onTap={() => {
              onTap("table");
            }}
          >
            {table(170)}
          </Hot>
        </>
      )}
    </>
  );
}

// ===== 天井 =====

function CeilingScene({ state, onTap }: SceneProps) {
  const ladder = state.flags.ladderDown;
  return (
    <>
      <rect width="400" height="500" fill="#3b2c22" />
      {Array.from({ length: 8 }, (_, i) => (
        <path
          key={i}
          d={`M${i * 57 + 2} 0V500`}
          stroke="#22170f"
          strokeWidth="2"
        />
      ))}
      <rect x="-400" y="70" width="1200" height="30" fill="#261a12" />
      <rect x="-400" y="410" width="1200" height="30" fill="#261a12" />

      {/* 吊り下がった灯り */}
      <circle
        className="eg-glow"
        cx="84"
        cy="258"
        r="92"
        fill="#ffcf7a"
        opacity=".2"
      />
      <circle cx="84" cy="258" r="38" fill="#6b5a3a" />
      <circle cx="84" cy="258" r="30" fill="#ffe2a6" />
      <circle cx="84" cy="258" r="12" fill="#fff6dc" />

      {/* 天井にぽっかり開いた穴。上の階がのぞく */}
      <Hot
        label="天井の穴"
        onTap={() => {
          onTap("hatch");
        }}
      >
        <rect x="162" y="168" width="156" height="156" fill="#1f1510" />
        <rect x="174" y="180" width="132" height="132" fill="#17191b" />
        <path d="M174 180H306L290 198H190Z" fill="#4a3829" />
        <path d="M174 180L190 198V296L174 312Z" fill="#32251b" />
        <path d="M306 180L290 198V296L306 312Z" fill="#32251b" />
        <path d="M174 312H306L290 296H190Z" fill="#261a12" />
        <path d="M190 222H290" stroke="#6b4a30" strokeWidth="7" />
        <path d="M190 220H290" stroke="#8a6442" strokeWidth="2" />
        <ellipse
          className="eg-glow"
          cx="240"
          cy="262"
          rx="46"
          ry="30"
          fill="#ff5a1e"
          opacity=".3"
        />
        {ladder && (
          <>
            <path
              d="M204 298L138 500M276 298L342 500"
              stroke="#d2bd8c"
              strokeWidth="4"
            />
            <path
              d="M204 298L138 500M276 298L342 500"
              stroke="#8f7a52"
              strokeWidth="4"
              strokeDasharray="3 5"
            />
            {[322, 358, 402, 454].map((y, i) => {
              const spread = (y - 298) * 0.327;
              return (
                <path
                  key={y}
                  d={`M${200 - spread} ${y}H${280 + spread}`}
                  stroke="#8a5a2c"
                  strokeWidth={5 + i * 1.4}
                  strokeLinecap="round"
                />
              );
            })}
          </>
        )}
      </Hot>
    </>
  );
}

// ===== 下の階：ふたつの植物 =====

/** 鉄棘樹の葉。根元から放射状に伸びる */
const BLADES = [
  [-82, 150],
  [-62, 200],
  [-44, 236],
  [-28, 262],
  [-12, 282],
  [4, 290],
  [20, 270],
  [36, 244],
  [52, 214],
  [68, 176],
  [84, 140],
] as const;

function Tree({ dead }: { dead: boolean }) {
  const baseX = 318;
  const baseY = 446;
  return (
    <g>
      <ellipse
        cx={baseX}
        cy={baseY + 4}
        rx="70"
        ry="10"
        fill="#000"
        opacity=".4"
      />
      {BLADES.map(([angle, length], i) => {
        const a = ((dead ? angle * 1.12 : angle) * Math.PI) / 180;
        const l = dead ? length * 0.5 : length;
        const tipX = baseX + Math.sin(a) * l;
        const tipY = baseY - Math.cos(a) * l * (dead ? 0.55 : 1);
        const nx = Math.cos(a) * 9;
        const ny = Math.sin(a) * 9;
        const left = `${baseX - nx} ${baseY - ny}`;
        const right = `${baseX + nx} ${baseY + ny}`;
        const dark = i % 2 === 0;
        return (
          <g key={angle}>
            <path
              d={`M${left}L${tipX} ${tipY}L${right}Z`}
              fill={
                dead
                  ? dark
                    ? "#5c4a30"
                    : "#6d5838"
                  : dark
                    ? "#2b463f"
                    : "#3a5a50"
              }
              stroke={dead ? "#3d3020" : "#1b2e29"}
              strokeWidth="1"
            />
            {!dead && (
              <path
                d={`M${left}L${tipX} ${tipY}L${right}`}
                stroke="#e6efe6"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeDasharray=".1 9"
                fill="none"
              />
            )}
          </g>
        );
      })}
    </g>
  );
}

function BasementScene({ state, onTap }: SceneProps) {
  const { flags } = state;
  const petals = [0, 60, 120, 180, 240, 300];
  return (
    <>
      <defs>
        <radialGradient id="eg-maw">
          <stop offset="0" stopColor="#000" />
          <stop offset=".7" stopColor="#12070a" />
          <stop offset="1" stopColor="#3a1216" />
        </radialGradient>
      </defs>
      <rect width="400" height="372" fill="#27302b" />
      {[62, 124, 186, 248, 310].map((y, row) => (
        <g key={y} stroke="#161c19" strokeWidth="2">
          <path d={`M0 ${y}H400`} />
          {[0, 80, 160, 240, 320, 400].map((x) => (
            <path key={x} d={`M${x + (row % 2) * 40} ${y - 62}V${y}`} />
          ))}
        </g>
      ))}
      <rect y="372" width="400" height="128" fill="#1b211d" />
      <path d="M-400 372H800" stroke="#0e1210" strokeWidth="3" />

      {/* 奥へ続く通路と、壁の鍵 */}
      <path d="M246 372V150Q318 96 392 150V372Z" fill="#0e1210" />
      {!state.taken.includes("key") && (
        <Hot
          label="壁の鍵"
          onTap={() => {
            onTap("wall-key");
          }}
        >
          <Hit x={296} y={150} width={48} height={72} />
          <circle cx="320" cy="160" r="3" fill="#8f9396" />
          <circle
            cx="320"
            cy="176"
            r="10"
            fill="none"
            stroke="#e2bd5f"
            strokeWidth="4.5"
          />
          <path
            d="M320 186V214M320 202h8M320 210h7"
            stroke="#e2bd5f"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <circle
            className="eg-twinkle"
            cx="328"
            cy="170"
            r="2.5"
            fill="#fff"
          />
        </Hot>
      )}

      {/* はしご */}
      <Hot
        label="上へ戻るはしご"
        onTap={() => {
          onTap("ladder-up");
        }}
      >
        <Hit x={166} y={0} width={68} height={376} />
        <path d="M150 0h100l-14 26h-72Z" fill="#ffcf7a" opacity=".3" />
        <path d="M178 0V376M222 0V376" stroke="#8a5a2c" strokeWidth="7" />
        {[30, 76, 122, 168, 214, 260, 306, 352].map((y) => (
          <path
            key={y}
            d={`M178 ${y}H222`}
            stroke="#8a5a2c"
            strokeWidth="5.5"
          />
        ))}
      </Hot>

      {/* 喰獄花 */}
      <Hot
        label="大きな花"
        onTap={() => {
          onTap("flower");
        }}
      >
        <ellipse cx="88" cy="452" rx="74" ry="10" fill="#000" opacity=".4" />
        {!flags.bombDisposed &&
          [52, 88, 124].map((x, i) => (
            <path
              key={x}
              className="eg-stink"
              style={{ animationDelay: `${i * 0.7}s` }}
              d={`M${x} 286q-8-10 0-20t0-20`}
              stroke="#8f9a52"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          ))}
        {petals.map((angle) => (
          <g key={angle} transform={`rotate(${angle} 88 372)`}>
            <ellipse
              cx="88"
              cy="322"
              rx="36"
              ry="33"
              fill="#6e1c22"
              stroke="#2a0b0e"
              strokeWidth="2"
            />
            <circle cx="76" cy="312" r="5" fill="#1c090b" />
            <circle cx="100" cy="306" r="3.5" fill="#1c090b" />
            <circle cx="94" cy="326" r="4" fill="#1c090b" />
            <path
              d="M70 300q18-10 36 0"
              stroke="#a8434a"
              strokeWidth="2"
              fill="none"
              opacity=".6"
            />
          </g>
        ))}
        <circle
          cx="88"
          cy="372"
          r={flags.bombDisposed ? 16 : 31}
          fill="url(#eg-maw)"
        />
        {Array.from({ length: 14 }, (_, i) => (
          <path
            key={i}
            d="M88 338v9"
            stroke="#c9b2a8"
            strokeWidth="1.4"
            opacity={flags.bombDisposed ? 0 : 0.7}
            transform={`rotate(${i * 25.7} 88 372)`}
          />
        ))}
        <path
          d="M54 436v10M112 440v8"
          stroke="#6e1c22"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </Hot>

      {/* 鉄棘樹 */}
      <Hot
        label="棘の植物"
        onTap={() => {
          onTap("tree");
        }}
      >
        <Tree dead={flags.treeDead} />
      </Hot>
    </>
  );
}

// ===== 上の階：煮えたぎる槽 =====

function AtticScene({ state, onTap }: SceneProps) {
  const hasBomb = !state.taken.includes("bomb");
  return (
    <>
      <defs>
        <radialGradient id="eg-magma">
          <stop offset="0" stopColor="#ffd24a" />
          <stop offset=".55" stopColor="#ff7a1e" />
          <stop offset="1" stopColor="#c6260f" />
        </radialGradient>
        <linearGradient id="eg-shaft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c1614" />
          <stop offset="1" stopColor="#7a2410" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="#2e3033" />
      {[100, 200].map((y) => (
        <path key={y} d={`M0 ${y}H400`} stroke="#1f2123" strokeWidth="2" />
      ))}
      <rect y="300" width="400" height="200" fill="#222426" />
      <path d="M-400 300H800" stroke="#141617" strokeWidth="3" />

      {/* 配管 */}
      <rect x="-400" y="52" width="1200" height="16" fill="#6b4a30" />
      <rect x="-400" y="52" width="1200" height="5" fill="#8a6442" />
      <rect x="318" y="60" width="16" height="240" fill="#6b4a30" />
      {[40, 150, 260].map((x) => (
        <rect
          key={x}
          x={x}
          y="48"
          width="10"
          height="24"
          rx="2"
          fill="#4a3220"
        />
      ))}
      <circle
        cx="326"
        cy="140"
        r="15"
        fill="none"
        stroke="#a23b2c"
        strokeWidth="5"
      />
      <path d="M311 140h30M326 125v30" stroke="#a23b2c" strokeWidth="3" />

      {/* 深さを示す表示板 */}
      <rect x="112" y="108" width="150" height="74" rx="4" fill="#e9c53a" />
      <rect
        x="112"
        y="108"
        width="150"
        height="74"
        rx="4"
        fill="none"
        stroke="#1c1a19"
        strokeWidth="4"
      />
      {[124, 148, 172, 196, 220, 244].map((x) => (
        <path key={x} d={`M${x} 182l-10-12h10l10 12Z`} fill="#1c1a19" />
      ))}
      <text
        x="187"
        y="134"
        fontSize="15"
        fontWeight="700"
        fill="#1c1a19"
        textAnchor="middle"
      >
        溶融槽
      </text>
      <text
        x="187"
        y="160"
        fontSize="19"
        fontWeight="700"
        fill="#a11a17"
        textAnchor="middle"
      >
        深さ ５ｍ
      </text>

      {/* 降り口。縄ばしごを床の金具に掛けてある */}
      <Hot
        label="下へ降りる縄ばしご"
        onTap={() => {
          onTap("ladder-down");
        }}
      >
        <Hit x={4} y={296} width={100} height={62} />
        <path
          d="M22 318H88L98 352H10Z"
          fill="#070504"
          stroke="#141617"
          strokeWidth="3"
        />
        <path d="M38 312V350M74 312V350" stroke="#d2bd8c" strokeWidth="3.5" />
        <path
          d="M38 312V350M74 312V350"
          stroke="#8f7a52"
          strokeWidth="3.5"
          strokeDasharray="3 5"
        />
        <path
          d="M38 330H74M38 344H74"
          stroke="#8a5a2c"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <circle
          cx="38"
          cy="310"
          r="5"
          fill="none"
          stroke="#8f9396"
          strokeWidth="3"
        />
        <circle
          cx="74"
          cy="310"
          r="5"
          fill="none"
          stroke="#8f9396"
          strokeWidth="3"
        />
      </Hot>

      <Hot
        label="煮えたぎる槽"
        onTap={() => {
          onTap("boiler");
        }}
      >
        {/* マグマの照り返し */}
        <ellipse
          className="eg-glow"
          cx="225"
          cy="330"
          rx="220"
          ry="170"
          fill="#ff5a1e"
          opacity=".2"
        />
        {/* 床に口を開けた槽。ふちの石、内側の壁、ずっと下のマグマ */}
        <ellipse cx="225" cy="408" rx="168" ry="82" fill="#5d5753" />
        <ellipse cx="225" cy="406" rx="168" ry="80" fill="#77706a" />
        <ellipse cx="225" cy="412" rx="148" ry="66" fill="url(#eg-shaft)" />
        {/* 内壁の継ぎ目とはしご状の目盛り。深さを感じさせる */}
        {[0.84, 0.7, 0.58].map((k, i) => (
          <ellipse
            key={k}
            cx="225"
            cy={412 + i * 9 + 9}
            rx={148 * k}
            ry={66 * k}
            fill="none"
            stroke="#0f0b0a"
            strokeOpacity=".55"
            strokeWidth="2"
          />
        ))}
        <ellipse cx="225" cy="446" rx="74" ry="27" fill="url(#eg-magma)" />
        <path
          d="M176 446q10-9 26-5q-5 9-16 10ZM236 436q16-4 30 4q-13 7-25 2ZM208 458q14 4 32 1q-8 8-22 6Z"
          fill="#5a1208"
          opacity=".8"
        />
        {hasBomb && (
          <g opacity=".8">
            <rect
              x="215"
              y="442"
              width="22"
              height="10"
              rx="1.5"
              fill="#2a0c06"
            />
            <circle cx="226" cy="447" r="3" fill="#ffb37a" />
          </g>
        )}
        {[
          [190, 452, 4],
          [214, 438, 3],
          [246, 454, 5],
          [268, 446, 3.5],
        ].map(([cx, cy, r], i) => (
          <circle
            key={cx}
            className="eg-boil"
            style={{ animationDelay: `${i * 0.23}s` }}
            cx={cx}
            cy={cy}
            r={r}
            fill="#ffe38a"
            opacity=".9"
          />
        ))}
        {/* 舞い上がる火の粉 */}
        {[
          [150, 330],
          [196, 280],
          [236, 320],
          [272, 262],
          [304, 326],
        ].map(([cx, cy], i) => (
          <circle
            key={cx}
            className="eg-ember"
            style={{ animationDelay: `${i * 0.5}s` }}
            cx={cx}
            cy={cy}
            r="2.4"
            fill="#ffb347"
          />
        ))}
      </Hot>
    </>
  );
}

/** 場面の外側（縦長・横長の画面で余る部分）を塗る色。上側の色・下側の色・境目の高さ */
const BLEED: Record<View, [string, string, number]> = {
  north: ["#4b382c", "#7a5436", 380],
  east: ["#4b382c", "#7a5436", 380],
  south: ["#4b382c", "#7a5436", 380],
  west: ["#4b382c", "#7a5436", 380],
  center: ["#6b4a30", "#6b4a30", 250],
  ceiling: ["#3b2c22", "#3b2c22", 250],
  basement: ["#27302b", "#1b211d", 372],
  attic: ["#2e3033", "#222426", 300],
};

const SCENES: Record<View, (props: SceneProps) => ReactNode> = {
  north: NorthScene,
  east: EastScene,
  south: SouthScene,
  west: WestScene,
  center: CenterScene,
  ceiling: CeilingScene,
  basement: BasementScene,
  attic: AtticScene,
};

export function SceneArt({ state, onTap }: SceneProps) {
  const Scene = SCENES[state.view];
  const [top, bottom, split] = BLEED[state.view];
  return (
    <svg className="eg-art" viewBox="0 0 400 500">
      <rect x="-400" y="-400" width="1200" height={split + 400} fill={top} />
      <rect x="-400" y={split} width="1200" height="650" fill={bottom} />
      <Scene state={state} onTap={onTap} />
    </svg>
  );
}

// ===== アイテムの絵 =====

export function ItemArt({
  item,
  water = false,
}: {
  item: ItemId;
  water?: boolean;
}) {
  let body: ReactNode;
  switch (item) {
    case "letter":
      body = (
        <g transform="rotate(-6 24 24)">
          <rect
            x="6"
            y="10"
            width="36"
            height="28"
            rx="1.5"
            fill="#0d0d0f"
            stroke="#a52a24"
            strokeWidth="1.5"
          />
          <path
            d="M13 18h22M11 23h26M15 28h18M13 33h22"
            stroke="#f6f3ec"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path d="M2 8l10 6l-4 3Z M4 6l9 2l-2-6Z" fill="#c8201c" />
        </g>
      );
      break;
    case "pot":
      body = (
        <>
          <rect x="1" y="17" width="12" height="5" rx="2.5" fill="#3a3a3d" />
          <rect x="35" y="17" width="12" height="5" rx="2.5" fill="#3a3a3d" />
          <path
            d="M8 16h32v14a8 8 0 0 1-8 8H16a8 8 0 0 1-8-8Z"
            fill="#8f9396"
          />
          <path d="M8 16h32v6H8Z" fill="#b9bec2" />
          <ellipse
            cx="24"
            cy="16"
            rx="16"
            ry="4.5"
            fill={water ? "#58a9cc" : "#3a3a3d"}
          />
          {water && (
            <path
              d="M15 16q4-2 8 0t8 0"
              stroke="#d7f1fa"
              strokeWidth="1.2"
              fill="none"
            />
          )}
        </>
      );
      break;
    case "key":
      body = (
        <g transform="rotate(-35 24 24)">
          <circle
            cx="12"
            cy="24"
            r="8"
            fill="none"
            stroke="#e2bd5f"
            strokeWidth="4.5"
          />
          <path
            d="M20 24H44M36 24v8M42 24v6"
            stroke="#e2bd5f"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </g>
      );
      break;
    case "bomb":
      body = (
        <>
          <rect
            x="5"
            y="14"
            width="38"
            height="26"
            rx="3"
            fill="#2a2c2e"
            stroke="#8f9396"
            strokeWidth="1.5"
          />
          <circle
            cx="18"
            cy="27"
            r="9"
            fill="#f6f3ec"
            stroke="#141617"
            strokeWidth="1.5"
          />
          <path
            d="M18 27V20.5M18 27l4.5 2.5"
            stroke="#141617"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M27 24q7-12 12-2"
            stroke="#e8382e"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M27 30q8 10 12 0"
            stroke="#46b0f2"
            strokeWidth="2"
            fill="none"
          />
          <rect x="32" y="20" width="8" height="14" rx="1.5" fill="#a23b2c" />
        </>
      );
      break;
    default:
      body = (
        <g transform="translate(6 2)">
          <Jar pill={item} x={0} y={0} />
        </g>
      );
  }
  return (
    <svg className="eg-item-art" viewBox="0 0 48 48" aria-hidden="true">
      {body}
    </svg>
  );
}

/** 効果中の錠剤を示す小さな印 */
export function PillMark({ pill }: { pill: PillId }) {
  return (
    <svg viewBox="-1.2 -1.2 2.4 2.4" width="14" height="14" aria-hidden="true">
      <PillShape pill={pill} cx={0} cy={0} r={1} />
    </svg>
  );
}

/** オープニングの、テーブルに置かれた封筒 */
export function EnvelopeArt() {
  return (
    <svg className="eg-envelope-art" viewBox="0 0 240 170" aria-hidden="true">
      <ellipse cx="120" cy="150" rx="104" ry="12" fill="#000" opacity=".45" />
      <g transform="rotate(-4 120 85)">
        <rect
          x="30"
          y="34"
          width="180"
          height="110"
          rx="3"
          fill="#0d0d0f"
          stroke="#3a3a3d"
          strokeWidth="2"
        />
        <path
          d="M30 36L120 100L210 36"
          stroke="#3a3a3d"
          strokeWidth="2"
          fill="none"
        />
        <path d="M112 30h16v118h-16Z" fill="#b9211d" />
        <path d="M30 82h180v14H30Z" fill="#c8201c" />
        <path
          d="M120 89C96 60 76 66 84 82C90 92 108 92 120 89C132 92 150 92 156 82C164 66 144 60 120 89Z"
          fill="#e0342c"
        />
        <path
          d="M112 92L98 124L110 118L116 130L122 94ZM128 92L142 124L130 118L126 130Z"
          fill="#b9211d"
        />
        <circle cx="120" cy="89" r="6" fill="#a11a17" />
      </g>
    </svg>
  );
}
