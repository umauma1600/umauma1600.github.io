const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScKSm1omQGgdJoAtyZD_mOVPjpfN2lLLBFgE8ot1Z9Hn3FpxA/viewform";

export default function ContactPage() {
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
        <div className="max-w-4xl mx-auto px-6">
          <h1
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: "var(--color-primary)" }}
          >
            お問い合わせ
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            以下の方法でご連絡いただけます。
          </p>
        </div>
      </section>

      {/* メインコンテンツ */}
      <section className="px-6 py-12 md:py-16">
        <div className="content-wrapper">
          {/* フォームカード */}
          <div className="form-card">
            <div className="form-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
            </div>
            <h2 className="form-title">お問い合わせフォーム</h2>
            <p className="form-intro">
              本サイトへのご相談やご要望など
              <br className="hidden sm:inline" />
              お気軽にお問い合わせください。
            </p>
            <p className="form-description">
              Googleフォームからお問い合わせを受け付けています。
              <br />
              メールアドレスの入力は不要です。
            </p>
            <a
              href={FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="form-button"
            >
              <span>フォームを開く</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15,3 21,3 21,9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>

          {/* その他の連絡先 */}
          <div className="other-contact">
            <h3 className="other-title">その他の連絡先</h3>
            <p className="other-description">
              SNSでのお問い合わせも受け付けています。
            </p>
            <div className="social-links">
              <a
                href="https://x.com/umauma1600"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <img
                  src="/assets/images/logo-black.png"
                  alt="X"
                  className="social-icon"
                />
                <span className="social-handle">@umauma1600</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* スタイル */}
      <style>{`
        .content-wrapper {
          max-width: 600px;
          margin: 0 auto;
        }

        /* フォームカード */
        .form-card {
          background: white;
          border-radius: 1.5rem;
          padding: 2.5rem 2rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #c69c6d 0%, #b88a5a 100%);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: white;
        }

        .form-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 1rem;
        }

        .form-intro {
          color: var(--color-primary);
          font-size: 1rem;
          font-weight: 500;
          line-height: 1.8;
          margin-bottom: 1rem;
        }

        .form-description {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.7;
          margin-bottom: 2rem;
        }

        .form-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2.5rem;
          background: linear-gradient(135deg, #c69c6d 0%, #b88a5a 100%);
          color: white;
          text-decoration: none;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(198, 156, 109, 0.3);
        }

        .form-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(198, 156, 109, 0.4);
        }

        /* その他の連絡先 */
        .other-contact {
          text-align: center;
          padding: 2rem 0;
        }

        .other-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 0.5rem;
        }

        .other-description {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        .social-links {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .social-link {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1.5rem;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 9999px;
          text-decoration: none;
          color: var(--color-primary);
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          border-color: var(--color-accent);
          background: #faf8f5;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .social-icon {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }

        .social-handle {
          font-size: 0.95rem;
        }

        /* レスポンシブ対応 */
        @media (max-width: 640px) {
          .form-card {
            padding: 2rem 1.5rem;
            border-radius: 1rem;
          }

          .form-icon {
            width: 56px;
            height: 56px;
          }

          .form-title {
            font-size: 1.25rem;
          }

          .form-intro {
            font-size: 0.95rem;
          }

          .form-description {
            font-size: 0.85rem;
          }

          .form-button {
            padding: 0.875rem 2rem;
            font-size: 0.95rem;
          }
        }
      `}</style>
    </>
  );
}
