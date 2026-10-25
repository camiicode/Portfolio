import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment as EnvironmentMap } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import type { RapierCollider, RapierRigidBody } from '@react-three/rapier';
import { AssetBoundary } from './AssetBoundary';
import { Decorations } from './Decorations';
import { Environment } from './Environment';
import { FollowCamera } from './FollowCamera';
import { Island } from './Island';
import { Model } from './Model';
import { Player } from './Player';
import { PlayerController } from './PlayerController';
import { TargetManager } from './TargetManager';
import { CampfireEffects } from './targets/CampfireEffects';
import {
  AMBIENT_LIGHT_INTENSITY,
  CAMERA_FAR,
  CAMERA_FOV,
  CAMERA_NEAR,
  CAMERA_START_POSITION,
  ENVIRONMENT_INTENSITY,
  FOG_FAR,
  FOG_NEAR,
  HEMISPHERE_GROUND_COLOR,
  HEMISPHERE_LIGHT_INTENSITY,
  HEMISPHERE_SKY_COLOR,
  SHADOW_BIAS,
  SHADOW_CAMERA_EXTENT,
  SHADOW_CAMERA_FAR,
  SHADOW_CAMERA_NEAR,
  SHADOW_MAP_SIZE,
  SHADOW_NORMAL_BIAS,
  SKY_COLOR,
  SUN_LIGHT_INTENSITY,
  SUN_POSITION,
  TARGET_CAMPFIRE_POSITION,
  TARGET_COMPUTER_POSITION,
  TARGET_MODELS,
  TARGET_SERVICES_POSITION,
  TARGET_TELESCOPE_POSITION,
  TARGETS,
} from './constants';

/** Position of each target, keyed for the model table below. */
const TARGET_POSITIONS = {
  computer: TARGET_COMPUTER_POSITION,
  campfire: TARGET_CAMPFIRE_POSITION,
  telescope: TARGET_TELESCOPE_POSITION,
  services: TARGET_SERVICES_POSITION,
} as const;

export function Scene() {
  const playerBody = useRef<RapierRigidBody>(null);
  const playerCollider = useRef<RapierCollider>(null);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ fov: CAMERA_FOV, position: CAMERA_START_POSITION, near: CAMERA_NEAR, far: CAMERA_FAR }}
    >
      <color attach="background" args={[SKY_COLOR]} />
      <fog attach="fog" args={[SKY_COLOR, FOG_NEAR, FOG_FAR]} />
      <Environment />

      {/* Image-based lighting for the imported models. The HDR is a remote
          fetch, so a failed connection only loses the reflections. */}
      <AssetBoundary label="city HDR environment" fallback={null}>
        <Suspense fallback={null}>
          <EnvironmentMap preset="sunset" environmentIntensity={ENVIRONMENT_INTENSITY} />
        </Suspense>
      </AssetBoundary>

      <ambientLight intensity={AMBIENT_LIGHT_INTENSITY} />
      <hemisphereLight
        color={HEMISPHERE_SKY_COLOR}
        groundColor={HEMISPHERE_GROUND_COLOR}
        intensity={HEMISPHERE_LIGHT_INTENSITY}
      />
      <directionalLight
        castShadow
        position={SUN_POSITION}
        intensity={SUN_LIGHT_INTENSITY}
        shadow-mapSize-width={SHADOW_MAP_SIZE}
        shadow-mapSize-height={SHADOW_MAP_SIZE}
        shadow-camera-left={-SHADOW_CAMERA_EXTENT}
        shadow-camera-right={SHADOW_CAMERA_EXTENT}
        shadow-camera-top={SHADOW_CAMERA_EXTENT}
        shadow-camera-bottom={-SHADOW_CAMERA_EXTENT}
        shadow-camera-near={SHADOW_CAMERA_NEAR}
        shadow-camera-far={SHADOW_CAMERA_FAR}
        shadow-bias={SHADOW_BIAS}
        shadow-normalBias={SHADOW_NORMAL_BIAS}
      />
      <Physics timeStep="vary">
        <Island />
        <Decorations />

        <Suspense fallback={null}>
          {TARGETS.map((target) => (
            <Model
              key={target.id}
              position={TARGET_POSITIONS[target.id]}
              {...TARGET_MODELS[target.id]}
            />
          ))}
        </Suspense>

        <Player bodyRef={playerBody} colliderRef={playerCollider} />
        <PlayerController bodyRef={playerBody} colliderRef={playerCollider} />
        <TargetManager playerRef={playerBody} />
        <FollowCamera targetRef={playerBody} />
      </Physics>

      {/* Warm light and smoke for the campfire, which is a static model now. */}
      <CampfireEffects />
    </Canvas>
  );
}
