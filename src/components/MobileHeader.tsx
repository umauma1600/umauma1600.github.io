import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useKeyDragDrop } from "../hooks/useKeyDragDrop";
import UnlockOverlay from "./UnlockOverlay";

interface MobileHeaderProps {
  activeSection: string;
}

export default function MobileHeader({ activeSection }: MobileHeaderProps) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const {
    isDragging,
    dragPosition,
    isOverKeyhole,
    isUnlocking,
    keyIconRef,
    keyholeRef,
    handleMouseDown,
    handleTouchStart,
  } = useKeyDragDrop({ onUnlockStart: closeMenu });

  const navLinks = [
    { href: "/", label: "ホーム", type: "route" },
    { href: "", label: "アトリエ作品", type: "category" },
    { href: "/nazo", label: "謎解き", type: "route", indent: true },
    { href: "/madamis", label: "マダミス", type: "route", indent: true },
    { href: "/contact", label: "お問い合わせ", type: "route" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    type: string,
  ) => {
    closeMenu();
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
  }, [isMenuOpen, closeMenu]);

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
          if (link.type === "category") {
            return (
              <div
                key={link.label}
                className="py-[14px] px-5 mb-2 text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
                style={{ color: "var(--color-accent)" }}
              >
                <div
                  ref={keyIconRef}
                  className={`w-4 h-4 cursor-grab active:cursor-grabbing touch-none select-none transition-transform ${
                    isDragging ? "opacity-30" : "hover:scale-110"
                  }`}
                  onTouchStart={handleTouchStart}
                  onMouseDown={handleMouseDown}
                >
                  <svg
                    className="w-full h-full"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
                {link.label}
              </div>
            );
          }

          const active = isActive(link.href, link.type);
          const indent = "indent" in link && link.indent;
          const className = `block py-[14px] px-5 mb-2 rounded-lg font-medium transition-all duration-200 ${
            active
              ? "bg-[rgba(198,156,109,0.25)]"
              : "hover:bg-[rgba(198,156,109,0.25)]"
          } hover:translate-x-1 ${indent ? "ml-4" : ""}`;
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

        {/* 鍵穴アイコン */}
        <div
          ref={keyholeRef}
          className={`mt-8 flex justify-center transition-all duration-200 ${
            isOverKeyhole ? "scale-125" : ""
          }`}
        >
          <svg
            className={`w-10 h-10 transition-all duration-200 ${
              isOverKeyhole ? "opacity-100" : "opacity-40"
            }`}
            viewBox="0 0 100 100"
            style={{
              color: isOverKeyhole
                ? "var(--color-accent)"
                : "var(--color-primary)",
              filter: isOverKeyhole
                ? "drop-shadow(0 0 10px var(--color-accent))"
                : "none",
            }}
          >
            <circle cx="50" cy="50" r="48" fill="currentColor" />
            <ellipse cx="50" cy="38" rx="12" ry="12" fill="#f5f0e8" />
            <polygon points="38,42 62,42 58,72 42,72" fill="#f5f0e8" />
          </svg>
        </div>
      </nav>

      {/* オーバーレイ */}
      <div
        className={`md:hidden fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-[999] transition-all duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeMenu}
      />

      {/* ドラッグ中の鍵アイコン */}
      {isDragging && (
        <div
          className="fixed z-[2000] pointer-events-none"
          style={{
            left: dragPosition.x - 12,
            top: dragPosition.y - 12,
          }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="var(--color-accent)"
            viewBox="0 0 24 24"
            style={{
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        </div>
      )}

      <UnlockOverlay isVisible={isUnlocking} />
    </>
  );
}
