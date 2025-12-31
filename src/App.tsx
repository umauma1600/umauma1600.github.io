import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import MobileHeader from "./components/MobileHeader";
import HeroSection from "./components/HeroSection";
import ContentsSection from "./components/ContentsSection";
import Footer from "./components/Footer";

function App() {
  const [activeSection, setActiveSection] = useState("#home");

  useEffect(() => {
    // スクロール位置に応じてアクティブセクションを更新
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
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 初期表示時にも実行

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* サイドバー（デスクトップ） */}
      <Sidebar activeSection={activeSection} />

      {/* モバイルヘッダー */}
      <MobileHeader activeSection={activeSection} />

      {/* メインコンテンツエリア */}
      <main className="md:ml-[280px] min-h-screen md:pt-0 pt-[70px]">
        {/* ヒーローセクション */}
        <HeroSection />

        {/* コンテンツセクション */}
        <ContentsSection />

        {/* フッター */}
        <Footer />
      </main>
    </>
  );
}

export default App;
