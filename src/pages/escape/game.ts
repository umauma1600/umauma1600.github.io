// 脱出ゲーム「やまーたからの挑戦状」の進行ロジック
// 画面に依存しない純粋な状態遷移だけをここに置く

/** 爆弾が爆発するまでの時間 */
export const BOMB_MS = 20 * 60 * 1000;
/** 爆弾を処理しても、密室の空気が尽きる時間 */
export const AIR_MS = 25 * 60 * 1000;
/** 錠剤の効果時間 */
export const PILL_MS = 60 * 1000;
/** 棚の箱の3桁錠 */
export const BOX_CODE = "246";

export type Wall = "north" | "east" | "south" | "west";
export type View = Wall | "center" | "ceiling" | "basement" | "attic";
export type PillId = "red" | "yellow" | "white" | "blue" | "purple";
export type ItemId = "letter" | "pot" | "key" | "bomb" | PillId;
export type DocId = "plant" | "manual" | "mystery" | "pills";
export type Ending =
  | "explosion"
  | "suffocation"
  | "thorn"
  | "poison"
  | "normal"
  | "true";
export type Phase = "title" | "opening" | "playing" | "ending";

/** 場面の中でタップできるもの */
export type Target =
  | "fire"
  | "statue"
  | "jar-blue"
  | "fan"
  | "sink"
  | "stove"
  | "cupboard"
  | "pot"
  | "jar-white"
  | "door"
  | "jar-purple"
  | "jar-red"
  | "jar-yellow"
  | "tank"
  | "table"
  | "carpet"
  | "trapdoor"
  | "hatch"
  | "tree"
  | "wall-key"
  | "flower"
  | "ladder-up"
  | "boiler"
  | "ladder-down";

export type ChoiceId = "dive" | "thorn" | "leave" | "wait" | "cancel";

export interface Choice {
  id: ChoiceId;
  label: string;
  danger?: boolean;
}

export interface Dialog {
  text: string;
  /** 手に入れたアイテム（絵を添える） */
  got?: ItemId;
  choices?: Choice[];
}

export interface Flags {
  fireOut: boolean;
  button1: boolean;
  button2: boolean;
  button3: boolean;
  carpetMoved: boolean;
  boxOpen: boolean;
  ladderDown: boolean;
  treeDead: boolean;
  bombDisposed: boolean;
  airWarned: boolean;
}

export interface GameState {
  phase: Phase;
  ending: Ending | null;
  view: View;
  /** 最後に見ていた壁（中央・天井から戻る先） */
  wall: Wall;
  /** プレイ中に経過した時間(ms)。画面を閉じている間は進まない */
  elapsed: number;
  items: ItemId[];
  /** これまでに手に入れたことのあるもの（置いてあった場所を空にする） */
  taken: ItemId[];
  selected: ItemId | null;
  potWater: boolean;
  docs: DocId[];
  /** 錠剤の効果が切れる時刻（elapsed 基準） */
  effects: Partial<Record<PillId, number>>;
  flags: Flags;
  dialog: Dialog | null;
  /** 「少し前からやり直す」で戻る状態 */
  checkpoint: GameState | null;
}

export type Action =
  | { type: "start" }
  | { type: "readLetter" }
  | { type: "load"; state: GameState }
  | { type: "tick"; delta: number }
  | { type: "look"; view: View }
  | { type: "tap"; target: Target }
  | { type: "choose"; id: ChoiceId }
  | { type: "select"; item: ItemId | null }
  | { type: "drink"; pill: PillId }
  | { type: "readDoc"; doc: DocId }
  | { type: "openBox" }
  | { type: "closeDialog" }
  | { type: "askWait" }
  | { type: "retry" }
  | { type: "reset" };

export const PILLS: readonly PillId[] = [
  "red",
  "yellow",
  "white",
  "blue",
  "purple",
];

export function isPill(item: ItemId): item is PillId {
  return (PILLS as readonly string[]).includes(item);
}

