import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh, MeshBasicMaterial, PointLight } from 'three';
import {
  CAMPFIRE_FLICKER_DEPTH,
  CAMPFIRE_FLICKER_SPEED,
  CAMPFIRE_GLOW_COLOR,
  CAMPFIRE_LIGHT_DISTANCE,
  CAMPFIRE_LIGHT_INTENSITY,
  CAMPFIRE_LIGHT_Y,
  CAMPFIRE_SMOKE_COUNT,
  CAMPFIRE_SMOKE_DRIFT,
  CAMPFIRE_SMOKE_GROWTH,
  CAMPFIRE_SMOKE_OPACITY,
  CAMPFIRE_SMOKE_RISE,
  CAMPFIRE_SMOKE_SIZE,
  CAMPFIRE_SMOKE_SPEED,
  CAMPFIRE_SMOKE_START_Y,
  SMOKE_COLOR,
  TARGET_CAMPFIRE_POSITION,
} from '../constants';

/**
 * The campfire is a static model now, so the life has to come from the scene:
 * a warm, flickering point light in the pit and a column of translucent smoke
 * blocks that rise, drift and fade, then loop.
 */
export function CampfireEffects() {
  const [x, y, z] = TARGET_CAMPFIRE_POSITION;
  const lightRef = useRef<PointLight>(null);
  const smokeRefs = useRef<(Mesh | null)[]>([]);
  const offsets = useMemo(
    () => Array.from({ length: CAMPFIRE_SMOKE_COUNT }, (_, index) => index / CAMPFIRE_SMOKE_COUNT),
    []
  );

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;

    const light = lightRef.current;
    if (light) {
      const flicker = 1 + Math.sin(time * CAMPFIRE_FLICKER_SPEED) * CAMPFIRE_FLICKER_DEPTH;
      light.intensity = CAMPFIRE_LIGHT_INTENSITY * flicker;
    }

    smokeRefs.current.forEach((mesh, index) => {
      if (!mesh) return;
      const rise = (time * CAMPFIRE_SMOKE_SPEED + offsets[index]) % 1;
      mesh.position.set(
        Math.sin(time * 0.9 + index * 1.7) * CAMPFIRE_SMOKE_DRIFT,
        CAMPFIRE_SMOKE_START_Y + rise * CAMPFIRE_SMOKE_RISE,
        Math.cos(time * 0.7 + index * 2.1) * CAMPFIRE_SMOKE_DRIFT
      );
      mesh.scale.setScalar(1 + rise * CAMPFIRE_SMOKE_GROWTH);
      (mesh.material as MeshBasicMaterial).opacity = CAMPFIRE_SMOKE_OPACITY * (1 - rise);
    });
  });

  return (
    <group position={[x, y, z]}>
      <pointLight
        ref={lightRef}
        position={[0, CAMPFIRE_LIGHT_Y, 0]}
        color={CAMPFIRE_GLOW_COLOR}
        intensity={CAMPFIRE_LIGHT_INTENSITY}
        distance={CAMPFIRE_LIGHT_DISTANCE}
        decay={2}
      />
      {Array.from({ length: CAMPFIRE_SMOKE_COUNT }, (_, index) => (
        <mesh
          key={index}
          position={[0, CAMPFIRE_SMOKE_START_Y, 0]}
          ref={(mesh) => {
            smokeRefs.current[index] = mesh;
          }}
        >
          <boxGeometry args={CAMPFIRE_SMOKE_SIZE} />
          <meshBasicMaterial
            color={SMOKE_COLOR}
            transparent
            opacity={CAMPFIRE_SMOKE_OPACITY}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
