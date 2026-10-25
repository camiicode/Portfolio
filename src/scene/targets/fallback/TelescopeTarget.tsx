import { CuboidCollider, RigidBody } from '@react-three/rapier';
import {
  LENS_COLOR,
  METAL_COLOR,
  TARGET_TELESCOPE_POSITION,
  TELESCOPE_COLLIDER_CENTER_Y,
  TELESCOPE_COLLIDER_HALF,
  TELESCOPE_HUB_SIZE,
  TELESCOPE_HUB_Y,
  TELESCOPE_LEG_COUNT,
  TELESCOPE_LEG_LENGTH,
  TELESCOPE_LEG_RADIUS,
  TELESCOPE_LEG_SPREAD,
  TELESCOPE_LEG_TILT,
  TELESCOPE_LENS_RADIUS,
  TELESCOPE_LENS_THICKNESS,
  TELESCOPE_TUBE_LENGTH,
  TELESCOPE_TUBE_RADIUS,
  TELESCOPE_TUBE_TILT,
  TELESCOPE_TUBE_Y,
  WOOD_DARK_COLOR,
} from '../../constants';

const LEG_ANGLES = Array.from(
  { length: TELESCOPE_LEG_COUNT },
  (_, index) => (index / TELESCOPE_LEG_COUNT) * Math.PI * 2
);

const legX = TELESCOPE_LEG_SPREAD - (Math.sin(TELESCOPE_LEG_TILT) * TELESCOPE_LEG_LENGTH) / 2;
const legY = (Math.cos(TELESCOPE_LEG_TILT) * TELESCOPE_LEG_LENGTH) / 2;
const endOffset = TELESCOPE_TUBE_LENGTH / 2 + TELESCOPE_LENS_THICKNESS / 2;
const lensY = TELESCOPE_TUBE_Y + Math.cos(TELESCOPE_TUBE_TILT) * endOffset;
const lensZ = Math.sin(TELESCOPE_TUBE_TILT) * endOffset;
const eyepieceY = TELESCOPE_TUBE_Y - Math.cos(TELESCOPE_TUBE_TILT) * endOffset;
const eyepieceZ = -Math.sin(TELESCOPE_TUBE_TILT) * endOffset;

/** Three leaning legs, a hub block and a tube aimed at the sky. */
export function TelescopeTarget() {
  return (
    <RigidBody type="fixed" colliders={false} position={TARGET_TELESCOPE_POSITION}>
      <CuboidCollider
        args={TELESCOPE_COLLIDER_HALF}
        position={[0, TELESCOPE_COLLIDER_CENTER_Y, 0]}
      />

      {LEG_ANGLES.map((angle) => (
        <group key={angle} rotation={[0, angle, 0]}>
          <mesh castShadow position={[legX, legY, 0]} rotation={[0, 0, TELESCOPE_LEG_TILT]}>
            <cylinderGeometry
              args={[TELESCOPE_LEG_RADIUS, TELESCOPE_LEG_RADIUS, TELESCOPE_LEG_LENGTH, 6]}
            />
            <meshStandardMaterial color={WOOD_DARK_COLOR} />
          </mesh>
        </group>
      ))}

      <mesh castShadow position={[0, TELESCOPE_HUB_Y, 0]}>
        <boxGeometry args={[TELESCOPE_HUB_SIZE, TELESCOPE_HUB_SIZE, TELESCOPE_HUB_SIZE]} />
        <meshStandardMaterial color={METAL_COLOR} />
      </mesh>

      <mesh
        castShadow
        position={[0, TELESCOPE_TUBE_Y, 0]}
        rotation={[TELESCOPE_TUBE_TILT, 0, 0]}
      >
        <cylinderGeometry
          args={[TELESCOPE_TUBE_RADIUS, TELESCOPE_TUBE_RADIUS * 1.2, TELESCOPE_TUBE_LENGTH, 12]}
        />
        <meshStandardMaterial color={METAL_COLOR} />
      </mesh>

      <mesh position={[0, lensY, lensZ]} rotation={[TELESCOPE_TUBE_TILT, 0, 0]}>
        <cylinderGeometry
          args={[TELESCOPE_LENS_RADIUS, TELESCOPE_LENS_RADIUS, TELESCOPE_LENS_THICKNESS, 12]}
        />
        <meshStandardMaterial
          color={LENS_COLOR}
          emissive={LENS_COLOR}
          emissiveIntensity={0.35}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, eyepieceY, eyepieceZ]} rotation={[TELESCOPE_TUBE_TILT, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.12, 8]} />
        <meshStandardMaterial color={WOOD_DARK_COLOR} />
      </mesh>
    </RigidBody>
  );
}
