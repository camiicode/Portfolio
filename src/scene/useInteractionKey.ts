import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { isTextEntry } from './useKeyboard';

const INTERACT_KEYS = new Set(['KeyE', 'Enter']);

/**
 * Opens the nearby target when E or Enter is pressed. Reads the store inside the
 * handler so the listener never has to be re-bound as the player walks around.
 * Ignored while a panel is already open and while typing in a form field.
 */
export function useInteractionKey(): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || !INTERACT_KEYS.has(event.code)) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTextEntry(event.target)) return;

      const { nearbyTargetId, activeTargetId, setActiveTargetId } = useGameStore.getState();
      if (activeTargetId) return;
      if (nearbyTargetId) setActiveTargetId(nearbyTargetId);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}
