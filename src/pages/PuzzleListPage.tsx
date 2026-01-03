import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function PuzzleListPage() {
  return (
    <>
      {/* ページヘッダー */}
      <section
        style={{
          padding: "4rem 0 3rem",
          background:
            "linear-gradient(135deg, rgba(245, 240, 232, 0.6) 0%, rgba(235, 229, 217, 0.6) 100%)",
          borderBottom: "1px solid rgba(198, 156, 109, 0.2)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "var(--color-primary)" }}
          >
            謎解き
          </h1>
          <p
            className="text-lg md:text-xl"
            style={{ color: "var(--color-text)" }}
          >
            ブラウザで遊べるインタラクティブな謎解きコンテンツ
          </p>
        </div>
      </section>

      {/* 謎解きコンテンツ一覧 */}
      <section className="px-6 md:px-12 lg:px-20 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* 謎解きカードグリッド */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* 逆転の宝箱 */}
            <div className="puzzle-card">
              <div className="puzzle-card-image">
                <span style={{ fontSize: "3rem" }}>📦</span>
              </div>
              <div className="puzzle-card-content">
                <div className="mb-3">
                  <span className="badge badge-difficulty-easy">
                    初心者向け
                  </span>
                  <span className="badge badge-tag">ドラッグ</span>
                </div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: "var(--color-primary)" }}
                >
                  逆転の宝箱
                </h3>
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: "var(--color-text)" }}
                >
                  4桁のダイヤル錠がかかった古びた宝箱。常識にとらわれていませんか？固定観念を逆転させる謎解き。
                </p>
                <div className="mt-auto">
                  <div className="info-item">
                    <svg
                      className="info-icon"
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
                    <span>難易度：★☆☆☆☆</span>
                  </div>
                  <div className="info-item">
                    <svg
                      className="info-icon"
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
                    <span>プレイ時間：約10分</span>
                  </div>
                </div>
              </div>
              <div className="puzzle-card-footer">
                <Link to="/nazo/treasure-box" className="btn-primary">
                  挑戦する
                </Link>
              </div>
            </div>

            {/* 準備中コンテンツ - 非表示 */}
          </div>
        </div>
      </section>

      {/* フッター */}
      <Footer />

      {/* カスタムスタイル */}
      <style>{`
        /* 謎解きカード */
        .puzzle-card {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .puzzle-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }

        .puzzle-card-image {
          width: 100%;
          height: 220px;
          background: linear-gradient(135deg, #e8e0d5 0%, #d4cbb8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          position: relative;
          overflow: hidden;
        }

        .puzzle-card-content {
          padding: 1.5rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .puzzle-card-footer {
          padding: 0 1.5rem 1.5rem;
          margin-top: auto;
        }

        /* バッジ */
        .badge {
          display: inline-block;
          padding: 0.375rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-right: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .badge-difficulty-easy {
          background: #d1fae5;
          color: #065f46;
        }

        .badge-difficulty-medium {
          background: #fed7aa;
          color: #9a3412;
        }

        .badge-difficulty-hard {
          background: #fecaca;
          color: #991b1b;
        }

        .badge-status {
          background: #fef3c7;
          color: #92400e;
        }

        .badge-tag {
          background: #e0e7ff;
          color: #3730a3;
        }

        /* ボタン */
        .btn-primary {
          display: inline-block;
          padding: 0.875rem 1.75rem;
          background: var(--color-accent);
          color: white;
          text-decoration: none;
          border-radius: 0.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          text-align: center;
          width: 100%;
        }

        .btn-primary:hover {
          background: #a77d4f;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(198, 156, 109, 0.3);
        }

        .btn-primary:disabled {
          background: #cbd5e0;
          cursor: not-allowed;
          transform: none;
        }

        /* 情報表示 */
        .info-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--color-text);
          margin-bottom: 0.5rem;
        }

        .info-icon {
          width: 1.25rem;
          height: 1.25rem;
          color: var(--color-accent);
        }

        /* レスポンシブ */
        @media (max-width: 768px) {
          .puzzle-card-image {
            height: 180px;
          }
        }
      `}</style>
    </>
  );
}
