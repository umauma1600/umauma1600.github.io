import HeroSection from "../components/HeroSection";
import ContentsSection from "../components/ContentsSection";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <>
      {/* ヒーローセクション */}
      <HeroSection />

      {/* コンテンツセクション */}
      <ContentsSection />

      {/* フッター */}
      <Footer />
    </>
  );
}
