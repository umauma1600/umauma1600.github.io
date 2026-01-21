import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useCafeProgress } from "./useCafeProgress";

const STORAGE_KEY = "cafe-himitsunokagi-progress";

describe("useCafeProgress", () => {
  beforeEach(() => {
    // LocalStorageをクリア
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("初期状態では空のクリア済み配列を返す", () => {
    const { result } = renderHook(() => useCafeProgress());

    expect(result.current.clearedPuzzles).toEqual([]);
    expect(result.current.getClearedCount()).toBe(0);
  });

  it("markAsClearedで謎をクリア済みにできる", () => {
    const { result } = renderHook(() => useCafeProgress());

    act(() => {
      result.current.markAsCleared("puzzle-1");
    });

    expect(result.current.clearedPuzzles).toContain("puzzle-1");
    expect(result.current.isCleared("puzzle-1")).toBe(true);
    expect(result.current.getClearedCount()).toBe(1);
  });

  it("同じ謎を2回クリアしても重複しない", () => {
    const { result } = renderHook(() => useCafeProgress());

    act(() => {
      result.current.markAsCleared("puzzle-1");
      result.current.markAsCleared("puzzle-1");
    });

    expect(result.current.clearedPuzzles).toEqual(["puzzle-1"]);
    expect(result.current.getClearedCount()).toBe(1);
  });

  it("複数の謎をクリアできる", () => {
    const { result } = renderHook(() => useCafeProgress());

    act(() => {
      result.current.markAsCleared("puzzle-1");
    });
    act(() => {
      result.current.markAsCleared("puzzle-2");
    });
    act(() => {
      result.current.markAsCleared("puzzle-3");
    });

    expect(result.current.getClearedCount()).toBe(3);
    expect(result.current.isCleared("puzzle-1")).toBe(true);
    expect(result.current.isCleared("puzzle-2")).toBe(true);
    expect(result.current.isCleared("puzzle-3")).toBe(true);
  });

  it("resetProgressで進捗をリセットできる", () => {
    const { result } = renderHook(() => useCafeProgress());

    act(() => {
      result.current.markAsCleared("puzzle-1");
      result.current.markAsCleared("puzzle-2");
    });

    expect(result.current.getClearedCount()).toBe(2);

    act(() => {
      result.current.resetProgress();
    });

    expect(result.current.clearedPuzzles).toEqual([]);
    expect(result.current.getClearedCount()).toBe(0);
  });

  it("isClearedが未クリアの謎に対してfalseを返す", () => {
    const { result } = renderHook(() => useCafeProgress());

    expect(result.current.isCleared("puzzle-1")).toBe(false);
  });

  it("LocalStorageから進捗を復元できる", () => {
    // 事前にLocalStorageにデータをセット
    const savedProgress = {
      clearedPuzzles: ["puzzle-1", "puzzle-2"],
      lastVisited: "2024-01-01T00:00:00.000Z",
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedProgress));

    const { result } = renderHook(() => useCafeProgress());

    expect(result.current.clearedPuzzles).toEqual(["puzzle-1", "puzzle-2"]);
    expect(result.current.getClearedCount()).toBe(2);
  });

  it("進捗がLocalStorageに保存される", () => {
    const { result } = renderHook(() => useCafeProgress());

    act(() => {
      result.current.markAsCleared("puzzle-1");
    });

    const saved = localStorage.getItem(STORAGE_KEY);
    expect(saved).not.toBeNull();

    const parsed = JSON.parse(saved!) as { clearedPuzzles: string[] };
    expect(parsed.clearedPuzzles).toContain("puzzle-1");
  });
});
