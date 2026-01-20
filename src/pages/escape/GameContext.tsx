import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import {
  type GameState,
  type GameAction,
  type ItemType,
  type AreaType,
  type PillEffectType,
  initialGameState,
  initialItems,
  initialFlags,
} from "./types";

// ゲームのリデューサー
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME":
      return { ...state, status: "caution" };

    case "SHOW_CAUTION":
      return { ...state, status: "caution" };

    case "SHOW_OPENING":
      return { ...state, status: "opening" };

    case "START_TIMER":
      return {
        ...state,
        status: "playing",
        timerStartTime: Date.now(),
        flags: { ...state.flags, timerStarted: true, messageRead: true },
        items: {
          ...state.items,
          message: { ...state.items.message, obtained: true },
        },
      };

    case "TICK_TIMER": {
      if (!state.timerStartTime || state.status !== "playing") return state;

      const elapsed = Math.floor((Date.now() - state.timerStartTime) / 1000);
      const baseTime = 60 * 60; // 60分
      const bonusTime = state.flags.bombDisarmed ? 15 * 60 : 0; // 爆弾解除で追加15分
      const totalTime = baseTime + bonusTime;
      const remaining = Math.max(0, totalTime - elapsed);

      // 時間切れチェック
      if (remaining === 0) {
        if (!state.flags.bombDisarmed) {
          // 60分経過、爆弾未解除 → BAD END①
          return { ...state, remainingTime: 0, status: "bad_end_1" };
        } else {
          // 75分経過、爆弾解除済み但し脱出できず → BAD END②
          return { ...state, remainingTime: 0, status: "bad_end_2" };
        }
      }

      // 錠剤の効果期限切れチェック
      const now = Date.now();
      const activePillEffects = state.activePillEffects.filter(
        (effect) => effect.expiresAt === null || effect.expiresAt > now,
      );

      return { ...state, remainingTime: remaining, activePillEffects };
    }

    case "CHANGE_AREA":
      return { ...state, currentArea: action.area, showingBook: null };

    case "OBTAIN_ITEM":
      return {
        ...state,
        items: {
          ...state.items,
          [action.item]: { ...state.items[action.item], obtained: true },
        },
      };

    case "SELECT_ITEM":
      return { ...state, selectedItem: action.item };

    case "USE_ITEM": {
      const item = state.items[action.item];
      if (!item.obtained || item.used) return state;

      let newState = {
        ...state,
        items: {
          ...state.items,
          [action.item]: { ...item, used: true },
        },
        selectedItem: null,
      };

      // 錠剤の効果を適用
      if (action.item.startsWith("pill_")) {
        const pillType = action.item;
        const expiresAt = Date.now() + 60 * 1000; // 1分後

        newState = {
          ...newState,
          activePillEffects: [
            ...state.activePillEffects,
            { type: pillType, name: "", description: "", expiresAt },
          ],
          flags: {
            ...newState.flags,
            [`${pillType.replace("pill_", "pill")}Used`]: true,
          } as typeof newState.flags,
        };

        // 黄色い錠剤 → 上の階へ行ける
        if (pillType === "pill_yellow") {
          newState.flags = {
            ...newState.flags,
            upperFloorAccessible: true,
            pillYellowUsed: true,
          };
        }

        // 紫の錠剤 → 像を動かせる（ボタン3）
        if (pillType === "pill_purple") {
          newState.flags = { ...newState.flags, pillPurpleUsed: true };
        }

        // 赤い錠剤
        if (pillType === "pill_red") {
          newState.flags = { ...newState.flags, pillRedUsed: true };
        }

        // 青い錠剤
        if (pillType === "pill_blue") {
          newState.flags = { ...newState.flags, pillBlueUsed: true };
        }

        // 白い錠剤
        if (pillType === "pill_white") {
          newState.flags = { ...newState.flags, pillWhiteUsed: true };
        }
      }

      return newState;
    }

    case "PRESS_BUTTON": {
      const buttonKey =
        `button${action.button}Pressed` as keyof typeof state.flags;
      const newFlags = { ...state.flags, [buttonKey]: true };

      // 3つ全てのボタンが押されたか確認
      if (
        newFlags.button1Pressed &&
        newFlags.button2Pressed &&
        newFlags.button3Pressed
      ) {
        newFlags.trapdoorUnlocked = true;
        newFlags.lowerFloorAccessible = true;
      }

      return { ...state, flags: newFlags };
    }

    case "OPEN_BOX":
      if (action.code === "246") {
        return {
          ...state,
          flags: { ...state.flags, boxOpened: true },
        };
      }
      return state;

    case "REMOVE_CARPET":
      return { ...state, flags: { ...state.flags, carpetRemoved: true } };

    case "FILL_WATER":
      return { ...state, flags: { ...state.flags, waterInPot: true } };

    case "EXTINGUISH_FIRE":
      return { ...state, flags: { ...state.flags, fireExtinguished: true } };

    case "OPEN_CEILING_HOLE":
      return { ...state, flags: { ...state.flags, ceilingHoleOpened: true } };

    case "CLEAR_DICKIA_PATH":
      return { ...state, flags: { ...state.flags, dickiaPathCleared: true } };

    case "TRIGGER_BAD_END":
      if (action.payload === "poison") {
        return { ...state, status: "bad_end_1" };
      }
      return state;

    case "WITHER_DICKIA":
      return {
        ...state,
        flags: { ...state.flags, dickiaWithered: true, keyObtained: true },
        items: { ...state.items, key: { ...state.items.key, obtained: true } },
      };

    case "DISARM_BOMB":
      return {
        ...state,
        flags: { ...state.flags, bombDisarmed: true },
        items: { ...state.items, bomb: { ...state.items.bomb, used: true } },
      };

    case "USE_KEY": {
      // 鍵を使ってドアを開ける → エンディング分岐
      if (state.flags.bombDisarmed) {
        return { ...state, status: "true_end" };
      } else {
        return { ...state, status: "normal_end" };
      }
    }

    case "SHOW_BOOK":
      return { ...state, showingBook: action.book };

    case "SHOW_DIALOG":
      return { ...state, dialogMessage: action.message };

    case "GAME_OVER":
      return { ...state, status: action.ending };

    case "RESET_GAME":
      return {
        ...initialGameState,
        items: { ...initialItems },
        flags: { ...initialFlags },
      };

    default:
      return state;
  }
}

