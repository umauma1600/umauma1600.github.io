import { useGame } from "../GameContext";

export default function CautionScreen() {
  const { dispatch } = useGame();

  const handleNext = () => {
    dispatch({ type: "SHOW_OPENING" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-gray-800/80 rounded-2xl p-8 shadow-2xl border border-gray-700">
        {/* タイトル */}
        <h2 className="text-3xl font-bold text-white text-center mb-8 border-b border-gray-600 pb-4">
          注意事項
        </h2>

        {/* 注意事項リスト */}
        <ul className="space-y-6 text-gray-200 text-lg">
          <li className="flex items-start gap-3">
            <span className="text-red-500 font-bold text-xl">•</span>
            <span>
              <span className="text-yellow-400 font-semibold">
                紙及びペンの用意
              </span>
              を推奨しています。
            </span>
          </li>

          <li className="flex items-start gap-3">
            <span className="text-red-500 font-bold text-xl">•</span>
            <span>
              こちらの作品は
              <span className="text-yellow-400 font-semibold">
                フィクション
              </span>
              になります。
              <br />
              <span className="text-gray-400 text-base">
                登場する物、事柄、情報などが現実のものと異なる場合がありますことを、ご了承ください。
              </span>
            </span>
          </li>

          <li className="flex items-start gap-3">
            <span className="text-red-500 font-bold text-xl">•</span>
            <span>
              本作品の
              <span className="text-red-400 font-semibold">ネタバレは禁止</span>
              になりますが、
              <br />
              プレイ後の感想につきましては大歓迎です。
              <br />
              <span className="text-blue-400 font-semibold text-xl mt-2 inline-block">
                #やま謎
              </span>
              <span className="text-gray-400 text-base ml-2">
                にて投稿をお待ちしております。
              </span>
            </span>
          </li>
        </ul>

        {/* 確認ボタン */}
        <div className="mt-10 text-center">
          <button
            onClick={handleNext}
            className="px-10 py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xl rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            確認しました
          </button>
        </div>
      </div>
    </div>
  );
}