export const ITEM_NAMES: Record<ItemId, string> = {
  letter: "手紙",
  pot: "鍋",
  key: "鍵",
  bomb: "時限爆弾",
  red: "赤い錠剤",
  yellow: "黄色い錠剤",
  white: "白い錠剤",
  blue: "青い錠剤",
  purple: "紫の錠剤",
};

export const initialState: GameState = {
  phase: "title",
  ending: null,
  view: "west",
  wall: "west",
  elapsed: 0,
  items: [],
  taken: [],
  selected: null,
  potWater: false,
  docs: [],
  effects: {},
  flags: {
    fireOut: false,
    button1: false,
    button2: false,
    button3: false,
    carpetMoved: false,
    boxOpen: false,
    ladderDown: false,
    treeDead: false,
    bombDisposed: false,
    airWarned: false,
  },
  dialog: null,
  checkpoint: null,
};

// ===== 参照用のヘルパー =====

export function isActive(state: GameState, pill: PillId): boolean {
  const until = state.effects[pill];
  return until !== undefined && until > state.elapsed;
}

export function has(state: GameState, item: ItemId): boolean {
  return state.items.includes(item);
}

export function isWall(view: View): view is Wall {
  return (
    view === "north" || view === "east" || view === "south" || view === "west"
  );
}

export function trapOpen(state: GameState): boolean {
  const { button1, button2, button3 } = state.flags;
  return button1 && button2 && button3;
}

export function buttonCount(state: GameState): number {
  const { button1, button2, button3 } = state.flags;
  return [button1, button2, button3].filter(Boolean).length;
}

const WALL_ORDER: readonly Wall[] = ["north", "east", "south", "west"];

export function turn(wall: Wall, direction: 1 | -1): Wall {
  const index = WALL_ORDER.indexOf(wall);
  return WALL_ORDER[
    (index + direction + WALL_ORDER.length) % WALL_ORDER.length
  ];
}

// ===== 状態を書き換える小さな部品 =====

function say(state: GameState, text: string, extra?: Partial<Dialog>) {
  return { ...state, dialog: { text, ...extra } };
}

function setFlags(state: GameState, flags: Partial<Flags>): GameState {
  return { ...state, flags: { ...state.flags, ...flags } };
}

function gain(state: GameState, item: ItemId, text: string): GameState {
  return say(
    {
      ...state,
      items: [...state.items, item],
      taken: [...state.taken, item],
    },
    text,
    { got: item },
  );
}

function lose(state: GameState, item: ItemId): GameState {
  return {
    ...state,
    items: state.items.filter((i) => i !== item),
    selected: state.selected === item ? null : state.selected,
  };
}

function end(state: GameState, ending: Ending): GameState {
  return {
    ...state,
    phase: "ending",
    ending,
    dialog: null,
    selected: null,
  };
}

function pressButton(
  state: GameState,
  button: "button1" | "button2" | "button3",
  text: string,
): GameState {
  const next = setFlags(state, { [button]: true });
  const tail = trapOpen(next)
    ? "\n\n……部屋のどこかで、重いものが動く音がした。"
    : "";
  return say(next, text + tail);
}

const cancel: Choice = { id: "cancel", label: "やめておく" };

// ===== タップしたときの反応 =====

function tapJar(state: GameState, pill: PillId): GameState {
  if (state.taken.includes(pill)) return state;
  return gain(state, pill, `${ITEM_NAMES[pill]}の入った小瓶を手に入れた。`);
}

