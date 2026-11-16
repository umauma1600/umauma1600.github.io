import { useState } from "react";
import ArtworkCard from "./ArtworkCard";

export default function ContentsSection() {
  const [keyRotated, setKeyRotated] = useState(false);

  const handleKeyClick = () => {
    setKeyRotated(true);
    setTimeout(() => {
      setKeyRotated(false);
    }, 600);
  };

  return (
    <section
      id="contents"
      className="relative px-6 md:px-12 lg:px-20 py-16 md:py-24 overflow-hidden"
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
        <svg
          className="floating-key floating-key-3"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            position: "absolute",
            top: "35%",
            right: "25%",
            opacity: 0.1,
          }}
        >
          <path
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* セクションヘッダー */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            {/* インタラクティブな鍵アイコン */}
            <button
              onClick={handleKeyClick}
              className="key-button"
              aria-label="鍵を回す"
              style={{
                transform: keyRotated ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                style={{ color: "var(--color-accent)" }}
              >
                <path
                  d="M21 10h-8.35A5.99 5.99 0 0 0 7 6a6 6 0 0 0 0 12 5.99 5.99 0 0 0 5.65-4H13l2 2 2-2 2 2 2-2v-4zM7 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              アトリエの作品
            </h2>
          </div>
          <p className="text-lg text-gray-600">
            謎を解き明かし、新たな扉を開いてください
          </p>
        </div>

        {/* 作品カードグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ArtworkCard
            to="/nazo/treasure-box"
            image="/assets/images/treasure-box-thumbnail.webp"
            title="逆転の宝箱"
            description="4桁のダイヤル錠がかかった古びた宝箱。常識にとらわれていませんか？"
            genre="謎解き"
            difficulty="初心者向け"
            stars="★☆☆☆☆"
            duration="約10分"
            ctaLabel="挑戦する"
            tall
          />
          <ArtworkCard
            href="https://umauma1600.booth.pm/items/5403959"
            image="/assets/images/kemurinomukoude.webp"
            title="煙の向こうで"
            description="Boothで詳細をご確認ください。"
            genre="マダミス"
            ctaLabel="Boothで見る"
            tall
          />
        </div>
      </div>

      {/* スタイル */}
      <style>{`
        /* 浮遊する鍵のアニメーション */
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
        .floating-key-3 { animation-delay: 4s; }

        /* 鍵ボタン */
        .key-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: rgba(198, 156, 109, 0.1);
          border: 2px solid rgba(198, 156, 109, 0.3);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .key-button:hover {
          background: rgba(198, 156, 109, 0.2);
          border-color: var(--color-accent);
          transform: scale(1.1);
        }

        .key-button:active {
          transform: scale(0.95);
        }

        /* レスポンシブ */
        @media (max-width: 768px) {
          .floating-key {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
