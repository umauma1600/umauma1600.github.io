// 脱出ゲームの文章と資料
import type { DocId, Ending, ItemId, View } from "./game";

export const LETTER_IMAGE = "/assets/escape/message.webp";

export interface DocPage {
  src: string;
  alt: string;
}

export interface Doc {
  title: string;
  pages: DocPage[];
}

const page = (name: string, alt: string): DocPage => ({
  src: `/assets/escape/${name}.webp`,
  alt,
});

export const LETTER_DOC: Doc = {
  title: "手紙",
  pages: [
    {
      src: LETTER_IMAGE,
      alt: "この部屋のとある場所に時限爆弾をしかけた。タイムリミットは君がこの手紙を読んでから20分だ。",
    },
  ],
};

export const DOCS: Record<DocId, Doc> = {
  plant: {
    title: "植物図鑑",
    pages: [
      page("plant-ginreika", "銀鈴花（ぎんれいか）"),
      page("plant-yubaesou", "夕映草（ゆうばえそう）"),
      page("plant-yourinka", "陽輪花（ようりんか）"),
      page("plant-shokugokuka", "喰獄花（しょくごくか）"),
      page("plant-tekkyokuju", "鉄棘樹（てっきょくじゅ）"),
    ],
  },
  manual: {
    title: "取扱説明書",
    pages: [
      page("manual-bakudan", "時限爆弾の説明"),
      page("manual-zyouzai", "錠剤の説明"),
    ],
  },
  mystery: {
    title: "謎の本",
    pages: [
      page("mystery-a", "謎A"),
      page("mystery-b", "謎B"),
      page("mystery-c", "謎C"),
      page("mystery-d", "謎D"),
      page("mystery-e", "謎E"),
      page("mystery-f", "A〜Eの答えを書き込むマス"),
    ],
  },
  pills: {
    title: "箱の中の紙",
    pages: [
      page("pill-chart", "小瓶と錠剤の名前の対応表"),
      page("pill-dokugaaru", "ドクガアール"),
      page("pill-atsukunai", "アツクナーイ"),
      page("pill-takakutobu", "タカクトーブ"),
      page("pill-oborenai", "オボレナーイ"),
      page("pill-chikaramochi", "チカラモーチ"),
    ],
  },
};

export const DOC_ORDER: readonly DocId[] = [
  "plant",
  "manual",
  "mystery",
  "pills",
];

export const VIEW_NAMES: Record<View, string> = {
  north: "暖炉と像",
  east: "キッチン",
  south: "扉",
  west: "棚と水槽",
  center: "部屋の中央",
  ceiling: "天井",
  basement: "下の階",
  attic: "上の階",
};

export const ITEM_DESCRIPTIONS: Record<ItemId, string> = {
  letter:
    "テーブルに置かれていた手紙。黒い紙に、白いインクで書かれている。かすかに甘い香りがする。",
  pot: "キッチンのコンロに置いてあった鍋。",
  key: "下の階の壁に掛かっていた鍵。扉の鍵穴に合いそうだ。",
  bomb: "時計のついた時限爆弾。カチ、カチ、と針が進んでいる。止め方はわからない。",
  red: "小瓶に、ハートの形をした赤い錠剤が入っている。",
  yellow: "小瓶に、星の形をした黄色い錠剤が入っている。",
  white: "小瓶に、丸い形をした白い錠剤が入っている。",
  blue: "小瓶に、雲の形をした青い錠剤が入っている。",
  purple: "小瓶に、三角の形をした紫の錠剤が入っている。",
};

export const OPENING_LINES = [
  "あなたが目を覚ますと",
  "見知らぬ部屋に閉じ込められていました。",
  "",
  "前後の記憶は全くありません。",
  "",
  "すると、部屋の中央にあるテーブルに",
  "封筒が置いてあることに気が付きました。",
];

export interface EndingData {
  label: string;
  subtitle: string;
  tone: "bad" | "normal" | "true";
  /** X で共有するときの一言 */
  share: string;
  /** まだ見ていない人に向けた、ほのめかす程度の手がかり（エンディング一覧に出す） */
  clue: string;
  lines: string[];
}

