import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import PuzzleListPage from "./pages/PuzzleListPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="contents/nazo" element={<PuzzleListPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
