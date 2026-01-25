import { describe, it, expect } from "vitest";
import { gameReducer } from "./GameContext";
import { initialGameState, initialItems, initialFlags } from "./types";
import type { GameState } from "./types";

// テスト用の初期状態を作成するヘルパー
const createInitialState = (): GameState => ({
  ...initialGameState,
  items: { ...initialItems },
  flags: { ...initialFlags },
});

describe("gameReducer", () => {
  describe("基本的なアクション", () => {
    it("START_GAME: ステータスがopeningに変わる", () => {
      const state = createInitialState();
      const newState = gameReducer(state, { type: "START_GAME" });
      expect(newState.status).toBe("opening");
    });

    it("CHANGE_AREA: エリアが変更される", () => {
      const state = createInitialState();
      const newState = gameReducer(state, {
        type: "CHANGE_AREA",
        area: "kitchen",
      });
      expect(newState.currentArea).toBe("kitchen");
    });

    it("OBTAIN_ITEM: アイテムを入手できる", () => {
      const state = createInitialState();
      expect(state.items.pill_red.obtained).toBe(false);

      const newState = gameReducer(state, {
        type: "OBTAIN_ITEM",
        item: "pill_red",
      });
      expect(newState.items.pill_red.obtained).toBe(true);
    });
  });

  describe("ボックスの解錠", () => {
    it("OPEN_BOX: 正しいコード(246)で箱が開く", () => {
      const state = createInitialState();
      const newState = gameReducer(state, { type: "OPEN_BOX", code: "246" });
      expect(newState.flags.boxOpened).toBe(true);
    });

    it("OPEN_BOX: 間違ったコードでは箱が開かない", () => {
      const state = createInitialState();
      const newState = gameReducer(state, { type: "OPEN_BOX", code: "123" });
      expect(newState.flags.boxOpened).toBe(false);
    });
  });

  describe("3つのボタン", () => {
    it("3つのボタン全て押すと地下への扉が開く", () => {
      let state = createInitialState();

      state = gameReducer(state, { type: "PRESS_BUTTON", button: 1 });
      expect(state.flags.trapdoorUnlocked).toBe(false);

      state = gameReducer(state, { type: "PRESS_BUTTON", button: 2 });
      expect(state.flags.trapdoorUnlocked).toBe(false);

      state = gameReducer(state, { type: "PRESS_BUTTON", button: 3 });
      expect(state.flags.trapdoorUnlocked).toBe(true);
      expect(state.flags.lowerFloorAccessible).toBe(true);
    });
  });

  describe("エンディング分岐", () => {
    it("USE_KEY: 爆弾未解除でノーマルエンド", () => {
      const state = createInitialState();
      state.flags.bombDisarmed = false;

      const newState = gameReducer(state, { type: "USE_KEY" });
      expect(newState.status).toBe("normal_end");
    });

    it("USE_KEY: 爆弾解除済みでトゥルーエンド", () => {
      const state = createInitialState();
      state.flags.bombDisarmed = true;

      const newState = gameReducer(state, { type: "USE_KEY" });
      expect(newState.status).toBe("true_end");
    });
  });

  describe("RESET_GAME", () => {
    it("ゲームが初期状態にリセットされる", () => {
      let state = createInitialState();
      state = gameReducer(state, { type: "START_GAME" });
      state = gameReducer(state, { type: "OBTAIN_ITEM", item: "pill_red" });
      state.flags.boxOpened = true;

      const newState = gameReducer(state, { type: "RESET_GAME" });
      expect(newState.status).toBe("title");
      expect(newState.items.pill_red.obtained).toBe(false);
      expect(newState.flags.boxOpened).toBe(false);
    });
  });
});
