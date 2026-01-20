// 脱出ゲーム「やまーたからの挑戦状」の型定義

// エリアの種類
export type AreaType =
  | "room" // メイン部屋（間取り図）
  | "table" // テーブル
  | "kitchen" // キッチン
  | "fireplace" // 暖炉
  | "tank" // 水槽
  | "statue" // 像
  | "shelf" // 棚
  | "door" // ドア
  | "ceiling" // 天井
  | "lower" // 下の階
  | "upper"; // 上の階

// アイテムの種類
export type ItemType =
  | "message" // メッセージ（手紙）
  | "pill_purple" // 紫の錠剤（チカラモーチ）
  | "pill_white" // 白い錠剤（ドクガアール）
  | "pill_red" // 赤い錠剤（アツクナーイ）
  | "pill_yellow" // 黄色い錠剤（タカクトーブ）
  | "pill_blue" // 青い錠剤（オボレナーイ）
  | "cooking_tools" // 調理器具
  | "locked_box" // 3桁錠のついた箱
  | "key" // 鍵
  | "bomb"; // 爆弾

// アイテムの状態
export interface ItemState {
  id: ItemType;
  name: string;
  obtained: boolean;
  used: boolean;
}

// 錠剤の効果
export interface PillEffect {
  type: ItemType;
  name: string;
  description: string;
  expiresAt: number | null; // タイムスタンプ（1分後）
}

// ゲームのフラグ
export interface GameFlags {
  // メッセージ関連
  messageRead: boolean;
  timerStarted: boolean;

  // ボタン関連
  button1Pressed: boolean; // 暖炉のボタン
  button2Pressed: boolean; // 水槽のボタン
  button3Pressed: boolean; // 像のボタン

  // 暖炉関連
  fireExtinguished: boolean; // 火を消した
  waterInPot: boolean; // 鍋に水を汲んだ

  // 棚関連
  boxOpened: boolean; // 3桁錠の箱を開けた

  // カーペット関連
  carpetRemoved: boolean; // カーペットをめくった
  trapdoorUnlocked: boolean; // 3つのボタンで地下への扉が開いた

  // 天井関連
  ceilingHoleOpened: boolean; // 天井に穴を開けた

  // 下の階
  lowerFloorAccessible: boolean; // 下の階に行ける
  dickiaWithered: boolean; // ディッキアを枯らした
  dickiaPathCleared: boolean; // ディッキアの道を切り開いた
  keyObtained: boolean; // 鍵を入手

  // 上の階
  upperFloorAccessible: boolean; // 上の階に行ける
  bombObtained: boolean; // 爆弾を入手
  bombDisarmed: boolean; // 爆弾を解除（ラフレシアに投げ込んだ）

  // 錠剤の使用履歴
  pillPurpleUsed: boolean;
  pillWhiteUsed: boolean;
  pillRedUsed: boolean;
  pillYellowUsed: boolean;
  pillBlueUsed: boolean;
}

// ゲームの状態
export type GameStatus =
  | "title" // タイトル画面
  | "caution" // 注意事項
  | "opening" // オープニング
  | "playing" // プレイ中
  | "bad_end_1" // BAD END① - 時間切れ
  | "bad_end_2" // BAD END② - 酸素切れ
  | "normal_end" // NORMAL END - 生還
  | "true_end"; // TRUE END - クリア

// 錠剤効果の種類
export type PillEffectType =
  | "purple"
  | "white"
  | "red"
  | "yellow"
  | "blue"
  | null;

// ゲーム全体の状態
export interface GameState {
  status: GameStatus;
  currentArea: AreaType;
  items: Record<ItemType, ItemState>;
  flags: GameFlags;
  activePillEffects: PillEffect[];
  activePillEffect: PillEffectType; // 現在有効な錠剤効果（コンピューテッド）
  timerStartTime: number | null; // タイマー開始時刻
  remainingTime: number; // 残り時間（秒）
  selectedItem: ItemType | null; // 選択中のアイテム
  showingBook: string | null; // 表示中の本（"plant" | "manual" | "mystery" | null）
  dialogMessage: string | null; // ダイアログメッセージ
}