export const ENDINGS: Record<Ending, EndingData> = {
  explosion: {
    label: "BAD END①",
    subtitle: "〜時間切れ〜",
    tone: "bad",
    share: "プレイしました",
    clue: "時間は、待ってくれない。",
    lines: [
      "ドッカーン！！！",
      "",
      "大きな爆発音とともに崩れる壁と天井。",
      "途切れる意識とともにあなたは悟った。",
      "「あぁ…失敗したんだな…」と。",
      "",
      "その後のことなどあなたは知る由もないのであった。",
    ],
  },
  suffocation: {
    label: "BAD END②",
    subtitle: "〜酸素切れ〜",
    tone: "bad",
    share: "プレイしました",
    clue: "憂いは断った。けれど、この部屋には……。",
    lines: [
      "朦朧とする意識。",
      "爆弾を解除し、あとは部屋を出るだけ。",
      "もう一息だったのに。",
      "",
      "悔しさとやり切れなさがこみ上げるが、",
      "同時に悟る「あぁ…失敗したんだな…」と。",
      "",
      "その後のあなたのことなど誰も知る由もないのであった。",
    ],
  },
  thorn: {
    label: "BAD END③",
    subtitle: "〜鉄の棘〜",
    tone: "bad",
    share: "プレイしました",
    clue: "触れてはいけないものに、手を伸ばす。",
    lines: [
      "葉に触れた、その瞬間だった。",
      "",
      "鋼のような棘が腕に巻きつき、",
      "抗う間もなく体ごと引きずり込まれる。",
      "痛みを感じるより早く、視界が暗く沈んでいく。",
      "",
      "薄れる意識の中であなたは悟った。",
      "「あぁ…失敗したんだな…」と。",
    ],
  },
  poison: {
    label: "BAD END④",
    subtitle: "〜毒〜",
    tone: "bad",
    share: "プレイしました",
    clue: "口にしてはいけないものを、口にする。",
    lines: [
      "錠剤を飲み込んだ、その直後だった。",
      "",
      "舌がしびれ、喉が焼け、指先から力が抜けていく。",
      "立っていることもできず、あなたは床に崩れ落ちた。",
      "",
      "薄れる意識の中であなたは悟った。",
      "「あぁ…失敗したんだな…」と。",
    ],
  },
  normal: {
    label: "NORMAL END",
    subtitle: "〜生還おめでとうございます〜",
    tone: "normal",
    share: "NORMAL ENDでクリアしました",
    clue: "自分だけは、助かる。",
    lines: [
      "あなたは扉の鍵を開け外に出ることに成功した。",
      "扉の先は暗い廊下になっており、そのまま進むと階段があった。",
      "数フロア分であろうか、その階段をのぼると日の光の先に出ることができた。",
      "",
      "外に出てみるとそこはなんてことない繁華街の裏路地だった。",
      "どうやら少し古ぼけたビルの地下に閉じ込められていたようだ。",
      "",
      "ほっと安堵したのも束の間、あなたの背中から聞こえる音「…ドカーン」",
      "そして崩れ落ちていく先ほどまでいたビルの瓦礫。",
      "",
      "あなたは無事に生還した。",
      "だがしかし…そこのビルにいた人たちは…？",
      "",
      "嫌な考えを振り払い、あなたは雑踏へと消えていくのだった。",
    ],
  },
  true: {
    label: "TRUE END",
    subtitle: "〜「やまーたからの挑戦状」クリアおめでとうございます！〜",
    tone: "true",
    share: "TRUE ENDでクリアしました",
    clue: "すべての憂いを断って、扉を開ける。",
    lines: [
      "あなたは扉の鍵を開け外に出ることに成功した。",
      "扉の先は暗い廊下になっており、そのまま進むと階段があった。",
      "数フロア分であろうか、その階段をのぼると日の光の先に出ることができた。",
      "",
      "外に出てみるとそこはなんてことない繁華街の裏路地だった。",
      "どうやら少し古ぼけたビルの地下に閉じ込められていたようだ。",
      "",
      "だがしかしあなたに憂いはもうない。",
      "外の空気のおいしさを噛みしめながら、",
      "あなたは帰路につくのであった。",
    ],
  },
};

export function formatClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