function tapFire(state: GameState): GameState {
  const { flags, selected } = state;
  if (flags.button1) {
    return say(state, "暖炉の奥のボタンは、もう押してある。");
  }
  if (flags.fireOut) {
    return pressButton(
      state,
      "button1",
      "灰の奥の壁にあるボタンを押した。カチッ、と手ごたえがあった。",
    );
  }
  if (selected === "pot") {
    if (!state.potWater) {
      return say(state, "鍋は空っぽだ。これでは火は消せない。");
    }
    return say(
      setFlags(
        { ...state, potWater: false, selected: null },
        { fireOut: true },
      ),
      "鍋の水をかけると、炎は音を立てて消えた。\n灰の奥の壁に、丸いボタンがある。",
    );
  }
  if (isActive(state, "red")) {
    return pressButton(
      state,
      "button1",
      "熱さをまったく感じない。\n炎の中に腕を差し入れ、奥の壁のボタンを押した。カチッ、と手ごたえがあった。",
    );
  }
  return say(
    state,
    "暖炉で炎が燃えている。\n炎の奥の壁に何かあるようだが、熱くてとても手を入れられない。",
  );
}

function tapStatue(state: GameState): GameState {
  if (state.flags.button3) {
    return say(state, "像はもう動かしてある。裏のボタンも押した。");
  }
  if (isActive(state, "purple")) {
    return pressButton(
      state,
      "button3",
      "体じゅうに力がみなぎっている。\n重い石像が、空き箱のように軽々と動いた。\n裏の壁にあったボタンを押した。カチッ、と手ごたえがあった。",
    );
  }
  return say(
    state,
    "ずっしりとした石の像。\n裏の壁に何かあるようだが、押しても引いてもびくともしない。",
  );
}

function tapTank(state: GameState): GameState {
  if (state.selected === "pot") {
    if (state.potWater) return say(state, "鍋にはもう水が入っている。");
    return say({ ...state, potWater: true }, "鍋で水槽の水をくんだ。");
  }
  if (state.flags.button2) {
    return say(state, "水槽の底のボタンは、もう押してある。");
  }
  return say(
    state,
    "高さ100センチほどの水槽。\n澄んだ水の底に、ボタンのようなものが見える。",
    { choices: [{ id: "dive", label: "水槽に入る" }, cancel] },
  );
}

function tapDoor(state: GameState): GameState {
  if (!has(state, "key")) {
    return say(
      state,
      "頑丈な扉。鍵がかかっている。\n扉と枠のあいだに隙間はなく、空気さえ通りそうにない。",
    );
  }
  if (state.flags.bombDisposed) return end(state, "true");
  if (has(state, "bomb")) {
    return say(
      state,
      "鍵は鍵穴にぴたりと合った。これで外に出られる。\n……けれど、時限爆弾を抱えたまま外に出るわけにはいかない。どこかで処理しなければ。",
    );
  }
  return say(
    state,
    "鍵は鍵穴にぴたりと合った。これで外に出られる。\n……けれど、時限爆弾はまだこの建物のどこかにある。",
    {
      choices: [
        { id: "leave", label: "このまま外に出る", danger: true },
        { id: "cancel", label: "まだ出ない" },
      ],
    },
  );
}

function tapCenter(state: GameState, target: Target): GameState {
  const { flags } = state;
  if (target === "trapdoor") {
    if (trapOpen(state)) return { ...state, view: "basement", dialog: null };
    return say(
      state,
      `床の扉は固く閉じている。\n「３つのボタンを押せ」と刻まれ、ランプが３つ並んでいる。\n（点灯 ${buttonCount(state)} / 3）`,
    );
  }
  if (flags.carpetMoved) {
    return say(
      state,
      target === "carpet"
        ? "めくったカーペット。裏には何もない。"
        : "部屋の中央にあったテーブル。脇にずらしてある。",
    );
  }
  if (target === "carpet") {
    const opened = trapOpen(state)
      ? "\n扉はすでに開いていて、下へ降りるはしごが見える。"
      : "\n「３つのボタンを押せ」と刻まれている。";
    return say(
      setFlags(state, { carpetMoved: true }),
      `テーブルをずらしてカーペットをめくると、床に四角い扉があった。${opened}`,
    );
  }
  return say(
    state,
    "部屋の中央のテーブル。手紙はここに置かれていた。\n下にはカーペットが敷いてある。",
  );
}

