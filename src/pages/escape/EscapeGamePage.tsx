import { GameProvider, useGame } from "./GameContext";
import TitleScreen from "./screens/TitleScreen";
import CautionScreen from "./screens/CautionScreen";
import OpeningScreen from "./screens/OpeningScreen";
import GameScreen from "./screens/GameScreen";
import EndingScreen from "./screens/EndingScreen";

// ゲーム画面の切り替え
function GameRouter() {
  const { state } = useGame();

  switch (state.status) {
    case "title":
      return <TitleScreen />;
    case "caution":
      return <CautionScreen />;
    case "opening":
      return <OpeningScreen />;
    case "playing":
      return <GameScreen />;
    case "bad_end_1":
    case "bad_end_2":
    case "normal_end":
    case "true_end":
      return <EndingScreen />;
    default:
      return <TitleScreen />;
  }
}

// メインコンポーネント
export default function EscapeGamePage() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gray-900">
        <GameRouter />
      </div>
    </GameProvider>
  );
}
