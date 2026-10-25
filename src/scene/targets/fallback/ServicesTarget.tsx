import { Text } from '@react-three/drei';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import {
  SIGN_BOARD_SIZE,
  SIGN_BOARD_Y,
  SIGN_COLLIDER_CENTER_Y,
  SIGN_COLLIDER_HALF,
  SIGN_POST_SIZE,
  SIGN_TEXT_COLOR,
  SIGN_TEXT_SIZE,
  TARGET_SERVICES_POSITION,
  WOOD_COLOR,
  WOOD_DARK_COLOR,
} from '../../constants';

/**
 * Wooden signpost. The camera always looks in from the +x/+z corner, so the
 * lettering sits on that face to stay readable from the usual viewpoint.
 */
export function ServicesTarget() {
  return (
    <RigidBody type="fixed" colliders={false} position={TARGET_SERVICES_POSITION}>
      <CuboidCollider args={SIGN_COLLIDER_HALF} position={[0, SIGN_COLLIDER_CENTER_Y, 0]} />

      <mesh castShadow receiveShadow position={[0, SIGN_POST_SIZE[1] / 2, 0]}>
        <boxGeometry args={SIGN_POST_SIZE} />
        <meshStandardMaterial color={WOOD_DARK_COLOR} />
      </mesh>

      <mesh castShadow receiveShadow position={[0, SIGN_BOARD_Y, 0]}>
        <boxGeometry args={SIGN_BOARD_SIZE} />
        <meshStandardMaterial color={WOOD_COLOR} />
      </mesh>

      <Text
        position={[0, SIGN_BOARD_Y, SIGN_BOARD_SIZE[2] / 2 + 0.006]}
        fontSize={SIGN_TEXT_SIZE}
        color={SIGN_TEXT_COLOR}
        anchorX="center"
        anchorY="middle"
      >
        Services
      </Text>
    </RigidBody>
  );
}
