import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";

// 遅延読み込みするページコンポーネント
const PuzzleListPage = lazy(() => import("./pages/PuzzleListPage"));
const MadamisListPage = lazy(() => import("./pages/MadamisListPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const TreasureBoxPage = lazy(() => import("./pages/TreasureBoxPage"));
const CafeInterior = lazy(() => import("./pages/cafe/CafeInterior"));
const CafeMenu = lazy(() => import("./pages/cafe/CafeMenu"));
const LattePuzzle = lazy(() => import("./pages/cafe/LattePuzzle"));

// ローディングコンポーネント
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-amber-800 text-sm">読み込み中...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="nazo" element={<PuzzleListPage />} />
            <Route path="madamis" element={<MadamisListPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>
          {/* 謎解きコンテンツ（専用レイアウト） */}
          <Route path="nazo/treasure-box" element={<TreasureBoxPage />} />
          {/* カフェ（専用レイアウト） */}
          <Route path="cafe" element={<CafeInterior />} />
          <Route path="cafe/menu" element={<CafeMenu />} />
          <Route path="cafe/menu/latte" element={<LattePuzzle />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