// コンテキストの型
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  // ヘルパー関数
  startGame: () => void;
  changeArea: (area: AreaType) => void;
  obtainItem: (item: ItemType) => void;
  useItem: (item: ItemType, target?: string) => void;
  selectItem: (item: ItemType | null) => void;
  pressButton: (button: 1 | 2 | 3) => void;
  openBox: (code: string) => boolean;
  showBook: (book: string | null) => void;
  showDialog: (message: string | null) => void;
  hasPillEffect: (pillType: ItemType) => boolean;
  canAccessUpperFloor: () => boolean;
  canAccessLowerFloor: () => boolean;
}

const GameContext = createContext<GameContextType | null>(null);

// プロバイダーコンポーネント
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  // 現在有効な錠剤効果を計算
  const activePillEffect = useMemo<PillEffectType>(() => {
    const now = Date.now();
    const activeEffect = state.activePillEffects.find(
      (effect) => effect.expiresAt !== null && effect.expiresAt > now,
    );
    if (!activeEffect) return null;
    // pill_purple -> purple
    return activeEffect.type.replace("pill_", "") as PillEffectType;
  }, [state.activePillEffects]);

  // 計算済みプロパティを含んだ拡張ステート
  const enhancedState = useMemo<GameState>(
    () => ({ ...state, activePillEffect }),
    [state, activePillEffect],
  );

  // タイマーの更新
  useEffect(() => {
    if (state.status !== "playing" || !state.timerStartTime) return;

    const interval = setInterval(() => {
      dispatch({ type: "TICK_TIMER" });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [state.status, state.timerStartTime]);

  // ヘルパー関数
  const startGame = useCallback(() => {
    dispatch({ type: "START_GAME" });
  }, []);

  const changeArea = useCallback((area: AreaType) => {
    dispatch({ type: "CHANGE_AREA", area });
  }, []);

  const obtainItem = useCallback((item: ItemType) => {
    dispatch({ type: "OBTAIN_ITEM", item });
  }, []);

  const useItem = useCallback((item: ItemType, target?: string) => {
    dispatch({ type: "USE_ITEM", item, target });
  }, []);

  const selectItem = useCallback((item: ItemType | null) => {
    dispatch({ type: "SELECT_ITEM", item });
  }, []);

  const pressButton = useCallback((button: 1 | 2 | 3) => {
    dispatch({ type: "PRESS_BUTTON", button });
  }, []);

  const openBox = useCallback((code: string): boolean => {
    if (code === "246") {
      dispatch({ type: "OPEN_BOX", code });
      return true;
    }
    return false;
  }, []);

  const showBook = useCallback((book: string | null) => {
    dispatch({ type: "SHOW_BOOK", book });
  }, []);

  const showDialog = useCallback((message: string | null) => {
    dispatch({ type: "SHOW_DIALOG", message });
  }, []);

  const hasPillEffect = useCallback(
    (pillType: ItemType): boolean => {
      return state.activePillEffects.some(
        (effect) =>
          effect.type === pillType &&
          (effect.expiresAt === null || effect.expiresAt > Date.now()),
      );
    },
    [state.activePillEffects],
  );

  const canAccessUpperFloor = useCallback((): boolean => {
    return state.flags.upperFloorAccessible;
  }, [state.flags.upperFloorAccessible]);

  const canAccessLowerFloor = useCallback((): boolean => {
    return state.flags.lowerFloorAccessible;
  }, [state.flags.lowerFloorAccessible]);

  const value: GameContextType = {
    state: enhancedState,
    dispatch,
    startGame,
    changeArea,
    obtainItem,
    useItem,
    selectItem,
    pressButton,
    openBox,
    showBook,
    showDialog,
    hasPillEffect,
    canAccessUpperFloor,
    canAccessLowerFloor,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// カスタムフック
export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
