import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type RefObject,
} from "react";
import { useNavigate } from "react-router-dom";

interface UseKeyDragDropOptions {
  onUnlockStart?: () => void;
  navigateTo?: string;
  navigateDelay?: number;
}

interface UseKeyDragDropReturn {
  isDragging: boolean;
  dragPosition: { x: number; y: number };
  isOverKeyhole: boolean;
  isUnlocking: boolean;
  keyIconRef: RefObject<HTMLDivElement | null>;
  keyholeRef: RefObject<HTMLDivElement | null>;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
}

export function useKeyDragDrop(
  options: UseKeyDragDropOptions = {},
): UseKeyDragDropReturn {
  const { onUnlockStart, navigateTo = "/cafe", navigateDelay = 2000 } = options;
  const navigate = useNavigate();

  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isOverKeyhole, setIsOverKeyhole] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const keyIconRef = useRef<HTMLDivElement>(null);
  const keyholeRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  // 鍵穴との重なりをチェック
  const checkKeyholeOverlap = useCallback((x: number, y: number) => {
    if (!keyholeRef.current) return false;
    const keyholeRect = keyholeRef.current.getBoundingClientRect();
    const keyholeCenterX = keyholeRect.left + keyholeRect.width / 2;
    const keyholeCenterY = keyholeRect.top + keyholeRect.height / 2;
    const distance = Math.sqrt(
      Math.pow(x - keyholeCenterX, 2) + Math.pow(y - keyholeCenterY, 2),
    );
    return distance < 50;
  }, []);

  // ドラッグ開始（マウス）
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!keyIconRef.current) return;
    const rect = keyIconRef.current.getBoundingClientRect();
    dragOffsetRef.current = {
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    };
    setDragPosition({
      x: e.clientX - dragOffsetRef.current.x,
      y: e.clientY - dragOffsetRef.current.y,
    });
    setIsDragging(true);
    e.preventDefault();
  }, []);

  // ドラッグ開始（タッチ）
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!keyIconRef.current) return;
    const touch = e.touches[0];
    const rect = keyIconRef.current.getBoundingClientRect();
    dragOffsetRef.current = {
      x: touch.clientX - rect.left - rect.width / 2,
      y: touch.clientY - rect.top - rect.height / 2,
    };
    setDragPosition({
      x: touch.clientX - dragOffsetRef.current.x,
      y: touch.clientY - dragOffsetRef.current.y,
    });
    setIsDragging(true);
    e.preventDefault();
  }, []);

  // ドラッグ中の処理
  useEffect(() => {
    if (!isDragging) return;

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const x = touch.clientX - dragOffsetRef.current.x;
      const y = touch.clientY - dragOffsetRef.current.y;
      setDragPosition({ x, y });
      setIsOverKeyhole(checkKeyholeOverlap(touch.clientX, touch.clientY));
      e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - dragOffsetRef.current.x;
      const y = e.clientY - dragOffsetRef.current.y;
      setDragPosition({ x, y });
      setIsOverKeyhole(checkKeyholeOverlap(e.clientX, e.clientY));
    };

    const handleDragEnd = (clientX: number, clientY: number) => {
      if (checkKeyholeOverlap(clientX, clientY)) {
        onUnlockStart?.();
        setIsUnlocking(true);
      }
      setIsDragging(false);
      setIsOverKeyhole(false);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      handleDragEnd(touch.clientX, touch.clientY);
    };

    const handleMouseUp = (e: MouseEvent) => {
      handleDragEnd(e.clientX, e.clientY);
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, checkKeyholeOverlap, onUnlockStart]);

  // ローディングアニメーション完了後にナビゲート
  useEffect(() => {
    if (isUnlocking) {
      const timer = setTimeout(() => {
        void navigate(navigateTo);
      }, navigateDelay);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isUnlocking, navigate, navigateTo, navigateDelay]);

  return {
    isDragging,
    dragPosition,
    isOverKeyhole,
    isUnlocking,
    keyIconRef,
    keyholeRef,
    handleMouseDown,
    handleTouchStart,
  };
}
