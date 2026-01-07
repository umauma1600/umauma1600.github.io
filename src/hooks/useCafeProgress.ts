import { useState, useEffect, useCallback } from "react";

// 謎のクリア状態を管理するカスタムフック
const STORAGE_KEY = "cafe-himitsunokagi-progress";

interface CafeProgress {
  clearedPuzzles: string[]; // クリア済み謎のID配列
  lastVisited: string | null; // 最後に訪問した日時
}

const getInitialProgress = (): CafeProgress => {
  if (typeof window === "undefined") {
    return { clearedPuzzles: [], lastVisited: null };
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as CafeProgress;
      return parsed;
    }
  } catch {
    // LocalStorageが使用できない場合は初期値を返す
  }

  return { clearedPuzzles: [], lastVisited: null };
};

export function useCafeProgress() {
  const [progress, setProgress] = useState<CafeProgress>(getInitialProgress);

  // LocalStorageに保存
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // LocalStorageが使用できない場合は無視
    }
  }, [progress]);

  // 謎をクリア済みにする
  const markAsCleared = useCallback((puzzleId: string) => {
    setProgress((prev) => {
      if (prev.clearedPuzzles.includes(puzzleId)) {
        return prev;
      }
      return {
        ...prev,
        clearedPuzzles: [...prev.clearedPuzzles, puzzleId],
        lastVisited: new Date().toISOString(),
      };
    });
  }, []);

  // 謎がクリア済みかどうかを確認
  const isCleared = useCallback(
    (puzzleId: string) => {
      return progress.clearedPuzzles.includes(puzzleId);
    },
    [progress.clearedPuzzles],
  );

  // 進捗をリセット
  const resetProgress = useCallback(() => {
    setProgress({ clearedPuzzles: [], lastVisited: null });
  }, []);

  // クリア済み謎の数を取得
  const getClearedCount = useCallback(() => {
    return progress.clearedPuzzles.length;
  }, [progress.clearedPuzzles]);

  return {
    clearedPuzzles: progress.clearedPuzzles,
    markAsCleared,
    isCleared,
    resetProgress,
    getClearedCount,
  };
}
