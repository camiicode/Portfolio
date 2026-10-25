import { Suspense, useMemo, type ReactNode } from 'react';
import { useGLTF } from '@react-three/drei';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import {
  Box3,
  BufferAttribute,
  Vector3,
  type BufferGeometry,
  type Object3D,
} from 'three';
import { AssetBoundary } from './AssetBoundary';

export interface ModelProps {
  /** Path under public/, e.g. /models/workbench.glb */
  url: string;
  position: [number, number, number];
  /** Uniform multiplier applied to the imported model. Defaults to 1. */
  scale?: number;
  /** Yaw in radians. Defaults to 0. */
  rotation?: number;
  /**
   * A second file drawn in the same transform. Kenney splits the tent into a
   * frame and a canvas that only look finished together.
   */
  overlayUrl?: string;
  /**
   * Height of an invisible box used instead of a hull, for props that are too
   * flat for their own shape to stop the character. Omit for a hull collider.
   */
  blockHeight?: number;
  /** Box collider the height of the model itself, so its top reads as a floor. */
  platform?: boolean;
  /** Set false for pure decoration (grass, plants) that nobody should bump into. */
  collider?: boolean;
  /** Stand-in while the file downloads, or if it never arrives. */
  fallback?: ReactNode;
}

/**
 * Rapier builds a hull straight from `geometry.attributes.position.array`, but
 * glTF files usually interleave positions with normals and uvs — that array is
 * then the whole vertex buffer, and the hull would swallow the island. Give
 * every mesh a plain, de-interleaved position buffer so the hull is real.
 */
function withPlainPositions(geometry: BufferGeometry): BufferGeometry {
  const position = geometry.getAttribute('position');
  if (!position || position instanceof BufferAttribute) return geometry;

  const flat = new Float32Array(position.count * 3);
  for (let index = 0; index < position.count; index += 1) {
    flat[index * 3] = position.getX(index);
    flat[index * 3 + 1] = position.getY(index);
    flat[index * 3 + 2] = position.getZ(index);
  }

  const copy = geometry.clone();
  copy.setAttribute('position', new BufferAttribute(flat, 3));
  return copy;
}

/**
 * `colliders="hull"` throws on a completely flat mesh (a plane has no volume),
 * so those models — and the whole-model flat case — fall back to box colliders.
 */
function colliderShapeFor(bounds: Box3): 'hull' | 'cuboid' {
  const size = bounds.getSize(new Vector3());
  const largest = Math.max(size.x, size.y, size.z);
  const smallest = Math.min(size.x, size.y, size.z);
  return largest > 0 && smallest > largest * 0.01 ? 'hull' : 'cuboid';
}

/** useGLTF caches one scene per url, so every placement gets its own clone. */
function usePreparedModel(url: string): Object3D {
  const { scene } = useGLTF(url);

  return useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      const mesh = child as { isMesh?: boolean; geometry?: BufferGeometry };
      if (!mesh.isMesh || !mesh.geometry) return;
      mesh.geometry = withPlainPositions(mesh.geometry);
      const renderable = child as { castShadow: boolean; receiveShadow: boolean };
      renderable.castShadow = true;
      renderable.receiveShadow = true;
    });
    return clone;
  }, [scene]);
}

interface GltfModelProps {
  url: string;
  position: [number, number, number];
  scale: number;
  rotation: number;
  blockHeight?: number;
  platform?: boolean;
  overlayUrl?: string;
  collider?: boolean;
}

/** The second half of a split kit prop: it renders, it does not collide. */
function OverlayModel({ url }: { url: string }) {
  const model = usePreparedModel(url);
  return <primitive object={model} />;
}

/** Loads the file (suspends), clones it, and gives it a fixed, solid body. */
function GltfModel({
  url,
  position,
  scale,
  rotation,
  blockHeight,
  platform,
  overlayUrl,
  collider,
}: GltfModelProps) {
  const model = usePreparedModel(url);
  const bounds = useMemo(() => new Box3().setFromObject(model), [model]);
  const size = bounds.getSize(new Vector3());

  // Quarter turns swap the footprint, so the box follows the yaw.
  const quarterTurned = Math.abs(Math.round(rotation / (Math.PI / 2))) % 2 === 1;
  const footprintX = (quarterTurned ? size.z : size.x) * scale;
  const footprintZ = (quarterTurned ? size.x : size.z) * scale;
  const boxHeight = blockHeight ?? (platform ? size.y * scale : 0);

  const content = (
    <group scale={scale} rotation={[0, rotation, 0]}>
      <primitive object={model} />
      {overlayUrl ? <OverlayModel url={overlayUrl} /> : null}
    </group>
  );

  if (collider === false) return <group position={position}>{content}</group>;

  return (
    <RigidBody type="fixed" colliders={boxHeight ? false : colliderShapeFor(bounds)} position={position}>
      {content}
      {boxHeight ? (
        <CuboidCollider
          args={[footprintX / 2, boxHeight / 2, footprintZ / 2]}
          position={[0, boxHeight / 2, 0]}
        />
      ) : null}
    </RigidBody>
  );
}

/**
 * A .glb placed in the world with a fixed collider. Drop the file in
 * public/models/ and point `url` at it; nothing else has to change.
 */
export function Model({
  url,
  position,
  scale = 1,
  rotation = 0,
  blockHeight,
  platform,
  overlayUrl,
  collider = true,
  fallback = null,
}: ModelProps) {
  return (
    <AssetBoundary label={url} fallback={fallback}>
      <Suspense fallback={fallback}>
        <GltfModel
          url={url}
          position={position}
          scale={scale}
          rotation={rotation}
          blockHeight={blockHeight}
          platform={platform}
          overlayUrl={overlayUrl}
          collider={collider}
        />
      </Suspense>
    </AssetBoundary>
  );
}
