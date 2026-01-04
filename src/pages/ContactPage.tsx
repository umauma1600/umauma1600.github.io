export default function ContactPage() {
  const formUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLScKSm1omQGgdJoAtyZD_mOVPjpfN2lLLBFgE8ot1Z9Hn3FpxA/viewform";

  return (
    <>
      <section className="contact-hero">
        <div className="contact-hero__overlay" aria-hidden="true" />
        <div className="contact-hero__overlay contact-hero__overlay--right" aria-hidden="true" />
        <div className="contact-hero__content">
          <div className="contact-badge">
            <span className="contact-badge__title">Contact</span>
            <span className="contact-badge__subtitle">お問い合わせ</span>
          </div>

          <p className="contact-lead">
            謎解きコンテンツやゲームの制作依頼・ご質問など、お気軽にお問い合わせください。
            <br />
            便利なフォームとX（旧Twitter）の2つの方法をご用意しています。
          </p>

          <div className="contact-grid">
            <div className="contact-card contact-card--accent">
              <div className="contact-card__header">
                <div className="contact-icon" aria-hidden="true">
                  <span role="img" aria-label="pencil">
                    📝
                  </span>
                </div>
                <div>
                  <h3 className="contact-card__title">お問い合わせフォーム</h3>
                  <p className="contact-card__caption">Googleフォームで受け付けています</p>
                </div>
              </div>
              <p className="contact-card__description">
                フォームにアクセスし、内容をご記入ください。メールアドレスの入力は不要です。
              </p>
              <a
                className="contact-button contact-button--primary"
                href={formUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                フォームを開く
              </a>
            </div>

            <div className="contact-card">
              <div className="contact-card__header">
                <div className="contact-icon contact-icon--neutral" aria-hidden="true">
                  <img src="/assets/images/logo-black.png" alt="X ロゴ" className="contact-icon__image" />
                </div>
                <div>
                  <h3 className="contact-card__title">X（旧Twitter）</h3>
                  <p className="contact-card__caption">フォローやDMでご連絡ください</p>
                </div>
              </div>
              <p className="contact-card__description">
                最新情報や制作の進捗もXで発信しています。お気軽にリプライやDMで声をお寄せください。
              </p>
              <a
                className="contact-button contact-button--ghost"
                href="https://x.com/umauma1600"
                target="_blank"
                rel="noopener noreferrer"
              >
                Xでやまーたに連絡する
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-notes">
        <div className="contact-notes__inner">
          <h4 className="contact-notes__title">お願い</h4>
          <ul className="contact-notes__list">
            <li>返信までお時間をいただく場合があります。</li>
            <li>内容によってはお答えできない場合があります。</li>
            <li>不具合のご報告は発生環境や再現手順を添えていただけると助かります。</li>
          </ul>
        </div>
      </section>

      <style>{`
        .contact-hero {
          position: relative;
          overflow: hidden;
          padding: 4rem 1.5rem 3rem;
          background: linear-gradient(180deg, #ffb347 0%, #ff8554 100%);
        }

        .contact-hero__overlay {
          position: absolute;
          width: 360px;
          height: 360px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 60%);
          top: -80px;
          left: -120px;
          filter: blur(2px);
        }

        .contact-hero__overlay--right {
          top: 120px;
          left: auto;
          right: -140px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 60%);
        }

        .contact-hero__content {
          position: relative;
          max-width: 880px;
          margin: 0 auto;
          background: linear-gradient(145deg, #ffffff, #fff6ed);
          border-radius: 24px;
          padding: 2.5rem 2rem;
          box-shadow: 0 22px 55px rgba(0, 0, 0, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .contact-badge {
          width: 160px;
          height: 160px;
          margin: -140px auto 1.5rem;
          background: linear-gradient(145deg, #ffb347 0%, #ff9557 100%);
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow: 0 18px 30px rgba(255, 133, 84, 0.4);
          text-align: center;
          border: 6px solid #fff0e1;
        }

        .contact-badge__title {
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .contact-badge__subtitle {
          font-size: 0.9rem;
          opacity: 0.95;
        }

        .contact-lead {
          text-align: center;
          color: #5b4b3f;
          line-height: 1.8;
          font-size: 1.05rem;
          margin-bottom: 2rem;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.5rem;
        }

        .contact-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 1.75rem;
          box-shadow: 0 12px 26px rgba(0, 0, 0, 0.08);
          border: 1px solid #f2e8db;
        }

        .contact-card--accent {
          background: linear-gradient(165deg, #fff4e5 0%, #ffe8d0 100%);
          border-color: #ffd0a8;
        }

        .contact-card__header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .contact-card__title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #e16e3a;
          margin: 0;
        }

        .contact-card__caption {
          margin: 0.25rem 0 0;
          color: #8b735b;
          font-size: 0.9rem;
        }

        .contact-card__description {
          color: #5b4b3f;
          line-height: 1.7;
          margin: 0 0 1.25rem;
        }

        .contact-icon {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          background: linear-gradient(135deg, #ffb347 0%, #ff8d5a 100%);
          display: grid;
          place-items: center;
          font-size: 1.6rem;
          color: #fff;
          box-shadow: 0 10px 18px rgba(255, 141, 90, 0.25);
        }

        .contact-icon--neutral {
          background: #ffffff;
          border: 1px solid #ebe4db;
          box-shadow: 0 10px 18px rgba(0, 0, 0, 0.06);
        }

        .contact-icon__image {
          width: 28px;
          height: 28px;
          object-fit: contain;
        }

        .contact-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.85rem 1.6rem;
          border-radius: 999px;
          font-weight: 700;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }

        .contact-button--primary {
          background: linear-gradient(135deg, #ffb347 0%, #ff8d5a 100%);
          color: #fff;
          box-shadow: 0 12px 24px rgba(255, 141, 90, 0.35);
          border: none;
        }

        .contact-button--primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 28px rgba(255, 141, 90, 0.45);
        }

        .contact-button--ghost {
          background: #ffffff;
          color: #e16e3a;
          border: 1px solid #efd9c5;
        }

        .contact-button--ghost:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 22px rgba(0, 0, 0, 0.08);
          background: #fff7ef;
        }

        .contact-notes {
          padding: 0 1.5rem 3rem;
          background: linear-gradient(180deg, #fff7ef 0%, #fff 100%);
        }

        .contact-notes__inner {
          max-width: 880px;
          margin: -0.5rem auto 0;
          background: #fff;
          border-radius: 16px;
          border: 1px solid #f0e4d7;
          box-shadow: 0 10px 22px rgba(0, 0, 0, 0.06);
          padding: 1.75rem;
        }

        .contact-notes__title {
          margin: 0 0 0.75rem;
          font-size: 1.1rem;
          font-weight: 700;
          color: #e16e3a;
        }

        .contact-notes__list {
          margin: 0;
          padding-left: 1.25rem;
          color: #5b4b3f;
          line-height: 1.7;
          display: grid;
          gap: 0.35rem;
        }

        @media (max-width: 640px) {
          .contact-badge {
            width: 130px;
            height: 130px;
            margin-top: -120px;
          }

          .contact-hero__content {
            padding: 2rem 1.25rem;
          }

          .contact-card__header {
            align-items: flex-start;
          }

          .contact-icon {
            width: 52px;
            height: 52px;
          }
        }
      `}</style>
    </>
  );
}
