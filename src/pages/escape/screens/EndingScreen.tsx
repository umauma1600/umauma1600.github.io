import { useGame } from "../GameContext";

export default function EndingScreen() {
  const { state, dispatch } = useGame();

  const handleRetry = () => {
    dispatch({ type: "RESET_GAME" });
  };

  const getEndingContent = () => {
    switch (state.status) {
      case "bad_end_1":
        return {
          title: "BAD END①",
          subtitle: "〜時間切れ〜",
          text: [
            "ドッカーン！！！",
            "",
            "大きな爆発音とともに崩れる壁と天井。",
            "途切れる意識とともにあなたは悟った。",
            "「あぁ…失敗したんだな…」と。",
            "",
            "その後のことなどあなたは知る由もないのであった。",
          ],
          bgColor: "from-red-900 via-gray-900 to-gray-900",
          titleColor: "text-red-500",
        };

      case "bad_end_2":
        return {
          title: "BAD END②",
          subtitle: "〜酸素切れ〜",
          text: [
            "朦朧とする意識。",
            "爆弾を解除し、あとは部屋を出るだけ。",
            "もう一息だったのに。",
            "",
            "悔しさとやり切れなさがこみ上げるが、",
            "同時に悟る「あぁ…失敗したんだな…」と。",
            "",
            "その後のあなたのことなど誰も知る由もないのであった。",
          ],
          bgColor: "from-blue-900 via-gray-900 to-gray-900",
          titleColor: "text-blue-400",
        };

      case "normal_end":
        return {
          title: "NORMAL END",
          subtitle: "〜生還おめでとうございます〜",
          text: [
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
          bgColor: "from-yellow-900 via-gray-900 to-gray-900",
          titleColor: "text-yellow-400",
        };

      case "true_end":
        return {
          title: "TRUE END",
          subtitle: "〜「やまーたからの挑戦状」クリアおめでとうございます！〜",
          text: [
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
          bgColor: "from-green-900 via-gray-900 to-gray-900",
          titleColor: "text-green-400",
        };

      default:
        return {
          title: "END",
          subtitle: "",
          text: [],
          bgColor: "from-gray-900 to-gray-900",
          titleColor: "text-white",
        };
    }
  };

  const content = getEndingContent();

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${content.bgColor} flex flex-col items-center justify-center p-4`}
    >
      <div className="max-w-2xl w-full text-center">
        {/* エンディングタイトル */}
        <h1
          className={`text-4xl md:text-5xl font-bold ${content.titleColor} mb-2`}
        >
          【{content.title}】
        </h1>
        <h2 className="text-xl md:text-2xl text-gray-300 mb-12">
          {content.subtitle}
        </h2>

        {/* エンディングテキスト */}
        <div className="bg-gray-800/50 rounded-xl p-8 mb-12 text-left">
          {content.text.map((line, index) => (
            <p
              key={index}
              className={`text-gray-200 text-lg leading-relaxed ${
                line === "" ? "h-4" : ""
              }`}
            >
              {line}
            </p>
          ))}
        </div>

        {/* SNSシェア */}
        <div className="mb-8">
          <p className="text-gray-400 mb-4">
            感想は <span className="text-blue-400 font-bold">#やま謎</span>{" "}
            でお待ちしています！
          </p>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              `「やまーたからの挑戦状」を${
                state.status === "true_end"
                  ? "TRUE ENDでクリア"
                  : state.status === "normal_end"
                    ? "NORMAL ENDでクリア"
                    : "プレイ"
              }しました！ #やま謎`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-lg transition-colors"
          >
            Xで共有する
          </a>
        </div>

        {/* リトライボタン */}
        <button
          onClick={handleRetry}
          className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
        >
          もう一度プレイする
        </button>
      </div>
    </div>
  );
}
