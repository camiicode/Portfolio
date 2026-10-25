import { useEffect, useMemo } from 'react';
import { Vector3 } from 'three';

/** [strafe, forward] for every key that moves the character. */
const KEY_BINDINGS: Record<string, [number, number]> = {
  KeyW: [0, 1],
  ArrowUp: [0, 1],
  KeyS: [0, -1],
  ArrowDown: [0, -1],
  KeyD: [1, 0],
  ArrowRight: [1, 0],
  KeyA: [-1, 0],
  ArrowLeft: [-1, 0],
};

const isBound = (code: string): boolean => Object.prototype.hasOwnProperty.call(KEY_BINDINGS, code);

/** Typing in a form field must never be swallowed as movement. */
export const isTextEntry = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT');

/**
 * Returns a stable, normalized camera-space direction (x = strafe right,
 * z = forward is negative) that is mutated in place by key events.
 */
export function useKeyboard(): Vector3 {
  const direction = useMemo(() => new Vector3(), []);
  const pressed = useMemo(() => new Set<string>(), []);

  useEffect(() => {
    const update = () => {
      let strafe = 0;
      let forward = 0;
      pressed.forEach((code) => {
        const binding = KEY_BINDINGS[code];
        if (!binding) return;
        strafe += binding[0];
        forward += binding[1];
      });
      direction.set(strafe, 0, -forward);
      if (direction.lengthSq() > 1) direction.normalize();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!isBound(event.code) || event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTextEntry(event.target)) return;
      event.preventDefault();
      pressed.add(event.code);
      update();
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (!isBound(event.code)) return;
      pressed.delete(event.code);
      update();
    };

    const onBlur = () => {
      pressed.clear();
      update();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [direction, pressed]);

  return direction;
}
