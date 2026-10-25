import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { useGameStore } from '../store/useGameStore';

interface KnobOffset {
  x: number;
  y: number;
}

const KNOB_IDLE: KnobOffset = { x: 0, y: 0 };

/** Virtual joystick for coarse-pointer devices. Writes [x, y] into the store. */
export function Joystick() {
  const setMoveInput = useGameStore((state) => state.setMoveInput);
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const pointerIdRef = useRef<number | null>(null);
  const centerRef = useRef<KnobOffset>({ x: 0, y: 0 });
  const maxOffsetRef = useRef(1);
  const [knob, setKnob] = useState<KnobOffset>(KNOB_IDLE);

  const measure = (): boolean => {
    const base = baseRef.current;
    const knobElement = knobRef.current;
    if (!base || !knobElement) return false;

    const baseRect = base.getBoundingClientRect();
    const knobRect = knobElement.getBoundingClientRect();
    centerRef.current = {
      x: baseRect.left + baseRect.width / 2,
      y: baseRect.top + baseRect.height / 2,
    };
    maxOffsetRef.current = Math.max(baseRect.width / 2 - knobRect.width / 2, 1);
    return true;
  };

  const track = (event: ReactPointerEvent<HTMLDivElement>) => {
    const dx = event.clientX - centerRef.current.x;
    const dy = event.clientY - centerRef.current.y;
    const distance = Math.hypot(dx, dy);
    const maxOffset = maxOffsetRef.current;
    const scale = distance > maxOffset ? maxOffset / distance : 1;
    const x = dx * scale;
    const y = dy * scale;

    setKnob({ x, y });
    setMoveInput([x / maxOffset, -y / maxOffset]);
  };

  const release = (pointerId: number) => {
    if (pointerIdRef.current !== pointerId) return;
    pointerIdRef.current = null;
    setKnob(KNOB_IDLE);
    setMoveInput([0, 0]);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!measure()) return;
    pointerIdRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    track(event);
  };

  return (
    <div
      ref={baseRef}
      role="application"
      aria-label="Movement joystick"
      onPointerDown={handlePointerDown}
      onPointerMove={(event) => {
        if (pointerIdRef.current === event.pointerId) track(event);
      }}
      onPointerUp={(event) => release(event.pointerId)}
      onPointerCancel={(event) => release(event.pointerId)}
      onLostPointerCapture={(event) => release(event.pointerId)}
      className="fixed bottom-8 left-8 h-36 w-36 touch-none rounded-full border border-white/40 bg-white/20 select-none"
    >
      <div
        ref={knobRef}
        aria-hidden="true"
        style={{ transform: `translate(-50%, -50%) translate(${knob.x}px, ${knob.y}px)` }}
        className="absolute left-1/2 top-1/2 h-16 w-16 rounded-full border border-white/60 bg-white/70 shadow-md"
      />
    </div>
  );
}
