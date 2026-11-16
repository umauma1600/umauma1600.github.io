import ArtworkCard, { ComingSoonCard } from "../components/ArtworkCard";

export default function PuzzleListPage() {
  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 20% 20%, rgba(198, 156, 109, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, rgba(198, 156, 109, 0.06) 0%, transparent 50%),
          linear-gradient(to bottom, #faf8f5, #f5f0e8)
        `,
      }}
    >
      {/* 浮遊する鍵アイコン - 装飾 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="floating-key floating-key-1"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            position: "absolute",
            top: "15%",
            left: "8%",
            opacity: 0.15,
          }}
        >
          <path
            d="M21 10h-8.35A5.99 5.99 0 0 0 7 6a6 6 0 0 0 0 12 5.99 5.99 0 0 0 5.65-4H13l2 2 2-2 2 2 2-2v-4zM7 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
            fill="currentColor"
          />
        </svg>
        <svg
          className="floating-key floating-key-2"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            position: "absolute",
            top: "60%",
            right: "10%",
            opacity: 0.12,
          }}
        >
          <path
            d="M21 10h-8.35A5.99 5.99 0 0 0 7 6a6 6 0 0 0 0 12 5.99 5.99 0 0 0 5.65-4H13l2 2 2-2 2 2 2-2v-4zM7 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* ページヘッダー */}
      <div className="px-6 md:px-12 lg:px-20 py-12 md:py-16">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-full"
              style={{
                background: "rgba(198, 156, 109, 0.1)",
                border: "2px solid rgba(198, 156, 109, 0.3)",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                style={{ color: "var(--color-accent)" }}
              >
                <path
                  d="M21 10h-8.35A5.99 5.99 0 0 0 7 6a6 6 0 0 0 0 12 5.99 5.99 0 0 0 5.65-4H13l2 2 2-2 2 2 2-2v-4zM7 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h1
              className="text-3xl md:text-4xl font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              謎解き
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            ブラウザで遊べるインタラクティブな謎解きコンテンツ
          </p>
        </div>
      </div>

      {/* 作品一覧 */}
      <div className="px-6 md:px-12 lg:px-20 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ArtworkCard
              to="/nazo/treasure-box"
              image="/assets/images/treasure-box-thumbnail.webp"
              title="逆転の宝箱"
              description="4桁のダイヤル錠がかかった古びた宝箱。常識にとらわれていませんか？"
              difficulty="初心者向け"
              stars="★☆☆☆☆"
              duration="約10分"
              ctaLabel="挑戦する"
            />
            <ComingSoonCard
              title="次の謎解き"
              icon={
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ color: "var(--color-accent)", opacity: 0.5 }}
                >
                  <path
                    d="M21 10h-8.35A5.99 5.99 0 0 0 7 6a6 6 0 0 0 0 12 5.99 5.99 0 0 0 5.65-4H13l2 2 2-2 2 2 2-2v-4zM7 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
                    fill="currentColor"
                  />
                </svg>
              }
            />
          </div>
        </div>
      </div>

      {/* スタイル */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }

        .floating-key {
          color: var(--color-accent);
          animation: float 6s ease-in-out infinite;
        }

        .floating-key-1 { animation-delay: 0s; }
        .floating-key-2 { animation-delay: 2s; }

        @media (max-width: 768px) {
          .floating-key {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