function tapHatch(state: GameState): GameState {
  if (state.flags.ladderDown) {
    return { ...state, view: "attic", dialog: null };
  }
  if (isActive(state, "yellow")) {
    return say(
      setFlags({ ...state, view: "attic" }, { ladderDown: true }),
      "体が羽のように軽い。\n床を蹴ると、天井の穴を一気に跳び抜けて、上の階に降り立った。\n\n穴のそばに、縄ばしごが巻いて置いてある。\n金具に掛けて下へ垂らしておいた。これでいつでも行き来できる。",
    );
  }
  return say(
    state,
    "天井に四角い穴がぽっかりと開いていて、上の階がのぞいている。\n高すぎて、とても手が届きそうにない。",
  );
}

function tapTree(state: GameState): GameState {
  const { selected } = state;
  const known = state.docs.includes("plant");
  if (state.flags.treeDead) {
    return say(state, "棘の植物は、茶色くしおれて動かない。");
  }
  if (selected === "letter") {
    return say(
      setFlags(lose(state, "letter"), { treeDead: true }),
      "手紙を近づけた瞬間、葉が紙に巻きつき、あっという間に取り込んだ。\n\n……やがて、手紙を取り込んだあたりの葉から、みるみる茶色く枯れていく。\n紙に染みていた白いインクの毒が、回ったのだろうか。\n\n奥の壁の鍵に、手が届きそうだ。",
    );
  }
  if (selected === "pot") {
    return say(
      state,
      state.potWater
        ? "水をかけても、葉は平然としている。"
        : "鍋で叩く気にはなれない。葉は鋼のように硬そうだ。",
    );
  }
  if (selected === "bomb") {
    return say(state, "爆弾を投げつけても、どうにもならないだろう。");
  }
  if (selected !== null && isPill(selected)) {
    return say(state, "錠剤を葉に落としても、植物が飲んでくれるとは思えない。");
  }
  return say(
    state,
    `${known ? "図鑑で見た鉄棘樹だ。" : ""}鋼のような棘の葉が、奥への通路をふさいでいる。\n葉のすき間から、壁に掛かった鍵が見える。`,
    {
      choices: [
        { id: "thorn", label: "葉をかき分けて進む", danger: true },
        cancel,
      ],
    },
  );
}

function tapWallKey(state: GameState): GameState {
  if (state.taken.includes("key")) return state;
  if (!state.flags.treeDead) return tapTree(state);
  return gain(state, "key", "枯れた葉をまたいで、壁の鍵を手に入れた。");
}

function tapFlower(state: GameState): GameState {
  const { selected } = state;
  const known = state.docs.includes("plant");
  if (state.flags.bombDisposed) {
    return say(state, "花は何事もなかったかのように、静かに口を閉じている。");
  }
  if (selected === "bomb") {
    return say(
      setFlags(lose(state, "bomb"), { bombDisposed: true }),
      "時限爆弾を、花の暗い口へ投げ込んだ。\n花弁がゆっくりと閉じ、くぐもった音とともに、爆弾は跡形もなく溶けていった。\n\n――もう、爆発の心配はない。",
    );
  }
  if (selected !== null) {
    return say(state, "これを食べさせても、意味はなさそうだ。");
  }
  return say(
    state,
    `鼻をつく悪臭。暗い口を開けた、大きな花が咲いている。\n${known ? "図鑑で見た喰獄花だ。" : ""}近づきすぎないほうがよさそうだ。`,
  );
}

