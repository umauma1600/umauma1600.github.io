import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import PuzzleListPage from "./pages/PuzzleListPage";
import MadamisListPage from "./pages/MadamisListPage";
import ContactPage from "./pages/ContactPage";
import TreasureBoxPage from "./pages/TreasureBoxPage";
import CafeInterior from "./pages/cafe/CafeInterior";
import CafeMenu from "./pages/cafe/CafeMenu";

function App() {
  return (
    <Router>
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
      </Routes>
    </Router>
  );
}

export default App;
