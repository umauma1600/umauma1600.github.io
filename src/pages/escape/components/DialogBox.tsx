import { useGame } from "../GameContext";

export default function DialogBox() {
  const { state, showDialog } = useGame();

  const handleClose = () => {
    showDialog(null);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6 border border-gray-600">
        <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-line">
          {state.dialogMessage}
        </p>
        <div className="mt-6 text-center">
          <button
            onClick={handleClose}
            className="px-8 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
