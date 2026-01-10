export default function MadamisListPage() {
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
      {/* 浮遊する虫眼鏡アイコン - 装飾 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="floating-icon floating-icon-1"
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg
          className="floating-icon floating-icon-2"
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1
              className="text-3xl md:text-4xl font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              マーダーミステリー
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Boothで販売中のマーダーミステリー作品
          </p>
        </div>
      </div>

      {/* 作品一覧 */}
      <div className="px-6 md:px-12 lg:px-20 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 煙の向こうで */}
            <a
              href="https://umauma1600.booth.pm/items/5403959"
              target="_blank"
              rel="noopener noreferrer"
              className="artwork-card group"
            >
              <div className="artwork-frame artwork-frame-madamis">
                <div className="artwork-shine" />
                <div className="artwork-image">
                  <img
                    src="/assets/images/kemurinomukoude.webp"
                    alt="煙の向こうで"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="sparkles">
                    <span className="sparkle sparkle-1">✦</span>
                    <span className="sparkle sparkle-2">✧</span>
                    <span className="sparkle sparkle-3">✦</span>
                  </div>
                </div>
                <div className="artwork-content">
                  <h3 className="artwork-title">煙の向こうで</h3>
                  <p className="artwork-description">
                    Boothで詳細をご確認ください。
                  </p>
                  <div className="artwork-cta">
                    <span className="cta-text">Boothで見る</span>
                    <svg
                      className="cta-arrow"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </a>

            {/* Coming Soon */}
            <div className="artwork-card artwork-card-coming-soon">
              <div className="artwork-frame coming-soon-frame">
                <div className="artwork-image coming-soon-image">
                  <div className="coming-soon-content">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{ color: "var(--color-accent)", opacity: 0.5 }}
                    >
                      <path
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="coming-soon-text">Coming Soon...</span>
                  </div>
                </div>
                <div className="artwork-content coming-soon-info">
                  <h3 className="artwork-title" style={{ opacity: 0.5 }}>
                    次のマダミス
                  </h3>
                  <p className="artwork-description" style={{ opacity: 0.4 }}>
                    新しい作品を準備中です。お楽しみに！
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* スタイル */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }

        .floating-icon {
          color: var(--color-accent);
          animation: float 6s ease-in-out infinite;
        }

        .floating-icon-1 { animation-delay: 0s; }
        .floating-icon-2 { animation-delay: 2s; }

        .artwork-card {
          display: block;
          text-decoration: none;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
        }

        .artwork-card:hover {
          transform: translateY(-8px);
        }

        .artwork-card-coming-soon {
          cursor: default;
        }

        .artwork-card-coming-soon:hover {
          transform: none;
        }

        .artwork-frame {
          position: relative;
          background: linear-gradient(145deg, #fff 0%, #f8f6f3 100%);
          border-radius: 12px;
          overflow: hidden;
          box-shadow:
            0 4px 6px rgba(0, 0, 0, 0.05),
            0 10px 20px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          border: 3px solid transparent;
          background-clip: padding-box;
        }

        .artwork-frame-madamis::before {
          content: '';
          position: absolute;
          inset: -3px;
          background: linear-gradient(135deg, #d4a574 0%, #c69c6d 50%, #b8956a 100%);
          border-radius: 14px;
          z-index: -1;
        }

        .artwork-card:hover .artwork-frame {
          box-shadow:
            0 8px 16px rgba(198, 156, 109, 0.15),
            0 20px 40px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }

        .coming-soon-frame::before {
          content: '';
          position: absolute;
          inset: -3px;
          background: linear-gradient(135deg, #ccc 0%, #bbb 50%, #aaa 100%);
          border-radius: 14px;
          z-index: -1;
          opacity: 0.5;
        }

        .artwork-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.4) 50%,
            transparent 100%
          );
          transform: skewX(-20deg);
          z-index: 10;
          pointer-events: none;
          transition: left 0.6s ease;
        }

        .artwork-card:hover .artwork-shine {
          left: 150%;
        }

        .artwork-image {
          position: relative;
          height: 200px;
          overflow: hidden;
          background: linear-gradient(135deg, #e8e0d5 0%, #d4cbb8 100%);
        }

        .artwork-image img {
          transition: transform 0.4s ease;
        }

        .artwork-card:hover .artwork-image img {
          transform: scale(1.05);
        }

        .coming-soon-image {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .coming-soon-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .coming-soon-text {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-accent);
          opacity: 0.6;
          letter-spacing: 0.1em;
        }

        .sparkles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .artwork-card:hover .sparkles {
          opacity: 1;
        }

        .sparkle {
          position: absolute;
          color: #ffd700;
          font-size: 1rem;
          animation: sparkle 1.5s ease-in-out infinite;
        }

        .sparkle-1 { top: 20%; left: 15%; animation-delay: 0s; }
        .sparkle-2 { top: 40%; right: 20%; animation-delay: 0.3s; }
        .sparkle-3 { bottom: 25%; left: 30%; animation-delay: 0.6s; }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .artwork-content {
          padding: 1.25rem;
        }

        .coming-soon-info {
          opacity: 0.7;
        }

        .artwork-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 0.5rem;
        }

        .artwork-description {
          font-size: 0.875rem;
          color: var(--color-text);
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .artwork-cta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-accent);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .cta-arrow {
          transition: transform 0.3s ease;
        }

        .artwork-card:hover .cta-arrow {
          transform: translateX(4px);
        }

        @media (max-width: 768px) {
          .artwork-image {
            height: 180px;
          }

          .floating-icon {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
