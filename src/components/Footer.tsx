import { Link, useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    // ハッシュリンクの場合はスムーススクロール
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer
      className="px-6 md:px-12 lg:px-20 py-12"
      style={{
        background: "linear-gradient(135deg, #e8e0d5 0%, #d4cbb8 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <div
              className="text-2xl font-bold mb-4"
              style={{ color: "var(--color-primary)" }}
            >
              やまーたの謎解きアトリエ
            </div>
            <p style={{ color: "var(--color-text)" }}>
              謎解き・マーダーミステリーのデジタルコンテンツ
            </p>
          </div>
          <div>
            <h4
              className="font-semibold mb-4"
              style={{ color: "var(--color-primary)" }}
            >
              リンク
            </h4>
            <ul className="space-y-2" style={{ color: "var(--color-text)" }}>
              <li>
                {location.pathname === "/" ? (
                  <a
                    href="#home"
                    onClick={(e) => {
                      handleClick(e, "#home");
                    }}
                    className="transition-colors duration-200 hover:text-[#c69c6d]"
                    style={{ color: "var(--color-text)" }}
                  >
                    ホーム
                  </a>
                ) : (
                  <Link
                    to="/"
                    className="transition-colors duration-200 hover:text-[#c69c6d]"
                    style={{ color: "var(--color-text)" }}
                  >
                    ホーム
                  </Link>
                )}
              </li>
              <li>
                {location.pathname === "/" ? (
                  <a
                    href="#contents"
                    onClick={(e) => {
                      handleClick(e, "#contents");
                    }}
                    className="transition-colors duration-200 hover:text-[#c69c6d]"
                    style={{ color: "var(--color-text)" }}
                  >
                    コンテンツ
                  </a>
                ) : (
                  <Link
                    to="/"
                    className="transition-colors duration-200 hover:text-[#c69c6d]"
                    style={{ color: "var(--color-text)" }}
                  >
                    コンテンツ
                  </Link>
                )}
              </li>
              <li>
                <Link
                  to="/nazo"
                  className="transition-colors duration-200 hover:text-[#c69c6d]"
                  style={{ color: "var(--color-text)" }}
                >
                  謎解き
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="transition-colors duration-200 hover:text-[#c69c6d]"
                  style={{ color: "var(--color-text)" }}
                >
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="pt-8 text-center text-sm border-t"
          style={{
            borderTopColor: "rgba(198, 156, 109, 0.3)",
            color: "var(--color-text)",
          }}
        >
          <p className="mb-2">コンテンツ製作: umauma1600</p>
          <p className="mb-4">サイト製作: Claude AI (Anthropic)</p>
          <p>© 2025 やまーたの謎解きアトリエ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
