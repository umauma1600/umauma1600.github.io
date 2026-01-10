import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface MobileHeaderProps {
  activeSection: string;
}

export default function MobileHeader({ activeSection }: MobileHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

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
  }, [isMenuOpen, closeMenu]);

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

  // ドラッグ開始（タッチ）
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!keyIconRef.current) return;
    const touch = e.touches[0];
    const rect = keyIconRef.current.getBoundingClientRect();
    dragOffsetRef.current = {
      x: touch.clientX - rect.left - rect.width / 2,
      y: touch.clientY - rect.top - rect.height / 2,
    };
    setDragPosition({
      x: touch.clientX - dragOffsetRef.current.x,
      y: touch.clientY - dragOffsetRef.current.y,
    });
    setIsDragging(true);
    e.preventDefault();
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

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const x = touch.clientX - dragOffsetRef.current.x;
      const y = touch.clientY - dragOffsetRef.current.y;
      setDragPosition({ x, y });
      setIsOverKeyhole(checkKeyholeOverlap(touch.clientX, touch.clientY));
      e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - dragOffsetRef.current.x;
      const y = e.clientY - dragOffsetRef.current.y;
      setDragPosition({ x, y });
      setIsOverKeyhole(checkKeyholeOverlap(e.clientX, e.clientY));
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      if (checkKeyholeOverlap(touch.clientX, touch.clientY)) {
        // 鍵穴にドロップ成功！扉開きアニメーションを開始
        closeMenu();
        setIsUnlocking(true);
      }
      setIsDragging(false);
      setIsOverKeyhole(false);
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (checkKeyholeOverlap(e.clientX, e.clientY)) {
        // 鍵穴にドロップ成功！扉開きアニメーションを開始
        closeMenu();
        setIsUnlocking(true);
      }
      setIsDragging(false);
      setIsOverKeyhole(false);
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, checkKeyholeOverlap, closeMenu]);

  // ローディングアニメーション完了後にナビゲート
  useEffect(() => {
    if (isUnlocking) {
      const timer = setTimeout(() => {
        void navigate("/cafe");
      }, 2000); // アニメーション時間に合わせる
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isUnlocking, navigate]);

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

      {/* 光のエフェクト＆ローディング画面 */}
      {isUnlocking && (
        <div className="fixed inset-0 z-[3000] overflow-hidden">
          {/* 中央から広がる光 */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at center, rgba(251, 243, 219, 1) 0%, rgba(198, 156, 109, 0.3) 50%, transparent 70%)",
              animation: "lightExpand 0.8s ease-out forwards",
            }}
          />
          {/* 背景のフェードイン */}
          <div
            className="absolute inset-0 bg-amber-50"
            style={{
              animation: "bgFadeIn 0.6s ease-out 0.3s forwards",
              opacity: 0,
            }}
          />
          {/* ウェルカムメッセージ */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              animation: "contentFadeIn 0.5s ease-out 0.6s forwards",
              opacity: 0,
            }}
          >
            <div className="text-center">
              <p className="text-amber-800 text-lg mb-2">いらっしゃいませ</p>
              <h2
                className="text-2xl font-bold text-amber-900"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Café ひみつの鍵へようこそ
              </h2>
              <div className="mt-4 flex justify-center">
                <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          </div>
          <style>{`
            @keyframes lightExpand {
              0% {
                transform: scale(0);
                opacity: 1;
              }
              100% {
                transform: scale(3);
                opacity: 0.8;
              }
            }
            @keyframes bgFadeIn {
              0% {
                opacity: 0;
              }
              100% {
                opacity: 1;
              }
            }
            @keyframes contentFadeIn {
              0% {
                opacity: 0;
                transform: translateY(10px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
