import { useGame } from "../GameContext";

export default function Timer() {
  const { state } = useGame();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isLowTime = state.remainingTime < 5 * 60; // 5分以下
  const isCritical = state.remainingTime < 1 * 60; // 1分以下

  return (
    <div
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xl font-bold
        ${
          isCritical
            ? "bg-red-900/80 text-red-300 animate-pulse"
            : isLowTime
              ? "bg-yellow-900/80 text-yellow-300"
              : "bg-gray-700 text-white"
        }
      `}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{formatTime(state.remainingTime)}</span>

      {/* 爆弾解除済みの場合は表示 */}
      {state.flags.bombDisarmed && (
        <span className="text-green-400 text-sm ml-2">💣解除済み</span>
      )}
    </div>
  );
}
