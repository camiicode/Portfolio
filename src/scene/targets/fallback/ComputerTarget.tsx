import { CuboidCollider, RigidBody } from '@react-three/rapier';
import {
  COMPUTER_COLLIDER_CENTER_Y,
  COMPUTER_COLLIDER_HALF,
  COMPUTER_DESK_HEIGHT,
  COMPUTER_DESK_SURFACE_Y,
  COMPUTER_DESK_TOP_SIZE,
  COMPUTER_KEYBOARD_SIZE,
  COMPUTER_KEYBOARD_Z,
  COMPUTER_LEG_HEIGHT,
  COMPUTER_LEG_INSET,
  COMPUTER_LEG_SIZE,
  COMPUTER_MONITOR_SIZE,
  COMPUTER_MONITOR_Y,
  COMPUTER_MONITOR_Z,
  COMPUTER_SCREEN_SIZE,
  KEYBOARD_COLOR,
  MONITOR_COLOR,
  SCREEN_COLOR,
  TARGET_COMPUTER_POSITION,
  WOOD_COLOR,
  WOOD_DARK_COLOR,
} from '../../constants';

const LEG_CORNERS: [number, number][] = [
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
];

const legX = COMPUTER_DESK_TOP_SIZE[0] / 2 - COMPUTER_LEG_INSET;
const legZ = COMPUTER_DESK_TOP_SIZE[2] / 2 - COMPUTER_LEG_INSET;
const screenZ = COMPUTER_MONITOR_Z + COMPUTER_MONITOR_SIZE[2] / 2 + COMPUTER_SCREEN_SIZE[2] / 2 - 0.01;

/** Voxel desk: worktop on four legs, a glowing monitor and a keyboard. */
export function ComputerTarget() {
  return (
    <RigidBody type="fixed" colliders={false} position={TARGET_COMPUTER_POSITION}>
      <CuboidCollider args={COMPUTER_COLLIDER_HALF} position={[0, COMPUTER_COLLIDER_CENTER_Y, 0]} />

      <mesh castShadow receiveShadow position={[0, COMPUTER_DESK_HEIGHT, 0]}>
        <boxGeometry args={COMPUTER_DESK_TOP_SIZE} />
        <meshStandardMaterial color={WOOD_COLOR} />
      </mesh>

      {LEG_CORNERS.map(([sx, sz]) => (
        <mesh
          key={`${sx}:${sz}`}
          castShadow
          position={[sx * legX, COMPUTER_LEG_HEIGHT / 2, sz * legZ]}
        >
          <boxGeometry args={COMPUTER_LEG_SIZE} />
          <meshStandardMaterial color={WOOD_DARK_COLOR} />
        </mesh>
      ))}

      <mesh castShadow position={[0, COMPUTER_MONITOR_Y, COMPUTER_MONITOR_Z]}>
        <boxGeometry args={COMPUTER_MONITOR_SIZE} />
        <meshStandardMaterial color={MONITOR_COLOR} />
      </mesh>

      <mesh position={[0, COMPUTER_MONITOR_Y, screenZ]}>
        <boxGeometry args={COMPUTER_SCREEN_SIZE} />
        <meshStandardMaterial
          color={SCREEN_COLOR}
          emissive={SCREEN_COLOR}
          emissiveIntensity={0.9}
          toneMapped={false}
        />
      </mesh>

      <mesh castShadow position={[0, COMPUTER_DESK_SURFACE_Y + 0.03, COMPUTER_MONITOR_Z]}>
        <boxGeometry args={[0.34, 0.06, 0.22]} />
        <meshStandardMaterial color={WOOD_DARK_COLOR} />
      </mesh>

      <mesh castShadow position={[0, COMPUTER_DESK_SURFACE_Y + 0.025, COMPUTER_KEYBOARD_Z]}>
        <boxGeometry args={COMPUTER_KEYBOARD_SIZE} />
        <meshStandardMaterial color={KEYBOARD_COLOR} />
      </mesh>
    </RigidBody>
  );
}
