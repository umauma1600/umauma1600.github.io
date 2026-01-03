import { Link } from "react-router-dom";

export default function ContentsSection() {
  return (
    <section id="contents" className="px-6 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: "var(--color-primary)" }}
          >
            コンテンツ
          </h2>
          <p className="text-lg text-gray-600">
            現在準備中のコンテンツです。順次公開していきます。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* 謎解きカード */}
          <div
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            style={{
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div className="mb-4">
              <span className="inline-block py-2 px-4 bg-yellow-100 text-yellow-900 rounded-full text-sm font-semibold">
                準備中
              </span>
            </div>
            <h3
              className="text-2xl font-bold mb-3"
              style={{ color: "var(--color-primary)" }}
            >
              謎解き
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              ブラウザ上でインタラクティブに楽しめる謎解きコンテンツ。
              <br />
              スマホ・タブレット・PCすべてに対応。
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                インタラクティブ
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                モバイル対応
              </span>
            </div>
            <Link
              to="/nazo"
              className="inline-block text-center py-4 px-8 rounded-lg font-semibold transition-all duration-300 shadow hover:shadow-lg hover:-translate-y-0.5"
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
              謎解き一覧へ
            </Link>
          </div>

          {/* マダミスカード */}
          <div
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            style={{
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div className="mb-4">
              <span className="inline-block py-2 px-4 bg-yellow-100 text-yellow-900 rounded-full text-sm font-semibold">
                Coming Soon
              </span>
            </div>
            <h3
              className="text-2xl font-bold mb-3"
              style={{ color: "var(--color-primary)" }}
            >
              マーダーミステリー
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              ダウンロードして遊べるマダミスシナリオ。
              <br />
              PDF形式で提供予定。
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm font-medium">
                PDF配布
              </span>
              <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded text-sm font-medium">
                オフライン可
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
