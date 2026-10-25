import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import type { Group } from 'three';
import {
  CAMPFIRE_COLLIDER_CENTER_Y,
  CAMPFIRE_COLLIDER_HALF,
  CAMPFIRE_FLAME_SIZE,
  CAMPFIRE_FLAME_Y,
  CAMPFIRE_LIGHT_DISTANCE,
  CAMPFIRE_LIGHT_INTENSITY,
  CAMPFIRE_LIGHT_Y,
  CAMPFIRE_LOG_COUNT,
  CAMPFIRE_LOG_LENGTH,
  CAMPFIRE_LOG_RADIUS,
  CAMPFIRE_LOG_RING_RADIUS,
  CAMPFIRE_LOG_Y,
  CAMPFIRE_SMOKE_COUNT,
  CAMPFIRE_SMOKE_OPACITY,
  CAMPFIRE_SMOKE_RADIUS,
  CAMPFIRE_SMOKE_RISE,
  CAMPFIRE_SMOKE_SPEED,
  CAMPFIRE_SMOKE_START_Y,
  EMBER_COLOR,
  FLAME_COLOR,
  SMOKE_COLOR,
  TARGET_CAMPFIRE_POSITION,
  WOOD_COLOR,
} from '../../constants';

const LOG_ANGLES = Array.from({ length: CAMPFIRE_LOG_COUNT }, (_, index) =>
  (index / CAMPFIRE_LOG_COUNT) * Math.PI * 2
);

/** Ring of logs, a glowing ember box and a few translucent smoke puffs. */
export function CampfireTarget() {
  const smokeRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const smoke = smokeRef.current;
    if (!smoke) return;
    const drift = clock.elapsedTime * CAMPFIRE_SMOKE_SPEED;
    smoke.children.forEach((puff, index) => {
      const t = (drift + index / CAMPFIRE_SMOKE_COUNT) % 1;
      puff.position.y = CAMPFIRE_SMOKE_START_Y + t * CAMPFIRE_SMOKE_RISE;
      puff.scale.setScalar(0.7 + t * 1.1);
      puff.position.x = Math.sin((t + index) * Math.PI * 2) * 0.12;
    });
  });

  return (
    <RigidBody type="fixed" colliders={false} position={TARGET_CAMPFIRE_POSITION}>
      <CuboidCollider args={CAMPFIRE_COLLIDER_HALF} position={[0, CAMPFIRE_COLLIDER_CENTER_Y, 0]} />

      {LOG_ANGLES.map((angle) => (
        <group key={angle} rotation={[0, angle, 0]}>
          <mesh castShadow position={[CAMPFIRE_LOG_RING_RADIUS, CAMPFIRE_LOG_Y, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry
              args={[CAMPFIRE_LOG_RADIUS, CAMPFIRE_LOG_RADIUS, CAMPFIRE_LOG_LENGTH, 6]}
            />
            <meshStandardMaterial color={WOOD_COLOR} />
          </mesh>
        </group>
      ))}

      <mesh castShadow position={[0, CAMPFIRE_FLAME_Y, 0]}>
        <boxGeometry args={CAMPFIRE_FLAME_SIZE} />
        <meshStandardMaterial
          color={FLAME_COLOR}
          emissive={EMBER_COLOR}
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>

      <pointLight
        color={FLAME_COLOR}
        intensity={CAMPFIRE_LIGHT_INTENSITY}
        distance={CAMPFIRE_LIGHT_DISTANCE}
        position={[0, CAMPFIRE_LIGHT_Y, 0]}
      />

      <group ref={smokeRef}>
        {Array.from({ length: CAMPFIRE_SMOKE_COUNT }, (_, index) => (
          <mesh key={index}>
            <sphereGeometry args={[CAMPFIRE_SMOKE_RADIUS, 8, 8]} />
            <meshStandardMaterial
              color={SMOKE_COLOR}
              transparent
              opacity={CAMPFIRE_SMOKE_OPACITY}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </RigidBody>
  );
}
