import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter, Routes, Route, Outlet } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Sidebar from "./components/Sidebar";

// Appコンポーネントは BrowserRouter を含んでいるため、
// 各ルートを MemoryRouter でラップしてテストする

// テスト用のシンプルなレイアウト
function TestLayout() {
  return (
    <div>
      <Sidebar activeSection="/" />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

describe("App ルーティング", () => {
  it("ホームページがレンダリングされる", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<TestLayout />}>
            <Route index element={<HomePage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    // サイトタイトルが少なくとも1つ存在することを確認
    const titles = screen.getAllByText(/やまーたの謎解きアトリエ/i);
    expect(titles.length).toBeGreaterThan(0);
  });

  it("ナビゲーションリンクが表示される", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<TestLayout />}>
            <Route index element={<HomePage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    // ナビゲーションリンクの存在を確認（サイドバー内のリンク）
    const homeLinks = screen.getAllByRole("link", { name: /ホーム/i });
    expect(homeLinks.length).toBeGreaterThan(0);

    const puzzleLinks = screen.getAllByRole("link", { name: /謎解き/i });
    expect(puzzleLinks.length).toBeGreaterThan(0);

    const madamisLinks = screen.getAllByRole("link", { name: /マダミス/i });
    expect(madamisLinks.length).toBeGreaterThan(0);

    const contactLinks = screen.getAllByRole("link", { name: /お問い合わせ/i });
    expect(contactLinks.length).toBeGreaterThan(0);
  });
});

describe("HomePage", () => {
  it("HomePageがレンダリングされる", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    // アトリエの作品セクションが表示されることを確認
    expect(screen.getByText("アトリエの作品")).toBeInTheDocument();
  });

  it("謎解きコンテンツへのリンクが存在する", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    // 逆転の宝箱へのリンクが存在することを確認
    expect(screen.getByText("逆転の宝箱")).toBeInTheDocument();
  });
});
