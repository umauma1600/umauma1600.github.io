import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { copyFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

// ビルド後に各ルートにindex.htmlをコピーするプラグイン
function copyIndexToRoutes(): Plugin {
  // SPAのルート一覧（App.tsxのルートと一致させる）
  const routes = ["nazo", "nazo/treasure-box", "contact"];

  return {
    name: "copy-index-to-routes",
    closeBundle() {
      const distDir = "dist";
      const indexPath = join(distDir, "index.html");

      if (!existsSync(indexPath)) {
        console.warn("index.html not found in dist/");
        return;
      }

      for (const route of routes) {
        const routeDir = join(distDir, route);
        const routeIndex = join(routeDir, "index.html");

        // ディレクトリを再帰的に作成
        mkdirSync(routeDir, { recursive: true });

        // index.htmlをコピー
        copyFileSync(indexPath, routeIndex);
        console.log(`Copied index.html to ${routeIndex}`);
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), copyIndexToRoutes()],
  build: {
    target: "esnext",
  },
});
