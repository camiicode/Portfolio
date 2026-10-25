import { useGameStore } from '../store/useGameStore';

/**
 * On-screen stand-in for the E key. Only rendered on coarse-pointer devices and
 * only while a target is in range; sits just above the joystick.
 */
export function InteractButton() {
  const isMobile = useGameStore((state) => state.isMobile);
  const nearbyTargetId = useGameStore((state) => state.nearbyTargetId);
  const setActiveTargetId = useGameStore((state) => state.setActiveTargetId);

  if (!isMobile || !nearbyTargetId) return null;

  return (
    <button
      type="button"
      aria-label="Interact"
      onClick={() => setActiveTargetId(nearbyTargetId)}
      className="fixed bottom-48 left-8 h-16 w-16 touch-none select-none rounded-full border-2 border-white/70 bg-white/85 text-2xl font-bold text-slate-900 shadow-lg backdrop-blur-sm transition-transform active:scale-90"
    >
      E
    </button>
  );
}
