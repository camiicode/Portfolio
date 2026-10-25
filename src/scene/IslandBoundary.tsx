import { CuboidCollider } from '@react-three/rapier';
import {
  BOUNDARY_CENTER_Y,
  BOUNDARY_HALF_HEIGHT,
  BOUNDARY_RADIUS,
  BOUNDARY_SEGMENTS,
  BOUNDARY_THICKNESS,
  DOCK_SIZE,
} from './constants';

/**
 * Invisible walls around the round shoreline, built from tangential boxes.
 * A single cylinder would not work: the character stands inside it, so the
 * collider would push it outwards instead of fencing it in.
 *
 * The ring is left open exactly where the dock crosses the shore, so the deck
 * — and its own rails — are the only way past the water's edge.
 */
export function IslandBoundary() {
  const segmentLength = (2 * Math.PI * BOUNDARY_RADIUS) / BOUNDARY_SEGMENTS;
  const dockHalfWidth = DOCK_SIZE[0] / 2;

  return (
    <>
      {Array.from({ length: BOUNDARY_SEGMENTS }, (_, index) => {
        const angle = (index / BOUNDARY_SEGMENTS) * Math.PI * 2;
        const x = Math.cos(angle) * BOUNDARY_RADIUS;
        const z = Math.sin(angle) * BOUNDARY_RADIUS;
        // Only the +z stretch is skipped, where the jetty leaves the island.
        if (z > 0 && Math.abs(x) < dockHalfWidth) return null;

        return (
          <CuboidCollider
            key={index}
            // The long axis is z locally, which the yaw below swings onto the tangent.
            args={[BOUNDARY_THICKNESS / 2, BOUNDARY_HALF_HEIGHT, segmentLength / 2 + 0.05]}
            position={[x, BOUNDARY_CENTER_Y, z]}
            rotation={[0, -angle, 0]}
          />
        );
      })}
    </>
  );
}
