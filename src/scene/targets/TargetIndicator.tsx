import { useRef } from 'react';
import { Billboard, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { useGameStore } from '../../store/useGameStore';
import {
  TARGET_INDICATOR_BOB_HEIGHT,
  TARGET_INDICATOR_BOB_SPEED,
  TARGET_INDICATOR_FONT_SIZE,
  TARGET_INDICATOR_HEIGHT,
  TARGET_INDICATOR_LABEL_SIZE,
  TARGET_INDICATOR_WIDTH,
  TARGETS,
} from '../constants';

/**
 * Floating "Press E" cue that hovers and bobs above whichever target the player
 * is close enough to use.
 */
export function TargetIndicator() {
  const nearbyTargetId = useGameStore((state) => state.nearbyTargetId);
  const isMobile = useGameStore((state) => state.isMobile);
  const groupRef = useRef<Group>(null);

  const target = TARGETS.find((entry) => entry.id === nearbyTargetId) ?? null;
  const baseY = target ? target.position[1] + target.indicatorHeight : 0;

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) return;
    group.position.y =
      baseY +
      Math.sin(clock.elapsedTime * TARGET_INDICATOR_BOB_SPEED) * TARGET_INDICATOR_BOB_HEIGHT;
  });

  if (!target) return null;

  return (
    <group ref={groupRef} position={[target.position[0], baseY, target.position[2]]}>
      <Billboard>
        <mesh position={[0, -0.02, -0.01]}>
          <planeGeometry args={[TARGET_INDICATOR_WIDTH, TARGET_INDICATOR_HEIGHT]} />
          <meshBasicMaterial color="#0b1220" transparent opacity={0.55} depthWrite={false} />
        </mesh>
        <Text
          position={[0, 0.08, 0]}
          fontSize={TARGET_INDICATOR_FONT_SIZE}
          color="#f8fafc"
          anchorX="center"
          anchorY="middle"
        >
          {isMobile ? 'Tap E' : 'Press E'}
        </Text>
        <Text
          position={[0, -0.1, 0]}
          fontSize={TARGET_INDICATOR_LABEL_SIZE}
          color="#9fe6c8"
          anchorX="center"
          anchorY="middle"
        >
          {target.label}
        </Text>
      </Billboard>
    </group>
  );
}
