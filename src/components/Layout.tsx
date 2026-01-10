import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";

export default function Layout() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    // ページが変わったときにトップにスクロール
    window.scrollTo(0, 0);

    // ルートに基づいてアクティブセクションを設定
    if (location.pathname === "/") {
      // トップページの場合はスクロール位置に応じて更新
      const handleScroll = () => {
        const sections = document.querySelectorAll("section[id]");
        let current = "";

        sections.forEach((section) => {
          const sectionTop = section.getBoundingClientRect().top;
          const sectionHeight = section.getBoundingClientRect().height;

          if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
            current = `#${section.getAttribute("id")}`;
          }
        });

        if (current) {
          setActiveSection(current);
        } else if (window.scrollY < 100) {
          setActiveSection("#home");
        }
      };

      handleScroll(); // 初期表示時にも実行
      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    } else {
      // 他のページの場合はパスをそのまま使用
      setActiveSection(location.pathname);
    }
  }, [location]);

  return (
    <>
      {/* サイドバー（デスクトップ） */}
      <Sidebar activeSection={activeSection} />

      {/* モバイルヘッダー */}
      <MobileHeader activeSection={activeSection} />

      {/* メインコンテンツエリア */}
      <main className="md:ml-[280px] min-h-screen md:pt-0 pt-[70px] flex flex-col bg-[var(--color-bg)]">
        <div className="flex-1">
          <Outlet />
        </div>

        {/* フッター */}
        <footer className="py-6 bg-[var(--color-primary)]/5">
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <p className="text-[var(--color-primary)]/50 text-xs">
              © やまーたの謎解きアトリエ
            </p>
            {/* 隠しやまーた */}
            <img
              src="/assets/images/yama-taosuwari.png"
              alt=""
              className="absolute bottom-[-8px] right-3 w-7 h-auto opacity-40 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </footer>
      </main>
    </>
  );
}
