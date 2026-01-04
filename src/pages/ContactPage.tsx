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
            ご質問、ご感想、バグ報告などお気軽にどうぞ。
            <br />
            以下の方法でご連絡いただけます。
          </p>
        </div>
      </section>

      {/* お問い合わせ方法 */}
      <section className="px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* SNS */}
          <div className="contact-card">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="icon-wrapper flex items-center justify-center">
                <img
                  src="/assets/images/logo-black.png"
                  alt="X ロゴ"
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div className="flex-1">
                <h3
                  className="text-2xl font-bold mb-3"
                  style={{ color: "var(--color-primary)" }}
                >
                  X（旧Twitter）
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Xで最新情報を発信しています。
                  <br />
                  フォローやリプライでお気軽にご連絡ください。
                </p>
                <a
                  href="https://x.com/umauma1600"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Xでやまーたをフォローする →
                </a>
              </div>
            </div>
          </div>

          {/* お問い合わせフォーム */}
          <div className="contact-card">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="icon-wrapper">
                <span>📝</span>
              </div>
              <div className="flex-1 space-y-4">
                <h3
                  className="text-2xl font-bold"
                  style={{ color: "var(--color-primary)" }}
                >
                  お問い合わせフォーム
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Googleフォームからお問い合わせを受け付けています。
                  <br />
                  メールアドレスの入力は不要です。内容をご記入の上、送信してください。
                </p>
                <div>
                  <a
                    className="btn-primary"
                    href={FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    フォームを開く →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* カスタムスタイル */}
      <style>{`
        /* カード */
        .contact-card {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
        }

        .contact-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }

        /* アイコンラッパー */
        .icon-wrapper {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #c69c6d 0%, #b88a5a 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          flex-shrink: 0;
        }

        /* ボタン */
        .btn-primary {
          display: inline-block;
          padding: 0.875rem 2rem;
          background: var(--color-accent);
          color: white;
          text-decoration: none;
          border-radius: 0.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background: #a77d4f;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(198, 156, 109, 0.3);
        }

        @media (max-width: 640px) {
          .contact-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}
