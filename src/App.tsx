import { useEffect } from 'react';
import { Scene } from './scene/Scene';
import { InteractButton } from './ui/InteractButton';
import { Joystick } from './ui/Joystick';
import { PanelManager } from './ui/PanelManager';
import { COARSE_POINTER_QUERY, useGameStore } from './store/useGameStore';

export default function App() {
  const isMobile = useGameStore((state) => state.isMobile);

  useEffect(() => {
    // Coarse-pointer devices (phones, tablets) get the on-screen joystick.
    const query = window.matchMedia(COARSE_POINTER_QUERY);
    const sync = () => useGameStore.getState().setIsMobile(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return (
    <main className="relative h-full w-full overflow-hidden bg-sky-300">
      <h1 className="sr-only">Microcosm — interactive 3D portfolio</h1>
      <Scene />
      {isMobile ? <Joystick /> : null}
      <InteractButton />
      <PanelManager />
    </main>
  );
}
