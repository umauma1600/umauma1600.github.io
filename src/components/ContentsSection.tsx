import { useState } from "react";
import { Link } from "react-router-dom";

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
          {/* 謎解き - 逆転の宝箱 */}
          <Link to="/nazo/treasure-box" className="artwork-card group">
            <div className="artwork-frame">
              <div className="artwork-shine" />
              <div className="artwork-image">
                <img
                  src="/assets/images/treasure-box-thumbnail.jpg"
                  alt="逆転の宝箱"
                  className="w-full h-full object-cover"
                />
                <div className="sparkles">
                  <span className="sparkle sparkle-1">✦</span>
                  <span className="sparkle sparkle-2">✧</span>
                  <span className="sparkle sparkle-3">✦</span>
                </div>
              </div>
              <div className="artwork-content">
                <div className="flex items-center gap-2 mb-2">
                  <span className="genre-badge genre-badge-nazo">謎解き</span>
                  <span className="difficulty-badge">初心者向け</span>
                </div>
                <h3 className="artwork-title">逆転の宝箱</h3>
                <p className="artwork-description">
                  4桁のダイヤル錠がかかった古びた宝箱。常識にとらわれていませんか？
                </p>
                <div className="artwork-meta">
                  <span className="meta-item">
                    <svg
                      className="meta-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    ★☆☆☆☆
                  </span>
                  <span className="meta-item">
                    <svg
                      className="meta-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    約10分
                  </span>
                </div>
                <div className="artwork-cta artwork-cta-nazo">
                  <span className="cta-text">挑戦する</span>
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
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* マダミス - 煙の向こうで */}
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
                  src="/assets/images/kemurinomukoude.png"
                  alt="煙の向こうで"
                  className="w-full h-full object-cover"
                />
                <div className="sparkles sparkles-madamis">
                  <span className="sparkle sparkle-1">✦</span>
                  <span className="sparkle sparkle-2">✧</span>
                  <span className="sparkle sparkle-3">✦</span>
                </div>
              </div>
              <div className="artwork-content">
                <div className="flex items-center gap-2 mb-2">
                  <span className="genre-badge genre-badge-madamis">
                    マダミス
                  </span>
                </div>
                <h3 className="artwork-title">煙の向こうで</h3>
                <p className="artwork-description">
                  Boothで詳細をご確認ください。
                </p>
                <div className="artwork-cta artwork-cta-madamis">
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

        /* 作品カード */
        .artwork-card {
          display: block;
          text-decoration: none;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .artwork-card:hover {
          transform: translateY(-8px);
        }

        /* 額縁フレーム */
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

        .artwork-frame::before {
          content: '';
          position: absolute;
          inset: -3px;
          background: linear-gradient(135deg, #d4a574 0%, #c69c6d 50%, #b8956a 100%);
          border-radius: 14px;
          z-index: -1;
        }

        .artwork-frame-madamis::before {
          background: linear-gradient(135deg, #d4a574 0%, #c69c6d 50%, #b8956a 100%);
        }

        .artwork-card:hover .artwork-frame {
          box-shadow:
            0 8px 16px rgba(198, 156, 109, 0.15),
            0 20px 40px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }

        .artwork-card:hover .artwork-frame-madamis {
          box-shadow:
            0 8px 16px rgba(198, 156, 109, 0.15),
            0 20px 40px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }

        /* 光のエフェクト */
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

        /* サムネイル画像 */
        .artwork-image {
          position: relative;
          height: 220px;
          overflow: hidden;
          background: linear-gradient(135deg, #e8e0d5 0%, #d4cbb8 100%);
        }

        .artwork-image img {
          transition: transform 0.4s ease;
        }

        .artwork-card:hover .artwork-image img {
          transform: scale(1.05);
        }

        /* キラキラエフェクト */
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

        .sparkles-madamis .sparkle {
          color: #ffd700;
        }

        .sparkle-1 { top: 20%; left: 15%; animation-delay: 0s; }
        .sparkle-2 { top: 40%; right: 20%; animation-delay: 0.3s; }
        .sparkle-3 { bottom: 25%; left: 30%; animation-delay: 0.6s; }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        /* コンテンツ部分 */
        .artwork-content {
          padding: 1.25rem;
        }

        /* ジャンルバッジ */
        .genre-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .genre-badge-nazo {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
        }

        .genre-badge-madamis {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
        }

        .difficulty-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: #065f46;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
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

        .artwork-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.8rem;
          color: var(--color-text);
        }

        .meta-icon {
          width: 1rem;
          height: 1rem;
          color: var(--color-accent);
        }

        /* CTAボタン風 */
        .artwork-cta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .artwork-cta-nazo {
          color: var(--color-accent);
        }

        .artwork-cta-madamis {
          color: var(--color-accent);
        }

        .cta-arrow {
          transition: transform 0.3s ease;
        }

        .artwork-card:hover .cta-arrow {
          transform: translateX(4px);
        }

        /* レスポンシブ */
        @media (max-width: 768px) {
          .artwork-image {
            height: 180px;
          }

          .floating-key {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
