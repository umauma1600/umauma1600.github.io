import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import PuzzleListPage from "./pages/PuzzleListPage";
import ContactPage from "./pages/ContactPage";
import TreasureBoxPage from "./pages/TreasureBoxPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="contents/nazo" element={<PuzzleListPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
        {/* 謎解きコンテンツ（専用レイアウト） */}
        <Route path="contents/treasure-box" element={<TreasureBoxPage />} />
      </Routes>
    </Router>
  );
}

export default App;
