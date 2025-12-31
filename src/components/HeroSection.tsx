export default function HeroSection() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetElement = document.getElementById("contents");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="min-h-[70vh] md:min-h-[70vh] sm:min-h-[50vh] flex items-center relative overflow-hidden"
      style={{
        backgroundImage: "url('/legacy/main-image.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* グラデーションオーバーレイ */}
      <div
        className="absolute top-0 left-0 right-0 bottom-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(250, 248, 245, 0.3) 0%, rgba(235, 225, 210, 0.4) 50%, rgba(220, 200, 180, 0.35) 100%)",
        }}
      />

      {/* コンテンツ */}
      <div className="relative z-10 w-full px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            style={{
              color: "var(--color-primary)",
              textShadow:
                "2px 2px 4px rgba(255, 255, 255, 0.8), -1px -1px 2px rgba(255, 255, 255, 0.6)",
            }}
          >
            やまーたの
            <br />
            謎解きアトリエ
          </h1>
          <p
            className="text-lg md:text-2xl mb-8 leading-relaxed"
            style={{
              color: "var(--color-text)",
              textShadow: "1px 1px 3px rgba(255, 255, 255, 0.9)",
            }}
          >
            ひとりでゆっくり謎を解いたり、
            <br />
            みんなでマダミスを楽しんだり。
            <br />
            気ままに遊べるコンテンツをつくっています。
          </p>
          <a
            href="#contents"
            onClick={handleClick}
            className="inline-block py-4 px-8 rounded-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
            style={{
              background: "var(--color-accent)",
              color: "white",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#a77d4f";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-accent)";
            }}
          >
            コンテンツを見る
          </a>
        </div>
      </div>
    </section>
  );
}
