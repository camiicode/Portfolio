import type { RefObject } from 'react';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import type { RapierCollider, RapierRigidBody } from '@react-three/rapier';
import {
  PLAYER_BODY_COLOR,
  PLAYER_BODY_HALF,
  PLAYER_BODY_SIZE,
  PLAYER_GRAVITY_SCALE,
  PLAYER_HEAD_COLOR,
  PLAYER_HEAD_SIZE,
  PLAYER_HEAD_Y,
  PLAYER_SPAWN,
} from './constants';

export interface PlayerProps {
  bodyRef: RefObject<RapierRigidBody>;
  colliderRef: RefObject<RapierCollider>;
}

/**
 * The voxel character: visuals plus a dynamic, rotation-locked rigid body.
 * Gravity and jumping stay disabled until a later prompt (PLAYER_GRAVITY_SCALE).
 */
export function Player({ bodyRef, colliderRef }: PlayerProps) {
  return (
    <RigidBody
      ref={bodyRef}
      type="dynamic"
      colliders={false}
      lockRotations
      canSleep={false}
      gravityScale={PLAYER_GRAVITY_SCALE}
      position={PLAYER_SPAWN}
    >
      <CuboidCollider ref={colliderRef} args={PLAYER_BODY_HALF} />
      <mesh castShadow receiveShadow>
        <boxGeometry args={PLAYER_BODY_SIZE} />
        <meshStandardMaterial color={PLAYER_BODY_COLOR} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, PLAYER_HEAD_Y, 0]}>
        <boxGeometry args={[PLAYER_HEAD_SIZE, PLAYER_HEAD_SIZE, PLAYER_HEAD_SIZE]} />
        <meshStandardMaterial color={PLAYER_HEAD_COLOR} />
      </mesh>
    </RigidBody>
  );
}
