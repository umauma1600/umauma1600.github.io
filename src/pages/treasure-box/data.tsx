import type { ReactNode } from "react";

/** ダイヤル錠の正解（ケルナ語の単語の文字数がそのまま数字になる） */
export const DIAL_ANSWER = [1, 5, 8, 2];

/** 紙に書かれているキーワード */
export const KEYWORD = "逆転の発想";

/** 最終解答として受け付ける表記 */
const FINAL_ANSWERS = [KEYWORD, "ぎゃくてんのはっそう", "ギャクテンノハッソウ"];

export function isFinalAnswer(input: string) {
  const normalized = input.normalize("NFKC").replace(/\s+/g, "");
  return FINAL_ANSWERS.includes(normalized);
}

/** メモ（ダイヤル錠の手がかり）の各ページ */
export const MEMO_PAGES: ReactNode[] = [
  <span key="kelna" className="tb-kelna">
    Numek-n es n.
    <br />
    Numek-ki es wrils.
    <br />
    Numek-zam es grovinas.
    <br />
    Numek-befo es ki.
  </span>,
  "この言語はケルナ語という言語だ",
  "解錠されることは想定していないようだ",
];

/** ヒント（段階的に公開） */
export const HINTS: ReactNode[] = [
  <>
    ここからヒントを確認できます。
    <br />
    ヒントは段階的に公開されますので、必要に応じて「次のヒント」ボタンを押してください。
  </>,
  <>
    ダイヤル錠を開けるための手がかりは、どうやら<mark>大変難しい</mark>
    ようです。
  </>,
  <>
    「ケルナ語」とは<mark>架空の言語</mark>のようです。
  </>,
  <>
    手がかりには以下のように書かれているようです：
    <br />
    <br />
    「最初の数字は<strong>1</strong>だよ。
    <br />
    2番目の数字は<strong>5</strong>だよ。
    <br />
    3番目の数字は<strong>8</strong>だよ。
    <br />
    4番目の数字は<strong>2</strong>だよ。」
  </>,
  <>
    ダイヤル錠を開けるための番号は「<mark>1582</mark>」になるようです。
  </>,
  <>
    どうやらダイヤル錠を解錠しても宝箱は開かないようです。
    <br />
    <mark>逆転の発想</mark>が必要になりそうです。
  </>,
  <>
    もしかすると<mark>宝箱自体</mark>に何か仕掛けがあるかもしれません。
  </>,
  <>
    この宝箱は<mark>最初から机に置いてありました</mark>ね。
  </>,
  <>
    宝箱の<mark>底がない</mark>可能性を考えてみてください。
  </>,
  <>
    底がない宝箱であれば、宝箱を<mark>上に持ち上げる</mark>
    ことで中の紙を見つけることができそうです！
  </>,
];

export function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
