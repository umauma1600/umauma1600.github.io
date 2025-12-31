interface SidebarProps {
  activeSection: string;
}

export default function Sidebar({ activeSection }: SidebarProps) {
  const navLinks = [
    { href: "#home", label: "ホーム" },
    { href: "#contents", label: "コンテンツ" },
    { href: "/legacy/contents/nazo/", label: "謎解き" },
    { href: "/legacy/contact/", label: "お問い合わせ" },
  ];

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    // 外部リンクの場合はデフォルト動作
    if (href.startsWith("/legacy/")) {
      return;
    }

    // ハッシュリンクの場合はスムーススクロール
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[280px] p-8 z-[1000] overflow-y-auto border-r hidden md:block"
      style={{
        background: "linear-gradient(180deg, #f5f0e8 0%, #ebe5d9 100%)",
        borderRightColor: "rgba(198, 156, 109, 0.2)",
      }}
    >
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
      <nav>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => {
              handleClick(e, link.href);
            }}
            className={`block py-[14px] px-5 mb-2 rounded-lg font-medium transition-all duration-200 ${
              activeSection === link.href
                ? "bg-[rgba(198,156,109,0.25)]"
                : "hover:bg-[rgba(198,156,109,0.25)]"
            } hover:translate-x-1`}
            style={{
              color:
                activeSection === link.href
                  ? "var(--color-primary)"
                  : "var(--color-text)",
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