// アクションの種類
export type GameAction =
  | { type: "START_GAME" }
  | { type: "SHOW_CAUTION" }
  | { type: "SHOW_OPENING" }
  | { type: "START_TIMER" }
  | { type: "TICK_TIMER" }
  | { type: "CHANGE_AREA"; area: AreaType }
  | { type: "OBTAIN_ITEM"; item: ItemType }
  | { type: "USE_ITEM"; item: ItemType; target?: string }
  | { type: "SELECT_ITEM"; item: ItemType | null }
  | { type: "PRESS_BUTTON"; button: 1 | 2 | 3 }
  | { type: "OPEN_BOX"; code: string }
  | { type: "REMOVE_CARPET" }
  | { type: "EXTINGUISH_FIRE" }
  | { type: "FILL_WATER" }
  | { type: "OPEN_CEILING_HOLE" }
  | { type: "CLEAR_DICKIA_PATH" }
  | { type: "WITHER_DICKIA" }
  | { type: "DISARM_BOMB" }
  | { type: "USE_KEY" }
  | { type: "SHOW_BOOK"; book: string | null }
  | { type: "SHOW_DIALOG"; message: string | null }
  | { type: "GAME_OVER"; ending: GameStatus }
  | { type: "TRIGGER_BAD_END"; payload: "poison" | "time" }
  | { type: "RESET_GAME" };

// 初期アイテム状態
export const initialItems: Record<ItemType, ItemState> = {
  message: { id: "message", name: "メッセージ", obtained: false, used: false },
  pill_purple: {
    id: "pill_purple",
    name: "紫の錠剤",
    obtained: false,
    used: false,
  },
  pill_white: {
    id: "pill_white",
    name: "白い錠剤",
    obtained: false,
    used: false,
  },
  pill_red: { id: "pill_red", name: "赤い錠剤", obtained: false, used: false },
  pill_yellow: {
    id: "pill_yellow",
    name: "黄色い錠剤",
    obtained: false,
    used: false,
  },
  pill_blue: {
    id: "pill_blue",
    name: "青い錠剤",
    obtained: false,
    used: false,
  },
  cooking_tools: {
    id: "cooking_tools",
    name: "調理器具",
    obtained: false,
    used: false,
  },
  locked_box: {
    id: "locked_box",
    name: "3桁錠のついた箱",
    obtained: false,
    used: false,
  },
  key: { id: "key", name: "鍵", obtained: false, used: false },
  bomb: { id: "bomb", name: "爆弾", obtained: false, used: false },
};

// 初期フラグ状態
export const initialFlags: GameFlags = {
  messageRead: false,
  timerStarted: false,
  button1Pressed: false,
  button2Pressed: false,
  button3Pressed: false,
  fireExtinguished: false,
  waterInPot: false,
  boxOpened: false,
  carpetRemoved: false,
  trapdoorUnlocked: false,
  ceilingHoleOpened: false,
  lowerFloorAccessible: false,
  dickiaWithered: false,
  dickiaPathCleared: false,
  keyObtained: false,
  upperFloorAccessible: false,
  bombObtained: false,
  bombDisarmed: false,
  pillPurpleUsed: false,
  pillWhiteUsed: false,
  pillRedUsed: false,
  pillYellowUsed: false,
  pillBlueUsed: false,
};

// 初期ゲーム状態
export const initialGameState: GameState = {
  status: "title",
  currentArea: "room",
  items: initialItems,
  flags: initialFlags,
  activePillEffects: [],
  activePillEffect: null,
  timerStartTime: null,
  remainingTime: 60 * 60, // 60分 = 3600秒
  selectedItem: null,
  showingBook: null,
  dialogMessage: null,
};

// 錠剤の情報
export const pillInfo: Record<
  string,
  { name: string; effect: string; number: number }
> = {
  pill_purple: { name: "チカラモーチ", effect: "筋力が10倍になる", number: 3 },
  pill_white: {
    name: "ドクガアール",
    effect: "毒を帯びる。死後は無毒化",
    number: 0,
  },
  pill_red: { name: "アツクナーイ", effect: "熱さ耐性を得る", number: 2 },
  pill_yellow: {
    name: "タカクトーブ",
    effect: "高くジャンプできる",
    number: 10,
  },
  pill_blue: { name: "オボレナーイ", effect: "溺れずに深く潜れる", number: 7 },
};
