import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

interface MobileHeaderProps {
  activeSection: string;
}

export default function MobileHeader({ activeSection }: MobileHeaderProps) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "ホーム", type: "route" },
    { href: "#contents", label: "コンテンツ", type: "hash" },
    { href: "/nazo", label: "謎解き", type: "route" },
    { href: "/contact", label: "お問い合わせ", type: "route" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    type: string,
  ) => {
    // メニューを閉じる
    closeMenu();

    // ハッシュリンクの場合はスムーススクロール
    if (type === "hash") {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const offset = 80;
        const targetPosition =
          targetElement.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  const isActive = (href: string, type: string) => {
    if (type === "route") {
      return (
        location.pathname === href ||
        activeSection === href ||
        (href === "/" && activeSection === "#home")
      );
    } else if (type === "hash") {
      return activeSection === href;
    }
    return false;
  };

  // bodyのスクロールを制御
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // ESCキーでメニューを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        closeMenu();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* モバイルヘッダー */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-6 py-4 z-[200] flex items-center justify-between">
        <Link to="/" style={{ textDecoration: "none" }}>
          <div
            className="text-xl font-bold"
            style={{
              color: "var(--color-primary)",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            やまーたの謎解きアトリエ
          </div>
        </Link>
        <div
          className={`w-7 h-5 relative cursor-pointer ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <span
            className={`block absolute h-0.5 w-full rounded transition-all duration-[250ms] ease-in-out ${
              isMenuOpen ? "top-[9px] rotate-[135deg]" : "top-0 rotate-0"
            }`}
            style={{ background: "var(--color-primary)" }}
          />
          <span
            className={`block absolute h-0.5 w-full rounded transition-all duration-[250ms] ease-in-out top-[9px] ${
              isMenuOpen ? "opacity-0 -left-[60px]" : "opacity-100 left-0"
            }`}
            style={{ background: "var(--color-primary)" }}
          />
          <span
            className={`block absolute h-0.5 w-full rounded transition-all duration-[250ms] ease-in-out ${
              isMenuOpen ? "top-[9px] rotate-[-135deg]" : "top-[18px] rotate-0"
            }`}
            style={{ background: "var(--color-primary)" }}
          />
        </div>
      </header>

      {/* モバイルメニュー */}
      <nav
        className={`md:hidden fixed top-0 w-[280px] h-screen overflow-y-auto pt-20 px-8 pb-8 z-[1001] transition-all duration-300 ${
          isMenuOpen ? "left-0" : "-left-full"
        }`}
        style={{
          background: "linear-gradient(180deg, #f5f0e8 0%, #ebe5d9 100%)",
        }}
      >
        {navLinks.map((link) => {
          const active = isActive(link.href, link.type);
          const className = `block py-[14px] px-5 mb-2 rounded-lg font-medium transition-all duration-200 ${
            active
              ? "bg-[rgba(198,156,109,0.25)]"
              : "hover:bg-[rgba(198,156,109,0.25)]"
          } hover:translate-x-1`;
          const style = {
            color: active ? "var(--color-primary)" : "var(--color-text)",
          };

          if (link.type === "route") {
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={closeMenu}
                className={className}
                style={style}
              >
                {link.label}
              </Link>
            );
          } else {
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  handleClick(e, link.href, link.type);
                }}
                className={className}
                style={style}
              >
                {link.label}
              </a>
            );
          }
        })}
      </nav>

      {/* オーバーレイ */}
      <div
        className={`md:hidden fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-[999] transition-all duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeMenu}
      />
    </>
  );
}
