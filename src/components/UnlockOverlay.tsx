interface UnlockOverlayProps {
  isVisible: boolean;
}

export default function UnlockOverlay({ isVisible }: UnlockOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[3000] overflow-hidden">
      {/* 中央から広がる光 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(251, 243, 219, 1) 0%, rgba(198, 156, 109, 0.3) 50%, transparent 70%)",
          animation: "lightExpand 0.8s ease-out forwards",
        }}
      />
      {/* 背景のフェードイン */}
      <div
        className="absolute inset-0 bg-amber-50"
        style={{
          animation: "bgFadeIn 0.6s ease-out 0.3s forwards",
          opacity: 0,
        }}
      />
      {/* ウェルカムメッセージ */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          animation: "contentFadeIn 0.5s ease-out 0.6s forwards",
          opacity: 0,
        }}
      >
        <div className="text-center">
          <p className="text-amber-800 text-lg mb-2">いらっしゃいませ</p>
          <h2
            className="text-2xl md:text-3xl font-bold text-amber-900"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Café ひみつの鍵へようこそ
          </h2>
          <div className="mt-4 flex justify-center">
            <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
      <style>{`
        @keyframes lightExpand {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(3); opacity: 0.8; }
        }
        @keyframes bgFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes contentFadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
