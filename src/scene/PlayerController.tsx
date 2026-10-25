import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { useRapier } from '@react-three/rapier';
import type { RapierCollider, RapierContext, RapierRigidBody } from '@react-three/rapier';
import { Vector3 } from 'three';
import { useGameStore } from '../store/useGameStore';
import { useKeyboard } from './useKeyboard';
import {
  AUTOSTEP_MAX_HEIGHT,
  AUTOSTEP_MIN_WIDTH,
  CAMERA_FORWARD,
  CAMERA_RIGHT,
  CONTROLLER_OFFSET,
  MAX_FRAME_DELTA,
  MIN_FRAME_DELTA,
  PLAYER_SPEED,
  SNAP_TO_GROUND_DISTANCE,
} from './constants';

type CharacterController = ReturnType<RapierContext['world']['createCharacterController']>;

export interface PlayerControllerProps {
  bodyRef: RefObject<RapierRigidBody>;
  colliderRef: RefObject<RapierCollider>;
}

/**
 * Moves the player every frame. Input comes from the keyboard on desktop and
 * from the joystick store on mobile; both are screen-space vectors that get
 * projected onto the (fixed) camera basis.
 *
 * Gravity itself is left to Rapier (PLAYER_GRAVITY_SCALE = 1); this only drives
 * the horizontal velocity through the character controller. While airborne the
 * body's falling speed is preserved instead of being zeroed, so the character
 * lands on the island and stays pressed against the ground.
 */
export function PlayerController({ bodyRef, colliderRef }: PlayerControllerProps) {
  const { world } = useRapier();
  const keyboardDirection = useKeyboard();
  const isMobile = useGameStore((state) => state.isMobile);
  const moveInput = useGameStore((state) => state.moveInput);
  /** A panel is open: the character stands still until it closes. */
  const isPaused = useGameStore((state) => state.activeTargetId !== null);
  const controllerRef = useRef<CharacterController | null>(null);

  const screenDirection = useMemo(() => new Vector3(), []);
  const worldDirection = useMemo(() => new Vector3(), []);
  const desiredMovement = useMemo(() => new Vector3(), []);

  useEffect(() => {
    const controller = world.createCharacterController(CONTROLLER_OFFSET);
    controller.enableAutostep(AUTOSTEP_MAX_HEIGHT, AUTOSTEP_MIN_WIDTH, false);
    controller.enableSnapToGround(SNAP_TO_GROUND_DISTANCE);
    controllerRef.current = controller;

    return () => {
      world.removeCharacterController(controller);
      controllerRef.current = null;
    };
  }, [world]);

  useFrame((_, delta) => {
    const body = bodyRef.current;
    const collider = colliderRef.current;
    const controller = controllerRef.current;
    if (!body || !collider || !controller) return;

    const frameDelta = Math.min(Math.max(delta, MIN_FRAME_DELTA), MAX_FRAME_DELTA);

    if (isPaused) {
      screenDirection.set(0, 0, 0);
    } else if (isMobile) {
      screenDirection.set(moveInput[0], 0, -moveInput[1]);
    } else {
      screenDirection.copy(keyboardDirection);
    }
    if (screenDirection.lengthSq() > 1) screenDirection.normalize();

    worldDirection
      .set(0, 0, 0)
      .addScaledVector(CAMERA_RIGHT, screenDirection.x)
      .addScaledVector(CAMERA_FORWARD, -screenDirection.z);

    // Standing still must not cancel the downward pull: keep the vertical
    // (falling) velocity, only the horizontal part is driven here.
    const fallVelocity = controller.computedGrounded() ? 0 : body.linvel().y;

    if (worldDirection.lengthSq() === 0) {
      body.setLinvel({ x: 0, y: fallVelocity, z: 0 }, true);
      return;
    }

    desiredMovement.copy(worldDirection).multiplyScalar(PLAYER_SPEED * frameDelta);
    controller.computeColliderMovement(collider, desiredMovement);

    const movement = controller.computedMovement();
    const velocity = 1 / frameDelta;
    body.setLinvel(
      {
        x: movement.x * velocity,
        // movement.y carries steps and ledge snaps, fallVelocity keeps the fall.
        y: movement.y * velocity + fallVelocity,
        z: movement.z * velocity,
      },
      true
    );
  });

  return null;
}
