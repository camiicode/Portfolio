import { useMemo, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { RapierRigidBody } from '@react-three/rapier';
import { Vector3 } from 'three';
import {
  CAMERA_LOOK_AT_HEIGHT,
  CAMERA_LERP_SMOOTHING,
  CAMERA_OFFSET_VECTOR,
  MAX_FRAME_DELTA,
  MIN_FRAME_DELTA,
} from './constants';

export interface FollowCameraProps {
  targetRef: RefObject<RapierRigidBody>;
}

/** Third-person camera: fixed offset from the player, lerped every frame. */
export function FollowCamera({ targetRef }: FollowCameraProps) {
  const camera = useThree((state) => state.camera);
  const targetPosition = useMemo(() => new Vector3(), []);
  const desiredPosition = useMemo(() => new Vector3(), []);

  useFrame((_, delta) => {
    const body = targetRef.current;
    if (!body) return;

    const position = body.translation();
    targetPosition.set(position.x, position.y, position.z);
    desiredPosition.copy(targetPosition).add(CAMERA_OFFSET_VECTOR);

    const frameDelta = Math.min(Math.max(delta, MIN_FRAME_DELTA), MAX_FRAME_DELTA);
    const blend = 1 - Math.exp(-CAMERA_LERP_SMOOTHING * frameDelta);

    camera.position.lerp(desiredPosition, blend);
    camera.lookAt(
      targetPosition.x,
      targetPosition.y + CAMERA_LOOK_AT_HEIGHT,
      targetPosition.z
    );
  });

  return null;
}
