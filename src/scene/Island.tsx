import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { CuboidCollider, CylinderCollider, RigidBody } from '@react-three/rapier';
import { BoxGeometry, InstancedMesh, MeshStandardMaterial, Object3D } from 'three';
import { IslandBoundary } from './IslandBoundary';
import {
  BEACH_WIDTH,
  DIRT_COLOR,
  GRASS_COLOR,
  ISLAND_BASE_THICKNESS,
  ISLAND_GRID_SIZE,
  ISLAND_RADIUS,
  PLATEAU_CENTER,
  PLATEAU_RADIUS,
  SAND_COLOR,
  TILE_HEIGHT,
  TILE_SIZE,
  TILE_TOP_HIGH,
  TILE_TOP_LOW,
} from './constants';

interface Tile {
  x: number;
  z: number;
  top: number;
  /** Shore tiles get a sand top instead of grass. */
  sand: boolean;
}

/** A round island: tiles whose centre falls outside the radius are dropped. */
function buildTiles(): Tile[] {
  const tiles: Tile[] = [];
  const half = ISLAND_GRID_SIZE / 2;

  for (let column = 0; column < ISLAND_GRID_SIZE; column += 1) {
    for (let row = 0; row < ISLAND_GRID_SIZE; row += 1) {
      const x = column - half + TILE_SIZE / 2;
      const z = row - half + TILE_SIZE / 2;
      const fromCenter = Math.hypot(x, z);
      if (fromCenter > ISLAND_RADIUS) continue;

      const onPlateau =
        Math.hypot(x - PLATEAU_CENTER[0], z - PLATEAU_CENTER[1]) <= PLATEAU_RADIUS;
      tiles.push({
        x,
        z,
        top: onPlateau ? TILE_TOP_HIGH : TILE_TOP_LOW,
        sand: !onPlateau && fromCenter > ISLAND_RADIUS - BEACH_WIDTH,
      });
    }
  }

  return tiles;
}

/** Box groups are +x, -x, +y, -y, +z, -z: `top` on the ceiling, dirt elsewhere. */
function createTileMaterials(topColor: string): MeshStandardMaterial[] {
  const top = new MeshStandardMaterial({ color: topColor });
  const dirt = new MeshStandardMaterial({ color: DIRT_COLOR });
  return [dirt, dirt, top, dirt, dirt, dirt];
}

export function Island() {
  const tiles = useMemo(buildTiles, []);
  const grassTiles = useMemo(() => tiles.filter((tile) => !tile.sand), [tiles]);
  const sandTiles = useMemo(() => tiles.filter((tile) => tile.sand), [tiles]);
  const raisedTiles = useMemo(() => tiles.filter((tile) => tile.top !== TILE_TOP_LOW), [tiles]);

  const geometry = useMemo(() => new BoxGeometry(TILE_SIZE, TILE_HEIGHT, TILE_SIZE), []);
  const grassMaterials = useMemo(() => createTileMaterials(GRASS_COLOR), []);
  const sandMaterials = useMemo(() => createTileMaterials(SAND_COLOR), []);
  const grassRef = useRef<InstancedMesh>(null);
  const sandRef = useRef<InstancedMesh>(null);

  useEffect(
    () => () => {
      geometry.dispose();
      grassMaterials.forEach((material) => material.dispose());
      sandMaterials.forEach((material) => material.dispose());
    },
    [geometry, grassMaterials, sandMaterials]
  );

  useLayoutEffect(() => {
    const place = (mesh: InstancedMesh | null, list: Tile[]) => {
      if (!mesh) return;
      const transform = new Object3D();
      list.forEach((tile, index) => {
        transform.position.set(tile.x, tile.top - TILE_HEIGHT / 2, tile.z);
        transform.updateMatrix();
        mesh.setMatrixAt(index, transform.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
    };

    place(grassRef.current, grassTiles);
    place(sandRef.current, sandTiles);
  }, [grassTiles, sandTiles]);

  return (
    <RigidBody type="fixed" colliders={false}>
      <instancedMesh
        ref={grassRef}
        args={[geometry, grassMaterials, grassTiles.length]}
        castShadow
        receiveShadow
      />
      <instancedMesh
        ref={sandRef}
        args={[geometry, sandMaterials, sandTiles.length]}
        castShadow
        receiveShadow
      />
      {/* Round base: the collider follows the circular shoreline, not the grid. */}
      <CylinderCollider
        args={[ISLAND_BASE_THICKNESS / 2, ISLAND_RADIUS]}
        position={[0, -ISLAND_BASE_THICKNESS / 2, 0]}
      />
      {raisedTiles.map((tile) => (
        <CuboidCollider
          key={`${tile.x}:${tile.z}`}
          args={[TILE_SIZE / 2, TILE_HEIGHT / 2, TILE_SIZE / 2]}
          position={[tile.x, tile.top - TILE_HEIGHT / 2, tile.z]}
        />
      ))}
      <IslandBoundary />
    </RigidBody>
  );
}
