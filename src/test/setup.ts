import "@testing-library/jest-dom";

// jsdomで未実装のwindowメソッドをモック
Object.defineProperty(window, "scrollTo", {
  value: function scrollTo() {
    // intentionally empty for test mock
  },
  writable: true,
});

// matchMediaのモック（レスポンシブテスト用）
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: function addListener() {
      // intentionally empty for test mock
    },
    removeListener: function removeListener() {
      // intentionally empty for test mock
    },
    addEventListener: function addEventListener() {
      // intentionally empty for test mock
    },
    removeEventListener: function removeEventListener() {
      // intentionally empty for test mock
    },
    dispatchEvent: () => false,
  }),
});
