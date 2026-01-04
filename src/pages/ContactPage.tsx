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
              <div className="icon-wrapper">
                <span>📱</span>
              </div>
              <div className="flex-1">
                <h3
                  className="text-2xl font-bold mb-3"
                  style={{ color: "var(--color-primary)" }}
                >
                  SNS
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  X（旧Twitter）でもご連絡を受け付けています。
                  <br />
                  ちょっとした質問やご感想などお気軽にどうぞ。
                </p>
                <a
                  href="https://x.com/umauma1600"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Xでメッセージを送る →
                </a>
              </div>
            </div>
          </div>

          {/* メール */}
          <div className="contact-card">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="icon-wrapper">
                <span>✉️</span>
              </div>
              <div className="flex-1">
                <h3
                  className="text-2xl font-bold mb-3"
                  style={{ color: "var(--color-primary)" }}
                >
                  メール
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  プライベートなご連絡やご相談など、メールでもお気軽にご連絡ください。
                </p>
                <a
                  href="mailto:umauma1600@gmail.com"
                  className="btn-primary"
                >
                  メールを送る →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 注意事項 */}
      <section className="px-6 pb-12 md:pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 border-l-4 border-orange-500">
            <h4
              className="text-xl font-bold mb-4"
              style={{ color: "var(--color-primary)" }}
            >
              お問い合わせの際の注意事項
            </h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span
                  className="mr-3 flex-shrink-0 font-bold"
                  style={{ color: "var(--color-accent)" }}
                >
                  ▸
                </span>
                <span>回答には時間がかかる場合があります。</span>
              </li>
              <li className="flex items-start">
                <span
                  className="mr-3 flex-shrink-0 font-bold"
                  style={{ color: "var(--color-accent)" }}
                >
                  ▸
                </span>
                <span>すべてのお問い合わせに返信できるとは限りません。</span>
              </li>
              <li className="flex items-start">
                <span
                  className="mr-3 flex-shrink-0 font-bold"
                  style={{ color: "var(--color-accent)" }}
                >
                  ▸
                </span>
                <span>不適切な内容のお問い合わせにはお答えできません。</span>
              </li>
              <li className="flex items-start">
                <span
                  className="mr-3 flex-shrink-0 font-bold"
                  style={{ color: "var(--color-accent)" }}
                >
                  ▸
                </span>
                <span>
                  バグを発見した場合は、できるだけ詳しい情報（発生環境、再現手順など）をお知らせください。
                </span>
              </li>
            </ul>
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

        .btn-disabled {
          display: inline-block;
          padding: 0.875rem 2rem;
          background: #e2e8f0;
          color: #a0aec0;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}
