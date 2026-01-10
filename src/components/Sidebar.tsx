import { Link, useLocation } from "react-router-dom";
import { useKeyDragDrop } from "../hooks/useKeyDragDrop";
import UnlockOverlay from "./UnlockOverlay";

interface SidebarProps {
  activeSection: string;
}

export default function Sidebar({ activeSection }: SidebarProps) {
  const location = useLocation();

  const {
    isDragging,
    dragPosition,
    isOverKeyhole,
    isUnlocking,
    keyIconRef,
    keyholeRef,
    handleMouseDown,
  } = useKeyDragDrop();

  const navLinks = [
    { href: "/", label: "ホーム", type: "route" },
    { href: "", label: "アトリエ作品", type: "category" },
    { href: "/nazo", label: "謎解き", type: "route", indent: true },
    { href: "/madamis", label: "マダミス", type: "route", indent: true },
    { href: "/contact", label: "お問い合わせ", type: "route" },
  ];

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    type: string,
  ) => {
    if (type === "hash") {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
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

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[280px] p-8 z-[1000] overflow-y-auto border-r hidden md:block"
      style={{
        background: "linear-gradient(180deg, #f5f0e8 0%, #ebe5d9 100%)",
        borderRightColor: "rgba(198, 156, 109, 0.2)",
      }}
    >
      <Link to="/" style={{ textDecoration: "none" }}>
        <div
          className="text-[28px] font-bold mb-12"
          style={{
            color: "var(--color-primary)",
            letterSpacing: "-0.02em",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          やまーたの
          <br />
          謎解きアトリエ
        </div>
      </Link>
      <nav>
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
                  className={`w-4 h-4 cursor-grab active:cursor-grabbing select-none transition-transform ${
                    isDragging ? "opacity-30" : "hover:scale-110"
                  }`}
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
    </aside>
  );
}
