import { useEffect, useRef, type ComponentType } from 'react';
import type { TargetId } from '../scene/constants';
import { useGameStore } from '../store/useGameStore';
import { CampfirePanel } from './panels/CampfirePanel';
import { ComputerPanel } from './panels/ComputerPanel';
import { ServicesPanel } from './panels/ServicesPanel';
import { TelescopePanel } from './panels/TelescopePanel';

interface PanelEntry {
  Component: ComponentType;
  /** id of the panel's own heading, used to label the dialog. */
  headingId: string;
}

const PANELS: Record<TargetId, PanelEntry> = {
  computer: { Component: ComputerPanel, headingId: 'computer-panel-title' },
  campfire: { Component: CampfirePanel, headingId: 'campfire-panel-title' },
  telescope: { Component: TelescopePanel, headingId: 'telescope-panel-title' },
  services: { Component: ServicesPanel, headingId: 'services-panel-title' },
};

const isTargetId = (value: string): value is TargetId =>
  Object.prototype.hasOwnProperty.call(PANELS, value);

/**
 * Renders the active panel in a native <dialog>. The dialog fills the viewport
 * and acts as its own backdrop: a click that lands on the padding around the
 * panel card closes it, as do Escape and the X button.
 */
export function PanelManager() {
  const activeTargetId = useGameStore((state) => state.activeTargetId);
  const setActiveTargetId = useGameStore((state) => state.setActiveTargetId);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!activeTargetId) return;

    dialogRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setActiveTargetId(null);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeTargetId, setActiveTargetId]);

  if (!activeTargetId || !isTargetId(activeTargetId)) return null;

  const { Component, headingId } = PANELS[activeTargetId];
  const close = () => setActiveTargetId(null);

  return (
    <dialog
      ref={dialogRef}
      open
      tabIndex={-1}
      aria-modal="true"
      aria-labelledby={headingId}
      className="fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none overflow-y-auto border-0 bg-black/60 p-0 backdrop-blur-sm outline-none"
    >
      <div
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="flex min-h-full items-center justify-center p-4 sm:p-6"
      >
        <div className="relative w-full max-w-2xl">
          <button
            type="button"
            aria-label="Close panel"
            onClick={close}
            className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/45 text-lg leading-none text-white transition-colors hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            <span aria-hidden="true">×</span>
          </button>
          <Component />
        </div>
      </div>
    </dialog>
  );
}
