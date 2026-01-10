export default function HeroSection() {
  return (
    <section
      id="home"
      className="min-h-[55vh] md:min-h-[55vh] sm:min-h-[45vh] flex items-center relative overflow-hidden"
      style={{
        backgroundImage: "url('/assets/images/main-image.webp')",
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
        </div>
      </div>
    </section>
  );
}
