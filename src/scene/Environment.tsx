import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BackSide, BoxGeometry, Color, MeshBasicMaterial, type Group, type Mesh } from 'three';
import {
  CLOUDS,
  CLOUD_COLOR,
  CLOUD_SIZE,
  CLOUD_SPEED,
  CLOUD_WRAP_RADIUS,
  FOAM_COLOR,
  FOAM_OPACITY,
  FOAM_PULSE_DEPTH,
  FOAM_PULSE_SPEED,
  FOAM_RADIUS,
  FOAM_RADIUS_JITTER,
  FOAM_SEGMENT_SIZE,
  FOAM_SEGMENTS,
  FOAM_WASH_SPEED,
  FOAM_Y,
  OCEAN_BOB_HEIGHT,
  OCEAN_BOB_SPEED,
  OCEAN_COLOR,
  OCEAN_METALNESS,
  OCEAN_ROUGHNESS,
  OCEAN_SIZE,
  OCEAN_Y,
  SHALLOW_WATER_COLOR,
  SHALLOW_WATER_DEEP_COLOR,
  SHALLOW_WATER_INNER_RADIUS,
  SHALLOW_WATER_MID_RADIUS,
  SHALLOW_WATER_METALNESS,
  SHALLOW_WATER_OUTER_RADIUS,
  SHALLOW_WATER_ROUGHNESS,
  SHALLOW_WATER_Y,
  SKY_DOME_EXPONENT,
  SKY_DOME_RADIUS,
  SKY_HORIZON_COLOR,
  SKY_TOP_COLOR,
} from './constants';

const SKY_VERTEX_SHADER = /* glsl */ `
  varying vec3 vWorldPosition;

  void main() {
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SKY_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 topColor;
  uniform vec3 horizonColor;
  uniform float exponent;
  varying vec3 vWorldPosition;

  void main() {
    float height = clamp(normalize(vWorldPosition).y, 0.0, 1.0);
    gl_FragColor = vec4(mix(horizonColor, topColor, pow(height, exponent)), 1.0);
    #include <colorspace_fragment>
  }
`;

/** Inverted sphere painted with a vertical gradient; the fog colour is its horizon. */
function SkyDome() {
  const uniforms = useMemo(
    () => ({
      topColor: { value: new Color(SKY_TOP_COLOR) },
      horizonColor: { value: new Color(SKY_HORIZON_COLOR) },
      exponent: { value: SKY_DOME_EXPONENT },
    }),
    []
  );

  return (
    <mesh frustumCulled={false}>
      <sphereGeometry args={[SKY_DOME_RADIUS, 24, 16]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={SKY_VERTEX_SHADER}
        fragmentShader={SKY_FRAGMENT_SHADER}
        side={BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/** Deep, glossy sea with a slow, barely perceptible swell. */
function Ocean() {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const time = clock.elapsedTime * OCEAN_BOB_SPEED;
    mesh.position.y = OCEAN_Y + Math.sin(time) * OCEAN_BOB_HEIGHT;
    const swell = 1 + Math.sin(time * 0.7) * 0.004;
    mesh.scale.set(swell, 1, swell);
  });

  return (
    <mesh ref={meshRef} position={[0, OCEAN_Y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[OCEAN_SIZE, OCEAN_SIZE]} />
      <meshStandardMaterial
        color={OCEAN_COLOR}
        roughness={OCEAN_ROUGHNESS}
        metalness={OCEAN_METALNESS}
      />
    </mesh>
  );
}

/**
 * Bright turquoise shelf hugging the island, a hair above the open sea. Two
 * rings give it a depth falloff instead of a single hard edge.
 */
function Shallows() {
  return (
    <group position={[0, SHALLOW_WATER_Y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <ringGeometry args={[SHALLOW_WATER_INNER_RADIUS, SHALLOW_WATER_MID_RADIUS, 64, 1]} />
        <meshStandardMaterial
          color={SHALLOW_WATER_COLOR}
          roughness={SHALLOW_WATER_ROUGHNESS}
          metalness={SHALLOW_WATER_METALNESS}
        />
      </mesh>
      <mesh>
        <ringGeometry args={[SHALLOW_WATER_MID_RADIUS, SHALLOW_WATER_OUTER_RADIUS, 64, 1]} />
        <meshStandardMaterial
          color={SHALLOW_WATER_DEEP_COLOR}
          roughness={SHALLOW_WATER_ROUGHNESS}
          metalness={SHALLOW_WATER_METALNESS}
        />
      </mesh>
    </group>
  );
}

/**
 * Foam at the waterline: flat slabs on a ring that breathe in and out, with one
 * shared transparent material so the whole line pulses together.
 */
function Foam() {
  const groupRef = useRef<Group>(null);
  const material = useMemo(
    () =>
      new MeshBasicMaterial({
        color: FOAM_COLOR,
        transparent: true,
        opacity: FOAM_OPACITY,
        depthWrite: false,
      }),
    []
  );
  const geometry = useMemo(() => new BoxGeometry(...FOAM_SEGMENT_SIZE), []);

  useEffect(
    () => () => {
      material.dispose();
      geometry.dispose();
    },
    [geometry, material]
  );

  const segments = useMemo(
    () =>
      Array.from({ length: FOAM_SEGMENTS }, (_, index) => {
        const angle = (index / FOAM_SEGMENTS) * Math.PI * 2;
        // A fixed wobble, so the ring looks broken up but never reshuffles.
        const radius = FOAM_RADIUS + Math.sin(index * 2.399) * FOAM_RADIUS_JITTER;
        return {
          key: index,
          position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius] as [
            number,
            number,
            number,
          ],
          rotation: -angle,
        };
      }),
    []
  );

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    material.opacity = FOAM_OPACITY + Math.sin(time * FOAM_PULSE_SPEED) * FOAM_PULSE_DEPTH;

    const group = groupRef.current;
    if (!group) return;
    group.children.forEach((segment, index) => {
      // Each slab thickens and thins radially, so the line looks like it is
      // running up the sand and sliding back out.
      const wash = 0.65 + Math.sin(time * FOAM_WASH_SPEED + index * 0.7) * 0.35;
      segment.scale.set(wash, 1, 0.9 + wash * 0.1);
      segment.position.y = Math.sin(time * FOAM_WASH_SPEED + index) * 0.012;
    });
  });

  return (
    <group ref={groupRef} position={[0, FOAM_Y, 0]}>
      {segments.map((segment) => (
        <mesh
          key={segment.key}
          geometry={geometry}
          material={material}
          position={segment.position}
          rotation={[0, segment.rotation, 0]}
        />
      ))}
    </group>
  );
}

/** Flat white slabs drifting across the sky, wrapping around when they leave. */
function Clouds() {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const step = CLOUD_SPEED * delta;
    group.children.forEach((cloud) => {
      cloud.position.x += step;
      if (cloud.position.x > CLOUD_WRAP_RADIUS) cloud.position.x = -CLOUD_WRAP_RADIUS;
    });
  });

  return (
    <group ref={groupRef}>
      {CLOUDS.map((cloud, index) => (
        <mesh key={index} position={cloud.position} scale={cloud.scale}>
          <boxGeometry args={CLOUD_SIZE} />
          <meshBasicMaterial color={CLOUD_COLOR} />
        </mesh>
      ))}
    </group>
  );
}

/** Sky, sea, shallows, foam and clouds: everything outside the physics world. */
export function Environment() {
  return (
    <>
      <SkyDome />
      <Ocean />
      <Shallows />
      <Foam />
      <Clouds />
    </>
  );
}
