import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface SidebarProps {
  activeSection: string;
}

export default function Sidebar({ activeSection }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // ドラッグ&ドロップ関連の状態
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isOverKeyhole, setIsOverKeyhole] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const keyIconRef = useRef<HTMLDivElement>(null);
  const keyholeRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

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
    // ハッシュリンクの場合はスムーススクロール
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
      // ルートの場合は完全一致またはアクティブセクション一致
      return (
        location.pathname === href ||
        activeSection === href ||
        (href === "/" && activeSection === "#home")
      );
    } else if (type === "hash") {
      // ハッシュリンクの場合はアクティブセクション一致
      return activeSection === href;
    }
    return false;
  };

  // 鍵穴との重なりをチェック
  const checkKeyholeOverlap = useCallback((x: number, y: number) => {
    if (!keyholeRef.current) return false;
    const keyholeRect = keyholeRef.current.getBoundingClientRect();
    // 鍵穴の中心からの距離でチェック（より寛大な判定）
    const keyholeCenterX = keyholeRect.left + keyholeRect.width / 2;
    const keyholeCenterY = keyholeRect.top + keyholeRect.height / 2;
    const distance = Math.sqrt(
      Math.pow(x - keyholeCenterX, 2) + Math.pow(y - keyholeCenterY, 2),
    );
    return distance < 50; // 50px以内なら重なりとみなす
  }, []);

  // ドラッグ開始（マウス）
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!keyIconRef.current) return;
    const rect = keyIconRef.current.getBoundingClientRect();
    dragOffsetRef.current = {
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    };
    setDragPosition({
      x: e.clientX - dragOffsetRef.current.x,
      y: e.clientY - dragOffsetRef.current.y,
    });
    setIsDragging(true);
    e.preventDefault();
  }, []);

  // ドラッグ中の処理
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - dragOffsetRef.current.x;
      const y = e.clientY - dragOffsetRef.current.y;
      setDragPosition({ x, y });
      setIsOverKeyhole(checkKeyholeOverlap(e.clientX, e.clientY));
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (checkKeyholeOverlap(e.clientX, e.clientY)) {
        // 鍵穴にドロップ成功！扉開きアニメーションを開始
        setIsUnlocking(true);
      }
      setIsDragging(false);
      setIsOverKeyhole(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, checkKeyholeOverlap]);

  // 扉開きアニメーション完了後にナビゲート
  useEffect(() => {
    if (isUnlocking) {
      const timer = setTimeout(() => {
        void navigate("/cafe");
      }, 1200); // アニメーション時間に合わせる
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isUnlocking, navigate]);

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
          // カテゴリの場合はリンクなしで表示（ドラッグ可能な鍵アイコン付き）
          if (link.type === "category") {
            return (
              <div
                key={link.label}
                className="py-[14px] px-5 mb-2 text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
                style={{ color: "var(--color-accent)" }}
              >
                {/* ドラッグ可能な鍵アイコン */}
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

      {/* 鍵穴アイコン（ドロップターゲット） */}
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

      {/* 扉開きアニメーション */}
      {isUnlocking && (
        <div className="fixed inset-0 z-[3000] pointer-events-none overflow-hidden">
          {/* 左の扉 */}
          <div
            className="absolute top-0 left-0 w-1/2 h-full origin-left"
            style={{
              background:
                "linear-gradient(90deg, #3d2f23 0%, #5a4535 50%, #3d2f23 100%)",
              boxShadow: "inset -20px 0 40px rgba(0,0,0,0.3)",
              animation: "doorOpenLeft 1s ease-in-out forwards",
            }}
          >
            {/* 扉の装飾 */}
            <div className="absolute inset-4 border-2 border-[#c69c6d]/30 rounded-sm" />
            <div className="absolute top-1/2 right-6 w-3 h-8 bg-[#c69c6d] rounded-full transform -translate-y-1/2" />
          </div>
          {/* 右の扉 */}
          <div
            className="absolute top-0 right-0 w-1/2 h-full origin-right"
            style={{
              background:
                "linear-gradient(270deg, #3d2f23 0%, #5a4535 50%, #3d2f23 100%)",
              boxShadow: "inset 20px 0 40px rgba(0,0,0,0.3)",
              animation: "doorOpenRight 1s ease-in-out forwards",
            }}
          >
            {/* 扉の装飾 */}
            <div className="absolute inset-4 border-2 border-[#c69c6d]/30 rounded-sm" />
            <div className="absolute top-1/2 left-6 w-3 h-8 bg-[#c69c6d] rounded-full transform -translate-y-1/2" />
          </div>
          {/* 光のエフェクト */}
          <div
            className="absolute inset-0 bg-[#faf8f5]"
            style={{
              animation: "fadeIn 0.8s ease-in-out 0.4s forwards",
              opacity: 0,
            }}
          />
          <style>{`
            @keyframes doorOpenLeft {
              0% {
                transform: perspective(1200px) rotateY(0deg);
              }
              100% {
                transform: perspective(1200px) rotateY(-105deg);
              }
            }
            @keyframes doorOpenRight {
              0% {
                transform: perspective(1200px) rotateY(0deg);
              }
              100% {
                transform: perspective(1200px) rotateY(105deg);
              }
            }
            @keyframes fadeIn {
              0% {
                opacity: 0;
              }
              100% {
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}
    </aside>
  );
}