function tapBoiler(state: GameState): GameState {
  if (state.taken.includes("bomb")) {
    return say(
      state,
      "はるか下でマグマが煮えたぎる、深い槽。底にはもう何もない。",
    );
  }
  const heat = isActive(state, "red");
  const breath = isActive(state, "blue");
  if (heat && breath) {
    return gain(
      state,
      "bomb",
      "熱さも、息苦しさも感じない。\n槽に飛び込み、煮えたぎるマグマを5メートル下の底まで潜って、沈んでいた箱をつかんで浮かび上がった。\n\n――時計のついた、時限爆弾だ。",
    );
  }
  if (heat) {
    return say(
      state,
      "ふちに立っても、少しも熱くない。\nけれど底までは5メートル。潜りきる前に、息が続かなくなりそうだ。",
    );
  }
  if (breath) {
    return say(
      state,
      "息はいくらでも続きそうだ。\nけれど熱すぎて、とても近づけない。",
    );
  }
  if (state.selected === "pot") {
    return say(state, "鍋でくみ出そうにも、熱くて近づくことすらできない。");
  }
  return say(
    state,
    "床に大きな槽が口を開け、はるか下で真っ赤なマグマがぐらぐらと煮えたぎっている。\n壁の表示によれば、深さは5メートル。赤く光る底に、時計のついた箱の影が沈んでいる。",
  );
}

function tap(state: GameState, target: Target): GameState {
  switch (target) {
    case "jar-red":
      return tapJar(state, "red");
    case "jar-yellow":
      return tapJar(state, "yellow");
    case "jar-white":
      return tapJar(state, "white");
    case "jar-blue":
      return tapJar(state, "blue");
    case "jar-purple":
      return tapJar(state, "purple");
    case "fire":
      return tapFire(state);
    case "statue":
      return tapStatue(state);
    case "fan":
      return say(
        state,
        "換気扇のひもを引いてみたが、動かない。\n羽根の向こうは壁でふさがれていて、空気の通る隙間はない。",
      );
    case "sink":
      return say(state, "蛇口をひねっても、水は一滴も出ない。");
    case "stove":
      return say(state, "つまみを回しても、コンロの火はつかない。");
    case "cupboard":
      return say(state, "戸棚を開けてみたが、中は空っぽだ。");
    case "pot":
      if (state.taken.includes("pot")) return state;
      return gain(
        state,
        "pot",
        "コンロの上の鍋を手に入れた。水くらいなら運べそうだ。",
      );
    case "door":
      return tapDoor(state);
    case "tank":
      return tapTank(state);
    case "table":
    case "carpet":
    case "trapdoor":
      return tapCenter(state, target);
    case "hatch":
      return tapHatch(state);
    case "tree":
      return tapTree(state);
    case "wall-key":
      return tapWallKey(state);
    case "flower":
      return tapFlower(state);
    case "ladder-up":
      return { ...state, view: "center", dialog: null };
    case "boiler":
      return tapBoiler(state);
    case "ladder-down":
      return { ...state, view: state.wall, dialog: null };
  }
}

function choose(state: GameState, id: ChoiceId): GameState {
  const closed = { ...state, dialog: null };
  switch (id) {
    case "cancel":
      return closed;
    case "dive":
      return pressButton(
        closed,
        "button2",
        isActive(state, "blue")
          ? "服のまま水槽に入り、底のボタンを押した。カチッ、と手ごたえがあった。\n少しも息苦しくなかった。"
          : "服のまま水槽に入り、息を止めて底のボタンを押した。カチッ、と手ごたえがあった。\n全身ずぶ濡れになったが、立てば胸から上が出る深さだ。",
      );
    case "thorn":
      return { ...end(state, "thorn"), checkpoint: closed };
    case "wait":
      // 何もせずに、時間切れまで待つ
      return tick(
        closed,
        (state.flags.bombDisposed ? AIR_MS : BOMB_MS) - state.elapsed,
      );
    case "leave":
      return end(state, "normal");
  }
}

/** 飲むと効果が出る錠剤の、飲んだときの感覚（白い錠剤は毒薬なので、ここには無い） */
const DRINK_TEXT: Record<Exclude<PillId, "white">, string> = {
  red: "体の芯がひんやりとして、暖炉の熱気を感じなくなった。",
  yellow: "体が羽のように軽くなった。どこまでも跳べそうな気がする。",
  blue: "胸がすうっと楽になった。息を止めていても、少しも苦しくない。",
  purple: "体の奥から力がわいてくる。何でも持ち上げられそうだ。",
};

