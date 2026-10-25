import { create } from 'zustand';

/** Media query that reports a touch-first (coarse pointer) device. */
export const COARSE_POINTER_QUERY = '(pointer: coarse)';

export interface GameState {
  /** Screen-space movement input: [x right, y forward], each clamped to -1..1. */
  moveInput: [number, number];
  isMobile: boolean;
  nearbyTargetId: string | null;
  activeTargetId: string | null;
  setMoveInput: (input: [number, number]) => void;
  setIsMobile: (isMobile: boolean) => void;
  setNearbyTargetId: (targetId: string | null) => void;
  setActiveTargetId: (targetId: string | null) => void;
}

const detectCoarsePointer = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia(COARSE_POINTER_QUERY).matches;

export const useGameStore = create<GameState>((set) => ({
  moveInput: [0, 0],
  isMobile: detectCoarsePointer(),
  nearbyTargetId: null,
  activeTargetId: null,
  setMoveInput: (input) => set({ moveInput: input }),
  setIsMobile: (isMobile) => set({ isMobile }),
  setNearbyTargetId: (nearbyTargetId) => set({ nearbyTargetId }),
  setActiveTargetId: (activeTargetId) => set({ activeTargetId }),
}));