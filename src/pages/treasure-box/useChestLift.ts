import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, PointerEvent, RefObject } from "react";

/** これ以上動かしたらタップではなくドラッグとみなす */
const DRAG_START_PX = 6;
/** 手を離してから机に落ちるまでの時間（CSS の transition と揃える） */
const FALL_MS = 260;
/** キーボード操作で持ち上げたときの高さと、持ち上げている時間 */
const KEY_LIFT_PX = 90;
const KEY_HOLD_MS = 700;
const EDGE_MARGIN = 4;

/** rest: 机の上 / drag: つかんでいる / auto: キー操作で持ち上げ中 / fall: 落下中 */
type Mode = "rest" | "drag" | "auto" | "fall";

interface Position {
  /** 机の上での左右のずれ(px) */
  x: number;
  /** 机から持ち上げている高さ(px) */
  lift: number;
}

interface Bounds {
  minX: number;
  maxX: number;
  maxLift: number;
}

interface Gesture extends Bounds {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  dragging: boolean;
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

/**
 * 宝箱をつかんで持ち上げる操作。
 * マウス・タッチ・ペンを Pointer Events でまとめて扱い、上矢印キーでも持ち上げられる。
 */
export function useChestLift(
  sceneRef: RefObject<HTMLElement | null>,
  onMove: (position: Position) => void,
) {
  const [position, setPosition] = useState<Position>({ x: 0, lift: 0 });
  const [mode, setMode] = useState<Mode>("rest");
  const chestRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(position);
  const gestureRef = useRef<Gesture | null>(null);
  const suppressClickRef = useRef(false);

  const moveTo = useCallback(
    (next: Position) => {
      positionRef.current = next;
      setPosition(next);
      onMove(next);
    },
    [onMove],
  );

  /** 場面からはみ出さない範囲を、いまの画面サイズから求める */
  const measureBounds = useCallback((): Bounds => {
    const scene = sceneRef.current?.getBoundingClientRect();
    const chest = chestRef.current?.getBoundingClientRect();
    if (!scene || !chest) return { minX: 0, maxX: 0, maxLift: 0 };
    const { x, lift } = positionRef.current;
    const restLeft = chest.left - x;
    const restTop = chest.top + lift;
    return {
      minX: Math.min(0, scene.left + EDGE_MARGIN - restLeft),
      maxX: Math.max(0, scene.right - EDGE_MARGIN - (restLeft + chest.width)),
      maxLift: Math.max(0, restTop - scene.top - EDGE_MARGIN),
    };
  }, [sceneRef]);

  const animateInner = useCallback(
    (keyframes: Keyframe[], duration: number) => {
      innerRef.current?.animate(keyframes, { duration, easing: "ease-out" });
    },
    [],
  );

  /** 開かない蓋をガタガタ揺らす */
  const rattle = useCallback(() => {
    animateInner(
      [
        { transform: "rotate(0deg)" },
        { transform: "rotate(-1.6deg)" },
        { transform: "rotate(1.4deg)" },
        { transform: "rotate(-0.8deg)" },
        { transform: "rotate(0deg)" },
      ],
      320,
    );
  }, [animateInner]);

  const drop = useCallback(() => {
    const { x, lift } = positionRef.current;
    if (lift < 1) {
      moveTo({ x, lift: 0 });
      setMode("rest");
      return;
    }
    moveTo({ x, lift: 0 });
    setMode("fall");
  }, [moveTo]);

  // 落下が終わったら着地（ドスンと少しつぶれる）
  useEffect(() => {
    if (mode !== "fall") return;
    const timer = window.setTimeout(() => {
      setMode("rest");
      animateInner(
        [
          { transform: "scale(1.05, 0.93)" },
          { transform: "scale(0.985, 1.02)" },
          { transform: "scale(1, 1)" },
        ],
        240,
      );
    }, FALL_MS);
    return () => {
      window.clearTimeout(timer);
    };
  }, [mode, animateInner]);

  // キー操作で持ち上げたあとは、少し待ってから落とす
  useEffect(() => {
    if (mode !== "auto") return;
    const timer = window.setTimeout(drop, KEY_HOLD_MS);
    return () => {
      window.clearTimeout(timer);
    };
  }, [mode, drop]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (mode !== "rest") return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    suppressClickRef.current = false;
    gestureRef.current = {
      ...measureBounds(),
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: positionRef.current.x,
      dragging: false,
    };
  };

  // 素早く動かすとポインタが宝箱の外に出るので、移動と終了は window で受け取る
  useEffect(() => {
    const handleMove = (e: globalThis.PointerEvent) => {
      const gesture = gestureRef.current;
      if (gesture?.pointerId !== e.pointerId) return;
      const dx = e.clientX - gesture.startX;
      const dy = e.clientY - gesture.startY;
      if (!gesture.dragging) {
        if (Math.hypot(dx, dy) < DRAG_START_PX) return;
        gesture.dragging = true;
        // ドラッグ後に発生する click（錠や宝箱のタップ扱い）は無視する
        suppressClickRef.current = true;
        setMode("drag");
      }
      moveTo({
        x: clamp(gesture.originX + dx, gesture.minX, gesture.maxX),
        lift: clamp(-dy, 0, gesture.maxLift),
      });
    };

    const handleEnd = (e: globalThis.PointerEvent) => {
      const gesture = gestureRef.current;
      if (gesture?.pointerId !== e.pointerId) return;
      gestureRef.current = null;
      if (gesture.dragging) drop();
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleEnd);
    window.addEventListener("pointercancel", handleEnd);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleEnd);
      window.removeEventListener("pointercancel", handleEnd);
    };
  }, [moveTo, drop]);

  const onClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;
    suppressClickRef.current = false;
    e.stopPropagation();
    e.preventDefault();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowUp" || mode !== "rest") return;
    if (e.target !== e.currentTarget) return;
    e.preventDefault();
    const { maxLift } = measureBounds();
    setMode("auto");
    moveTo({
      x: positionRef.current.x,
      lift: Math.min(KEY_LIFT_PX, maxLift),
    });
  };

  return {
    chestRef,
    innerRef,
    position,
    mode,
    rattle,
    handlers: {
      onPointerDown,
      onClickCapture,
      onKeyDown,
    },
  };
}