function tick(state: GameState, delta: number): GameState {
  if (state.phase !== "playing") return state;
  const elapsed = state.elapsed + delta;
  const next = { ...state, elapsed };
  if (!state.flags.bombDisposed) {
    return elapsed >= BOMB_MS ? end(next, "explosion") : next;
  }
  if (elapsed >= AIR_MS) return end(next, "suffocation");
  if (elapsed >= BOMB_MS && !state.flags.airWarned && state.dialog === null) {
    return say(
      setFlags(next, { airWarned: true }),
      "……息が苦しくなってきた。\nこの部屋には、空気の入る隙間がない。急いだほうがよさそうだ。",
    );
  }
  return next;
}

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "start":
      return { ...initialState, phase: "opening" };
    case "readLetter":
      return {
        ...initialState,
        phase: "playing",
        items: ["letter"],
        taken: ["letter"],
      };
    case "load":
      return action.state;
    case "reset":
      return initialState;
    case "retry":
      return state.checkpoint ?? initialState;
  }

  // ここから先はプレイ中だけ受けつける
  if (state.phase !== "playing") return state;

  switch (action.type) {
    case "tick":
      return tick(state, action.delta);
    case "look": {
      const { view } = action;
      if (view === "basement" && !trapOpen(state)) return state;
      if (view === "attic" && !state.flags.ladderDown) return state;
      return {
        ...state,
        view,
        wall: isWall(view) ? view : state.wall,
        dialog: null,
      };
    }
    case "tap":
      return tap(state, action.target);
    case "choose":
      return choose(state, action.id);
    case "select":
      return { ...state, selected: action.item };
    case "drink": {
      const { pill } = action;
      if (!has(state, pill)) return state;
      // 白い錠剤（ドクガアール）はただの毒薬。飲んだ時点で命はない
      if (pill === "white") {
        return {
          ...end(lose(state, pill), "poison"),
          checkpoint: { ...state, dialog: null },
        };
      }
      return say(
        {
          ...lose(state, pill),
          effects: { ...state.effects, [pill]: state.elapsed + PILL_MS },
        },
        `${ITEM_NAMES[pill]}を飲んだ。\n${DRINK_TEXT[pill]}`,
      );
    }
    case "readDoc":
      return state.docs.includes(action.doc)
        ? state
        : { ...state, docs: [...state.docs, action.doc] };
    case "openBox":
      return setFlags(
        state.docs.includes("pills")
          ? state
          : { ...state, docs: [...state.docs, "pills"] },
        { boxOpen: true },
      );
    case "askWait":
      return say(
        state,
        state.flags.bombDisposed
          ? "爆弾はもう処理した。\nこのまま何もせず、空気が尽きるまで待つこともできる。"
          : "このまま何もせず、タイムリミットが来るまで待つこともできる。",
        {
          choices: [
            { id: "wait", label: "時間が過ぎるのを待つ", danger: true },
            cancel,
          ],
        },
      );
    case "closeDialog":
      // 選択肢つきのダイアログは、選ぶまで閉じない
      return state.dialog?.choices ? state : { ...state, dialog: null };
  }
}

// ===== セーブデータ =====

const SAVE_KEY = "escape-yamata-save-v1";

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // 保存できなくても遊べるようにする
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // 何もしない
  }
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw === null) return null;
    const data = JSON.parse(raw) as Partial<GameState>;
    if (data.phase !== "playing" || typeof data.elapsed !== "number") {
      return null;
    }
    return {
      ...initialState,
      ...data,
      flags: { ...initialState.flags, ...data.flags },
    };
  } catch {
    return null;
  }
}

// ===== これまでに見たエンディング =====

const ENDINGS_KEY = "escape-yamata-endings-v1";

export const ENDING_ORDER: readonly Ending[] = [
  "true",
  "normal",
  "explosion",
  "suffocation",
  "thorn",
  "poison",
];

