import { CuboidCollider, RigidBody } from '@react-three/rapier';
import {
  DECORATION_BARREL,
  DECORATION_BOAT,
  DECORATION_CRATES,
  DECORATION_DOCKS,
  DECORATION_GRASS,
  DECORATION_ROCKS,
  DECORATION_TREES,
  DOCK_RAILS,
} from './constants';
import { Model } from './Model';

/** Trees, grass tufts, shoreline rocks, a barrel, and the jetty with its boat. */
export function Decorations() {
  return (
    <>
      {DECORATION_TREES.map((placement, index) => (
        <Model key={`tree-${index}`} {...placement} />
      ))}
      {DECORATION_ROCKS.map((placement, index) => (
        <Model key={`rock-${index}`} {...placement} />
      ))}
      {/* Small ground cover: drawn, but deliberately not solid. */}
      {DECORATION_GRASS.map((placement, index) => (
        <Model key={`grass-${index}`} {...placement} collider={false} />
      ))}
      <Model {...DECORATION_BARREL} />
      {DECORATION_CRATES.map((placement, index) => (
        <Model key={`crate-${index}`} {...placement} />
      ))}

      {DECORATION_DOCKS.map((placement, index) => (
        <Model key={`dock-${index}`} {...placement} />
      ))}
      {/* Low walls along the water side of the deck: the ring wall stops at the
          dock, so this is what keeps the character from stepping off it. */}
      <RigidBody type="fixed" colliders={false}>
        {DOCK_RAILS.map((rail, index) => (
          <CuboidCollider key={`rail-${index}`} args={rail.args} position={rail.position} />
        ))}
      </RigidBody>

      <Model {...DECORATION_BOAT} />
    </>
  );
}
