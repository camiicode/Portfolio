import { useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import type { RapierRigidBody } from '@react-three/rapier';
import { useGameStore } from '../store/useGameStore';
import { INTERACTION_DISTANCE, TARGETS, type TargetId } from './constants';
import { TargetIndicator } from './targets/TargetIndicator';
import { useInteractionKey } from './useInteractionKey';

export interface TargetManagerProps {
  playerRef: RefObject<RapierRigidBody>;
}

/**
 * Watches the player's position each frame and publishes the nearest target
 * within INTERACTION_DISTANCE. Distance is measured on the ground plane so the
 * plateau's height does not push a target out of reach.
 */
export function TargetManager({ playerRef }: TargetManagerProps) {
  const setNearbyTargetId = useGameStore((state) => state.setNearbyTargetId);
  const nearbyRef = useRef<TargetId | null>(null);

  useInteractionKey();

  useFrame(() => {
    const body = playerRef.current;
    if (!body) return;
    const { x, z } = body.translation();

    let nearest: TargetId | null = null;
    let nearestDistance = INTERACTION_DISTANCE;
    for (const target of TARGETS) {
      const distance = Math.hypot(target.position[0] - x, target.position[2] - z);
      if (distance <= nearestDistance) {
        nearestDistance = distance;
        nearest = target.id;
      }
    }

    if (nearest === nearbyRef.current) return;
    nearbyRef.current = nearest;
    setNearbyTargetId(nearest);
  });

  return <TargetIndicator />;
}