export function loadEndings(): Ending[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(ENDINGS_KEY) ?? "[]");
    if (!Array.isArray(data)) return [];
    return ENDING_ORDER.filter((ending) => data.includes(ending));
  } catch {
    return [];
  }
}

export function recordEnding(ending: Ending): void {
  try {
    const seen = loadEndings();
    if (seen.includes(ending)) return;
    localStorage.setItem(ENDINGS_KEY, JSON.stringify([...seen, ending]));
  } catch {
    // 保存できなくても遊べるようにする
  }
}

// ===== ヒント =====

export interface Hint {
  /** 同じ話題のあいだは、開いたページを覚えておく */
  topic: string;
  /** 考え方のヒント。1枚ずつめくって読む */
  steps: string[];
  /** 答えそのもの。自分で「答えを見る」を選んだときだけ表示する */
  answer?: string;
}

export function getHint(state: GameState): Hint {
  const { flags } = state;
  // 飲んでしまい、効果も切れた錠剤
  const used = (pill: PillId) =>
    state.taken.includes(pill) && !has(state, pill) && !isActive(state, pill);

  if (!flags.boxOpen) {
    return {
      topic: "box",
      steps: [
        "まずは部屋をひと回りして、持てるものを集めよう。棚の本と、3桁の錠がついた箱が手がかりになる。",
        "箱の番号は『謎の本』に隠されている。A〜Eの5つの謎を解き、答えをひらがなで最後のページのマスに縦に書き込もう。",
        "【謎A】3つの言葉の「？？」には、同じ2文字が入る。「メ？？ック」は、機械を整備する人のこと。",
        "【謎B】太陽は朝・昼・夕方で、見える方角が変わる。方位磁針の向きを言葉に当てはめて、東なら右の文字、西なら左の文字を拾おう。",
        "【謎C】動物と品物の組み合わせは、ことわざ。「猫に小判」「豚に真珠」ときたら、馬の……に？ 赤い矢印がさしている場所に注目。",
        "【謎D】この部屋には、形のちがう錠剤が5種類ある。角（かど）がひとつもない形の錠剤は、何色？",
        "【謎E】イラストを言葉にすると、数字が隠れている。ら「いち」、「に」わとり……。1から順に線でつなぐと、線の通った文字が文になる。",
        "5つの答えをマスに書き込んだら、矢印のついた行を左から右へ読もう。数字の読み方になっている。",
      ],
      answer:
        "A＝かに、B＝もよう、C＝ねんぶつ、D＝しろ、E＝くらやみ。矢印の行は「に・よ・ん・ろ・く」。箱の番号は 246。",
    };
  }
  if (!flags.carpetMoved) {
    return {
      topic: "carpet",
      steps: [
        "壁ばかり見ていないだろうか。「▼ 部屋の中央」も調べてみよう。",
        "テーブルの下に敷かれているものが怪しい。",
      ],
      answer: "部屋の中央でカーペットをタップしてめくる。",
    };
  }
  if (!flags.button2) {
    return {
      topic: "button2",
      steps: [
        "床の扉を開けるには、3つのボタンを押す必要がある。ひとつは水槽の底にある。",
        "水槽の高さは100センチほど。溺れるような深さではない。",
      ],
      answer:
        "何も選ばずに水槽をタップし、「水槽に入る」を選ぶ。薬はいらない。",
    };
  }
  if (!flags.button1) {
    return {
      topic: "button1",
      steps: [
        "暖炉の炎の奥にボタンがある。火をどうにかしたい。",
        "熱さに耐える薬でも押せるが、それは「最善手」だろうか。火そのものを消す方法を考えよう。",
        "キッチンの水道は出ない。水は別の場所にたっぷりある。運ぶための道具はコンロの上に。",
      ],
      answer: "鍋を選んで水槽をタップして水をくみ、そのまま暖炉をタップする。",
    };
  }
  if (!flags.button3) {
    if (used("purple")) {
      return {
        topic: "button3-stuck",
        steps: [
          "像を動かせる薬はもう残っていない……。「はじめから」やり直すしかなさそうだ。",
        ],
      };
    }
    return {
      topic: "button3",
      steps: [
        "像の裏にボタンがある。普通の力では動かせない。",
        "箱の中の紙に、力が強くなる錠剤が載っている。問題は、どの小瓶がそれなのか。",
        "紙の右下の数字に注目。小瓶に入っている錠剤の形と見くらべて、数字が何を数えたものか考えよう。",
        "錠剤の効果は1分間。飲んだら、すぐに像を調べよう。",
      ],
      answer:
        "数字は形の「角の数」。チカラモーチは3なので、三角の入った紫の錠剤を飲み、1分以内に像をタップする。",
    };
  }
  if (!flags.treeDead) {
    return {
      topic: "tree",
      steps: [
        "床の扉から下の階へ。鍵の前をふさぐ植物は、植物図鑑に載っている。触れてはいけない。",
        "図鑑によれば、駆除には毒物が必要だ。ただし箱の中の紙にある毒の錠剤は、飲んだ者が命を落とすだけ。それに、錠剤を飲めるのは「自力で行動可能な生物」に限られる。",
        "毒は錠剤だけとは限らない。図鑑には、毒をもつ花がもうひとつ載っている。その花は、何の原料になる？",
        "鉄棘樹は、葉に触れた「もの」を取り込む。生き物でなくてもいい。白いインクで書かれたものを、最初から持っていないだろうか。",
      ],
      answer: "手紙を選んでから、鉄棘樹をタップする。",
    };
  }
  if (!has(state, "key")) {
    return {
      topic: "key",
      steps: ["枯れた鉄棘樹の奥に、取りたかったものが見えているはず。"],
      answer: "下の階で、壁に掛かった鍵をタップする。",
    };
  }
  if (flags.bombDisposed) {
    return { topic: "door", steps: ["やるべきことは済んだ。鍵を持って扉へ。"] };
  }
  if (has(state, "bomb")) {
    return {
      topic: "dispose",
      steps: [
        "爆弾の止め方はわからない。それなら、跡形もなく消してしまえばいい。",
        "植物図鑑に、何でも消化してしまう花が載っている。",
      ],
      answer: "時限爆弾を選んでから、下の階の喰獄花をタップする。",
    };
  }
  if (!flags.ladderDown) {
    if (used("yellow")) {
      return {
        topic: "attic-stuck",
        steps: [
          "上の階へ行ける薬はもう残っていない。爆弾には手が届かない……。鍵を使って、このまま脱出するしかなさそうだ。",
        ],
      };
    }
    return {
      topic: "attic",
      steps: [
        "鍵があれば外には出られる。でも、爆弾はまだ見つかっていない。まだ行っていない場所はないだろうか。",
        "「▲ 天井」を見てみよう。穴の向こうに上の階がある。届かせる方法は、箱の中の紙に。",
        "高くジャンプできる錠剤の数字は「10」。角が10個ある形を探そう。",
      ],
      answer: "星の入った黄色い錠剤を飲み、1分以内に天井の穴をタップする。",
    };
  }
  if (used("red") || used("blue")) {
    return {
      topic: "bomb-stuck",
      steps: [
        "熱さと深さの両方に備える薬が、もうそろわない。爆弾は取り出せない……。鍵を使って、このまま脱出するしかなさそうだ。",
      ],
    };
  }
  return {
    topic: "bomb",
    steps: [
      "上の階の槽の底に爆弾がある。マグマの熱さと、5メートルという深さ。両方をどうにかする必要がある。",
      "錠剤の効果は1分間。2つ続けて飲めば、同時に効かせられる。",
    ],
    answer:
      "ハートの赤い錠剤（アツクナーイ）と、雲の青い錠剤（オボレナーイ）を続けて飲み、1分以内に槽をタップする。",
  };
}
