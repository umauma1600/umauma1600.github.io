export default function ContactPage() {
  const formUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLScKSm1omQGgdJoAtyZD_mOVPjpfN2lLLBFgE8ot1Z9Hn3FpxA/viewform";

  return (
    <>
      <section className="contact-header">
        <div className="contact-header__inner">
          <h1 className="contact-title">お問い合わせ</h1>
          <p className="contact-intro">
            ご質問、ご感想、バグ報告などお気軽にどうぞ。
            <br />
            以下の方法でご連絡いただけます。
          </p>
        </div>
      </section>

      <section className="contact-hero">
        <div className="contact-hero__overlay" aria-hidden="true" />
        <div className="contact-hero__overlay contact-hero__overlay--right" aria-hidden="true" />
        <div className="contact-hero__content">
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

      <style>{`
        .contact-header {
          padding: 4rem 0 3rem;
          background: linear-gradient(135deg, rgba(245, 240, 232, 0.6) 0%, rgba(235, 229, 217, 0.6) 100%);
          border-bottom: 1px solid rgba(198, 156, 109, 0.2);
        }

        .contact-header__inner {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .contact-title {
          font-size: clamp(2.5rem, 3vw + 1.5rem, 3.5rem);
          font-weight: 800;
          margin: 0 0 1rem;
          color: #e16e3a;
        }

        .contact-intro {
          font-size: 1.05rem;
          color: #4a5568;
          line-height: 1.8;
          margin: 0;
        }

        .contact-hero {
          position: relative;
          overflow: hidden;
          padding: 3rem 1.5rem 3.5rem;
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
          padding: 2rem 2rem 2.5rem;
          box-shadow: 0 22px 55px rgba(0, 0, 0, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.5);
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

        @media (max-width: 640px) {
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
