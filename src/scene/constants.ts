import { Vector3 } from 'three';

/* ---------------------------------- island --------------------------------- */

export const ISLAND_GRID_SIZE = 20;
export const TILE_SIZE = 1;
export const TILE_HEIGHT = 1;
export const TILE_TOP_LOW = 0;
export const TILE_TOP_HIGH = 0.5;
/** Tiles whose centre lies further out than this are skipped, making a round island. */
export const ISLAND_RADIUS = 9;
/** Width of the sand ring along the shore, in tiles. */
export const BEACH_WIDTH = 2;
export const ISLAND_BASE_THICKNESS = 1;
export const PLATEAU_CENTER: [number, number] = [2.5, -2.5];
/** Keeps the raised 3x3 block clear of the cardinal targets placed below. */
export const PLATEAU_RADIUS = 1.8;

/** Invisible edge walls, see IslandBoundary.tsx. */
export const BOUNDARY_THICKNESS = 0.4;
export const BOUNDARY_HALF_HEIGHT = 2;
export const BOUNDARY_CENTER_Y = 1;
export const BOUNDARY_SEGMENTS = 72;
export const BOUNDARY_RADIUS = ISLAND_RADIUS + BOUNDARY_THICKNESS / 2;

/* ---------------------------------- player --------------------------------- */

export const PLAYER_BODY_SIZE: [number, number, number] = [0.8, 1.6, 0.8];
export const PLAYER_BODY_HALF: [number, number, number] = [
  PLAYER_BODY_SIZE[0] / 2,
  PLAYER_BODY_SIZE[1] / 2,
  PLAYER_BODY_SIZE[2] / 2,
];
export const PLAYER_HEAD_SIZE = 0.6;
export const PLAYER_HEAD_Y = PLAYER_BODY_SIZE[1] / 2 + PLAYER_HEAD_SIZE / 2;
export const PLAYER_SPAWN: [number, number, number] = [0, PLAYER_BODY_SIZE[1] / 2, 0];
export const PLAYER_SPEED = 4;
/** Full gravity, so the character stays planted and falls off ledges. No jump yet. */
export const PLAYER_GRAVITY_SCALE = 1;

/* --------------------------- character controller --------------------------- */

export const CONTROLLER_OFFSET = 0.02;
export const AUTOSTEP_MAX_HEIGHT = TILE_TOP_HIGH + 0.1;
export const AUTOSTEP_MIN_WIDTH = 0.1;
export const SNAP_TO_GROUND_DISTANCE = TILE_TOP_HIGH + 0.1;

/* -------------------------------- frame timing ------------------------------ */

export const MIN_FRAME_DELTA = 1 / 240;
/** Matches the delta clamp inside @react-three/rapier's <Physics> step. */
export const MAX_FRAME_DELTA = 0.5;

/* ---------------------------------- camera ---------------------------------- */

export const CAMERA_FOV = 50;
export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR = 200;
export const CAMERA_START_POSITION: [number, number, number] = [14, 17, 14];
/**
 * High and pulled back, like the reference's hero shot: the whole island plus a
 * margin of sea, at roughly 43 degrees rather than a low over-the-shoulder view.
 */
export const CAMERA_OFFSET: [number, number, number] = [12.5, 16, 12.5];
export const CAMERA_LOOK_AT_HEIGHT = 1;
export const CAMERA_LERP_SMOOTHING = 6;

export const CAMERA_OFFSET_VECTOR = new Vector3(...CAMERA_OFFSET);
export const CAMERA_FORWARD = new Vector3(-CAMERA_OFFSET[0], 0, -CAMERA_OFFSET[2]).normalize();
export const CAMERA_RIGHT = new Vector3().crossVectors(CAMERA_FORWARD, new Vector3(0, 1, 0));

/* ---------------------------------- lighting -------------------------------- */

export const AMBIENT_LIGHT_INTENSITY = 0.15;
export const SUN_POSITION: [number, number, number] = [8, 14, 6];
export const SUN_LIGHT_INTENSITY = 2.2;
export const SHADOW_MAP_SIZE = 2048;
export const SHADOW_CAMERA_EXTENT = 20;
export const SHADOW_CAMERA_NEAR = 0.5;
export const SHADOW_CAMERA_FAR = 40;
export const SHADOW_BIAS = -0.0004;
/** Pushes shadow samples off the surface, which keeps box edges free of acne. */
export const SHADOW_NORMAL_BIAS = 0.02;

/* ---------------------------------- palette --------------------------------- */

export const SKY_COLOR = '#8ec9e8';
export const GRASS_COLOR = '#5fa63f';
export const SAND_COLOR = '#e3c896';
export const DIRT_COLOR = '#7b5334';
export const PLAYER_BODY_COLOR = '#3d6fbe';
export const PLAYER_HEAD_COLOR = '#f0c9a2';

export const WOOD_COLOR = '#a9713f';
export const WOOD_DARK_COLOR = '#6b4325';
export const MONITOR_COLOR = '#3f4a5a';
export const SCREEN_COLOR = '#7ef2c8';
export const KEYBOARD_COLOR = '#2b3442';
export const FLAME_COLOR = '#ffb648';
export const EMBER_COLOR = '#ff7a1a';
export const SMOKE_COLOR = '#c9d4de';
export const METAL_COLOR = '#5a6b7d';
export const LENS_COLOR = '#a9dcff';
export const SIGN_BOARD_COLOR = '#d9a066';
export const SIGN_TEXT_COLOR = '#2b1c0e';

/* --------------------------------- targets --------------------------------- */

export const INTERACTION_DISTANCE = 2;

export type TargetId = 'computer' | 'campfire' | 'telescope' | 'services';

export interface TargetDefinition {
  id: TargetId;
  label: string;
  position: [number, number, number];
  /** Height of the floating prompt above the target's base. */
  indicatorHeight: number;
}

/** Top surface of the island at a given point, following the raised plateau. */
export const groundHeightAt = (x: number, z: number): number =>
  Math.hypot(x - PLATEAU_CENTER[0], z - PLATEAU_CENTER[1]) <= PLATEAU_RADIUS
    ? TILE_TOP_HIGH
    : TILE_TOP_LOW;

/** Spread around the wider island, all on low ground and clear of the dock (+z). */
export const TARGET_COMPUTER_POSITION: [number, number, number] = [
  -6,
  groundHeightAt(-6, 0),
  0,
];
export const TARGET_CAMPFIRE_POSITION: [number, number, number] = [6, groundHeightAt(6, 0), 0];
export const TARGET_TELESCOPE_POSITION: [number, number, number] = [
  0,
  groundHeightAt(0, -6),
  -6,
];
export const TARGET_SERVICES_POSITION: [number, number, number] = [
  -4.4,
  groundHeightAt(-4.4, 4.4),
  4.4,
];

export const TARGETS: readonly TargetDefinition[] = [
  {
    id: 'computer',
    label: 'Computer',
    position: TARGET_COMPUTER_POSITION,
    // Heights track the top of each imported model plus a little clearance.
    indicatorHeight: 1.45,
  },
  { id: 'campfire', label: 'Campfire', position: TARGET_CAMPFIRE_POSITION, indicatorHeight: 0.8 },
  {
    id: 'telescope',
    label: 'Telescope',
    position: TARGET_TELESCOPE_POSITION,
    indicatorHeight: 2.2,
  },
  { id: 'services', label: 'Services', position: TARGET_SERVICES_POSITION, indicatorHeight: 2.1 },
];

/* -------------------------- floating interaction cue ----------------------- */

export const TARGET_INDICATOR_BOB_HEIGHT = 0.09;
export const TARGET_INDICATOR_BOB_SPEED = 2.2;
export const TARGET_INDICATOR_FONT_SIZE = 0.16;
export const TARGET_INDICATOR_LABEL_SIZE = 0.11;
export const TARGET_INDICATOR_WIDTH = 1.25;
export const TARGET_INDICATOR_HEIGHT = 0.5;

/* --------------------------------- computer -------------------------------- */

export const COMPUTER_DESK_HEIGHT = 0.62;
export const COMPUTER_DESK_TOP_SIZE: [number, number, number] = [1.4, 0.1, 0.8];
export const COMPUTER_DESK_SURFACE_Y = COMPUTER_DESK_HEIGHT + COMPUTER_DESK_TOP_SIZE[1] / 2;
export const COMPUTER_LEG_HEIGHT = COMPUTER_DESK_HEIGHT - COMPUTER_DESK_TOP_SIZE[1] / 2;
export const COMPUTER_LEG_SIZE: [number, number, number] = [0.09, COMPUTER_LEG_HEIGHT, 0.09];
export const COMPUTER_LEG_INSET = 0.12;
export const COMPUTER_MONITOR_SIZE: [number, number, number] = [0.72, 0.46, 0.08];
export const COMPUTER_MONITOR_Y = COMPUTER_DESK_SURFACE_Y + COMPUTER_MONITOR_SIZE[1] / 2 + 0.04;
export const COMPUTER_MONITOR_Z = -0.14;
export const COMPUTER_SCREEN_SIZE: [number, number, number] = [0.58, 0.34, 0.03];
export const COMPUTER_KEYBOARD_SIZE: [number, number, number] = [0.52, 0.05, 0.18];
export const COMPUTER_KEYBOARD_Z = 0.2;
export const COMPUTER_COLLIDER_HALF: [number, number, number] = [0.75, 0.55, 0.45];
export const COMPUTER_COLLIDER_CENTER_Y = 0.55;

/* --------------------------------- campfire -------------------------------- */

export const CAMPFIRE_LOG_COUNT = 8;
export const CAMPFIRE_LOG_RING_RADIUS = 0.52;
export const CAMPFIRE_LOG_LENGTH = 0.46;
export const CAMPFIRE_LOG_RADIUS = 0.09;
export const CAMPFIRE_LOG_Y = CAMPFIRE_LOG_RADIUS;
export const CAMPFIRE_FLAME_SIZE: [number, number, number] = [0.26, 0.42, 0.26];
export const CAMPFIRE_FLAME_Y = 0.28;
export const CAMPFIRE_LIGHT_Y = 0.55;
export const CAMPFIRE_LIGHT_INTENSITY = 9;
export const CAMPFIRE_LIGHT_DISTANCE = 4.5;
export const CAMPFIRE_GLOW_COLOR = '#ff9440';
/** Flicker of the flame, as a fraction of the light's base intensity. */
export const CAMPFIRE_FLICKER_DEPTH = 0.14;
export const CAMPFIRE_FLICKER_SPEED = 7;
export const CAMPFIRE_SMOKE_COUNT = 5;
export const CAMPFIRE_SMOKE_SIZE: [number, number, number] = [0.28, 0.28, 0.28];
export const CAMPFIRE_SMOKE_DRIFT = 0.12;
export const CAMPFIRE_SMOKE_GROWTH = 1.6;
export const CAMPFIRE_SMOKE_RADIUS = 0.11;
export const CAMPFIRE_SMOKE_START_Y = 0.6;
export const CAMPFIRE_SMOKE_RISE = 1.4;
export const CAMPFIRE_SMOKE_SPEED = 0.32;
export const CAMPFIRE_SMOKE_OPACITY = 0.34;
/** Tall enough that autostep cannot climb it, so nobody stands on the fire. */
export const CAMPFIRE_COLLIDER_HALF: [number, number, number] = [0.72, 0.6, 0.72];
export const CAMPFIRE_COLLIDER_CENTER_Y = 0.6;

/* -------------------------------- telescope -------------------------------- */

export const TELESCOPE_LEG_COUNT = 3;
export const TELESCOPE_LEG_LENGTH = 1.15;
export const TELESCOPE_LEG_RADIUS = 0.035;
/** Lean of each leg away from vertical, in radians. */
export const TELESCOPE_LEG_TILT = 0.3;
export const TELESCOPE_LEG_SPREAD = Math.sin(TELESCOPE_LEG_TILT) * TELESCOPE_LEG_LENGTH;
export const TELESCOPE_HUB_SIZE = 0.18;
export const TELESCOPE_HUB_Y = Math.cos(TELESCOPE_LEG_TILT) * TELESCOPE_LEG_LENGTH;
export const TELESCOPE_TUBE_LENGTH = 1;
export const TELESCOPE_TUBE_RADIUS = 0.14;
export const TELESCOPE_TUBE_TILT = 1.05;
export const TELESCOPE_TUBE_Y = 1.05;
export const TELESCOPE_LENS_RADIUS = 0.13;
export const TELESCOPE_LENS_THICKNESS = 0.04;
export const TELESCOPE_COLLIDER_HALF: [number, number, number] = [0.4, 0.65, 0.4];
export const TELESCOPE_COLLIDER_CENTER_Y = 0.65;

/* -------------------------------- signpost --------------------------------- */

export const SIGN_POST_SIZE: [number, number, number] = [0.15, 1, 0.15];
export const SIGN_BOARD_SIZE: [number, number, number] = [1.05, 0.42, 0.09];
export const SIGN_BOARD_Y = 1.05;
export const SIGN_TEXT_SIZE = 0.2;
export const SIGN_COLLIDER_HALF: [number, number, number] = [0.55, 0.62, 0.12];
export const SIGN_COLLIDER_CENTER_Y = 0.62;

/* -------------------------------- sky & fog -------------------------------- */

export const SKY_TOP_COLOR = '#4f93c4';
export const SKY_HORIZON_COLOR = SKY_COLOR;
export const SKY_DOME_RADIUS = 150;
export const SKY_DOME_EXPONENT = 0.9;
export const FOG_NEAR = 34;
export const FOG_FAR = 80;

/* --------------------------------- lighting -------------------------------- */

export const HEMISPHERE_SKY_COLOR = SKY_COLOR;
export const HEMISPHERE_GROUND_COLOR = GRASS_COLOR;
export const HEMISPHERE_LIGHT_INTENSITY = 0.35;

/** Image-based lighting from the drei city preset; the lights above already fill. */
export const ENVIRONMENT_INTENSITY = 0.55;

/* ---------------------------------- ocean ---------------------------------- */

export const OCEAN_SIZE = 100;
export const OCEAN_Y = -0.5;
/** Glossy enough to catch the sun and pick up the sky from the HDR probe. */
export const OCEAN_ROUGHNESS = 0.07;
export const OCEAN_METALNESS = 0.55;

/* -------------------------------- shallows --------------------------------- */

/**
 * Turquoise shelf between the beach and the drop-off, drawn as a flat ring a
 * few centimetres above the open sea so it never z-fights with it.
 */
export const SHALLOW_WATER_Y = -0.45;
export const SHALLOW_WATER_INNER_RADIUS = ISLAND_RADIUS - 0.8;
/** Two bands, so the turquoise steps down into the deep water instead of ending flat. */
export const SHALLOW_WATER_MID_RADIUS = 10.7;
export const SHALLOW_WATER_OUTER_RADIUS = 13;
export const SHALLOW_WATER_COLOR = '#49d8d0';
export const SHALLOW_WATER_DEEP_COLOR = '#1f9fbd';
export const SHALLOW_WATER_ROUGHNESS = 0.45;
export const SHALLOW_WATER_METALNESS = 0.1;

/* ---------------------------------- foam ----------------------------------- */

/** A ring of flat white slabs that washes in and out against the sand. */
export const FOAM_RADIUS = 9.25;
export const FOAM_Y = -0.4;
export const FOAM_SEGMENTS = 72;
/** x is radial (the lapping direction), z is tangential (along the shore). */
export const FOAM_SEGMENT_SIZE: [number, number, number] = [0.26, 0.02, 0.62];
export const FOAM_COLOR = '#f7feff';
export const FOAM_OPACITY = 0.55;
export const FOAM_PULSE_SPEED = 1.1;
export const FOAM_PULSE_DEPTH = 0.12;
export const FOAM_WASH_SPEED = 1.7;
export const FOAM_RADIUS_JITTER = 0.22;

/* -------------------------------- shoreline --------------------------------- */

/**
 * Two dock modules laid end to end: the first rests on the beach, the second
 * carries the jetty out over the shallows. The bases sit under the waterline so
 * the deck lands 0.56 above the sand, which the character's autostep (0.6) can
 * climb — the deck is the only way past the water's edge.
 */
export const DOCK_SIZE: [number, number, number] = [2.5, 1.31, 2.51];
export const DOCK_SCALE = 1;
export const DOCK_BASE_Y = -0.75;
export const DOCK_START_Z = 7.5;
export const DOCK_MODULE_SPACING = 2.3;
export const DOCK_POSITIONS: readonly [number, number, number][] = [
  [0, DOCK_BASE_Y, DOCK_START_Z],
  [0, DOCK_BASE_Y, DOCK_START_Z + DOCK_MODULE_SPACING],
];
export const DOCK_DECK_TOP = DOCK_BASE_Y + DOCK_SIZE[1] * DOCK_SCALE;
/** Centre of the far module, i.e. the seaward tip of the jetty. */
export const DOCK_END_Z = DOCK_START_Z + DOCK_MODULE_SPACING + DOCK_SIZE[2] / 2;

/** Invisible rails on the water stretch, so nobody steps off the deck. */
export const DOCK_RAIL_HEIGHT = 1.2;
export const DOCK_RAIL_THICKNESS = 0.1;
const DOCK_RAIL_HALF_LENGTH = (DOCK_END_Z - ISLAND_RADIUS) / 2;
const DOCK_SIDE_X = DOCK_SIZE[0] / 2 + DOCK_RAIL_THICKNESS / 2;
export const DOCK_RAILS: readonly {
  args: [number, number, number];
  position: [number, number, number];
}[] = [
  {
    args: [DOCK_SIZE[0] / 2 + DOCK_RAIL_THICKNESS, DOCK_RAIL_HEIGHT / 2, DOCK_RAIL_THICKNESS],
    position: [0, DOCK_DECK_TOP + DOCK_RAIL_HEIGHT / 2, DOCK_END_Z - DOCK_RAIL_THICKNESS],
  },
  {
    args: [DOCK_RAIL_THICKNESS, DOCK_RAIL_HEIGHT / 2, DOCK_RAIL_HALF_LENGTH],
    position: [-DOCK_SIDE_X, DOCK_DECK_TOP + DOCK_RAIL_HEIGHT / 2, ISLAND_RADIUS + DOCK_RAIL_HALF_LENGTH],
  },
  {
    args: [DOCK_RAIL_THICKNESS, DOCK_RAIL_HEIGHT / 2, DOCK_RAIL_HALF_LENGTH],
    position: [DOCK_SIDE_X, DOCK_DECK_TOP + DOCK_RAIL_HEIGHT / 2, ISLAND_RADIUS + DOCK_RAIL_HALF_LENGTH],
  },
];

/**
 * Moored in the open water alongside the jetty, bow to the sea and parallel to
 * the deck, the way the reference lines the rowboat up beside the pier.
 */
export const BOAT_POSITION: [number, number, number] = [3.15, -0.66, 10.1];
export const BOAT_SCALE = 0.85;
export const BOAT_ROTATION = 0.05;
/** Waterline boulders: their bases sit just under the surface. */
export const WATER_ROCK_Y = -0.55;
/** Deep enough to stay blue under a 0.55-metal reflection of the HDR sky. */
export const OCEAN_COLOR = '#1d7ab0';
export const OCEAN_BOB_HEIGHT = 0.03;
export const OCEAN_BOB_SPEED = 0.6;

/* --------------------------------- clouds ---------------------------------- */

/**
 * The follow camera looks down at roughly 40 degrees, so the only sky it can
 * see is the band just past the island's far shore. The clouds drift there:
 * low enough to enter the frame, high enough to clear the trees.
 */
export const CLOUD_Y = 8.6;
export const CLOUD_COLOR = '#f9fcff';
export const CLOUD_SPEED = 0.35;
export const CLOUD_WRAP_RADIUS = 22;
/** Wide and flat, so they read as hazy streaks near the horizon, not boxes. */
export const CLOUD_SIZE: [number, number, number] = [8, 0.45, 3.6];
export const CLOUDS: readonly { position: [number, number, number]; scale: number }[] = [
  { position: [-16, CLOUD_Y, -13.5], scale: 1.1 },
  { position: [-5, CLOUD_Y + 0.5, -14.8], scale: 0.9 },
  { position: [5, CLOUD_Y - 0.3, -14.2], scale: 1.2 },
  { position: [16, CLOUD_Y + 0.2, -13.8], scale: 0.95 },
];

/* ---------------------------------- models ---------------------------------- */

/**
 * Kenney's kit is modelled around one unit per metre, with every origin at the
 * base of the object — so the position is the ground height, and the scale is a
 * plain size correction: a 1.23 m barrel needs 0.7 to read as a 0.9 m barrel.
 */
export const MODEL_URLS = {
  workbench: '/models/workbench.glb',
  campfirePit: '/models/campfire-pit.glb',
  tent: '/models/tent.glb',
  tentCanvas: '/models/tent-canvas.glb',
  signpost: '/models/signpost.glb',
  tree: '/models/tree.glb',
  treeTall: '/models/tree-tall.glb',
  treeHigh: '/models/tree-high.glb',
  grassLarge: '/models/grass-large.glb',
  plant: '/models/plant.glb',
  palmBend: '/models/palm-bend.glb',
  palmStraight: '/models/palm-straight.glb',
  rock: '/models/rock-a.glb',
  rockCluster: '/models/rocks-a.glb',
  rockSmall: '/models/rock-b.glb',
  barrel: '/models/barrel.glb',
  crate: '/models/crate.glb',
  dock: '/models/structure-platform-dock.glb',
  boat: '/models/boat-row-large.glb',
} as const;

export interface ModelPlacement {
  url: string;
  position: [number, number, number];
  /** Uniform multiplier applied to the imported model. */
  scale: number;
  /** Yaw in radians; every model stands upright on its own base. */
  rotation: number;
  /**
   * Minimum height of the blocking volume. Only for props too flat to stop the
   * character on their own (its autostep clears anything under 0.6 m).
   */
  blockHeight?: number;
  /** Second file drawn in the same transform, for kit props split in two. */
  overlayUrl?: string;
  /** Block with a box the size of the model, so its top can be walked on. */
  platform?: boolean;
}

/** The imported stand-in for each primitive target. */
export const TARGET_MODELS: Record<TargetId, Omit<ModelPlacement, 'position'>> = {
  // A 1.24 x 0.99 m workbench; its working side looks toward the island centre (+x).
  computer: { url: MODEL_URLS.workbench, scale: 4.2, rotation: Math.PI / 2 },
  // The pit is only 0.33 m tall, so it gets a taller invisible block.
  campfire: { url: MODEL_URLS.campfirePit, scale: 4.5, rotation: 0, blockHeight: 0.9 },
  // The kit ships the shelter as a frame plus a separate canvas; drawn together
  // they read as one 2.4 x 2.1 m tent, opening facing the camp (+z).
  telescope: {
    url: MODEL_URLS.tent,
    overlayUrl: MODEL_URLS.tentCanvas,
    scale: 4.2,
    rotation: 0,
  },
  // The signpost's board faces the approach from the middle of the island (-z).
  services: { url: MODEL_URLS.signpost, scale: 4, rotation: Math.PI / 2 },
};

/* ------------------------------- decorations -------------------------------- */

/**
 * Nine pines and five palms, crowded toward the rim the way the reference
 * packs its coastline: the centre (radius < 4) stays open for the four targets
 * at radius 6, and every trunk is kept at least a canopy away from a target or
 * the jetty approach.
 */
export const DECORATION_TREES: readonly ModelPlacement[] = [
  {
    // tree-high is the kit's snow-capped pine, so the tall pines are tree-tall.
    url: MODEL_URLS.treeTall,
    position: [-6.2, groundHeightAt(-6.2, -3.0), -3.0],
    scale: 2.3,
    rotation: 0.4,
  },
  {
    url: MODEL_URLS.treeTall,
    position: [-2.4, groundHeightAt(-2.4, -5.6), -5.6],
    scale: 2.1,
    rotation: 1.9,
  },
  {
    url: MODEL_URLS.treeTall,
    position: [3.2, groundHeightAt(3.2, -5.6), -5.6],
    scale: 2.1,
    rotation: 3.1,
  },
  {
    url: MODEL_URLS.treeTall,
    position: [6.4, groundHeightAt(6.4, -2.6), -2.6],
    scale: 2.2,
    rotation: 5.2,
  },
  {
    // Kept off the camp: a pine this tall in front of the fire would hide both
    // the pit and its "Press E" cue from the follow camera.
    url: MODEL_URLS.treeTall,
    position: [4.6, groundHeightAt(4.6, 4.4), 4.4],
    scale: 2.05,
    rotation: 4.4,
  },
  {
    url: MODEL_URLS.treeTall,
    position: [-5.6, groundHeightAt(-5.6, 2.6), 2.6],
    scale: 2,
    rotation: 2.6,
  },
  {
    url: MODEL_URLS.treeTall,
    position: [-4.4, groundHeightAt(-4.4, -4.6), -4.6],
    scale: 2,
    rotation: 3.6,
  },
  {
    url: MODEL_URLS.treeTall,
    position: [5.6, groundHeightAt(5.6, -5.4), -5.4],
    scale: 2.15,
    rotation: 0.9,
  },
  {
    url: MODEL_URLS.treeTall,
    position: [2.6, groundHeightAt(2.6, 5.8), 5.8],
    scale: 1.95,
    rotation: 5.8,
  },
  {
    // Palms stand on the beach line, off the camera's shoulder so they never
    // sit between it and the character.
    url: MODEL_URLS.palmBend,
    position: [-5.0, groundHeightAt(-5.0, 7.2), 7.2],
    scale: 0.75,
    rotation: 2.2,
  },
  {
    url: MODEL_URLS.palmStraight,
    position: [6.6, groundHeightAt(6.6, 5.4), 5.4],
    scale: 0.7,
    rotation: 0.8,
  },
  {
    url: MODEL_URLS.palmBend,
    position: [-6.0, groundHeightAt(-6.0, -6.0), -6.0],
    scale: 0.8,
    rotation: 3.9,
  },
  {
    // The pair either side of the jetty: their fronds lean out over the deck
    // and the shallows, which is what sells the reference's coastline.
    url: MODEL_URLS.palmBend,
    position: [3.9, groundHeightAt(3.9, 7.9), 7.9],
    scale: 0.72,
    rotation: 1.4,
  },
  {
    url: MODEL_URLS.palmStraight,
    position: [2.4, groundHeightAt(2.4, 8.3), 8.3],
    scale: 0.66,
    rotation: 4.9,
  },
];

/**
 * Tufts of grass and one broadleaf plant tucked against the targets and the
 * jetty. They are pure decoration: no collider, so nobody trips on them.
 */
export const DECORATION_GRASS: readonly ModelPlacement[] = [
  {
    url: MODEL_URLS.grassLarge,
    position: [-4.6, groundHeightAt(-4.6, 1.2), 1.2],
    scale: 1.8,
    rotation: 0.9,
  },
  {
    url: MODEL_URLS.grassLarge,
    position: [1.2, groundHeightAt(1.2, 6.4), 6.4],
    scale: 1.6,
    rotation: 2.4,
  },
  {
    url: MODEL_URLS.grassLarge,
    position: [-3.4, groundHeightAt(-3.4, 3.4), 3.4],
    scale: 1.9,
    rotation: 4.7,
  },
  {
    url: MODEL_URLS.plant,
    position: [1.4, groundHeightAt(1.4, -4.6), -4.6],
    scale: 2.2,
    rotation: 1.5,
  },
  {
    url: MODEL_URLS.grassLarge,
    position: [-2.0, groundHeightAt(-2.0, 6.9), 6.9],
    scale: 1.7,
    rotation: 3.2,
  },
  {
    url: MODEL_URLS.grassLarge,
    position: [3.8, groundHeightAt(3.8, 6.6), 6.6],
    scale: 1.5,
    rotation: 0.6,
  },
  {
    url: MODEL_URLS.grassLarge,
    position: [-5.4, groundHeightAt(-5.4, -1.6), -1.6],
    scale: 1.7,
    rotation: 2.1,
  },
  {
    url: MODEL_URLS.grassLarge,
    position: [5.2, groundHeightAt(5.2, -1.2), -1.2],
    scale: 1.6,
    rotation: 5.1,
  },
  {
    url: MODEL_URLS.plant,
    position: [0.9, groundHeightAt(0.9, -5.0), -5.0],
    scale: 2,
    rotation: 2.8,
  },
];

/**
 * Shoreline rocks. The last five sit at the waterline and beyond it — their
 * bases are dropped below the surface so they read as boulders in the shallows,
 * breaking up the perfect circle of the beach.
 */
export const DECORATION_ROCKS: readonly ModelPlacement[] = [
  {
    url: MODEL_URLS.rockCluster,
    position: [-7.4, groundHeightAt(-7.4, 4.4), 4.4],
    scale: 0.7,
    rotation: 0.7,
  },
  {
    url: MODEL_URLS.rock,
    position: [7.8, groundHeightAt(7.8, -4.8), -4.8],
    scale: 1.5,
    rotation: 2.3,
  },
  {
    url: MODEL_URLS.rock,
    position: [-8.0, groundHeightAt(-8.0, -1.6), -1.6],
    scale: 1.2,
    rotation: 4.1,
  },
  {
    url: MODEL_URLS.rockSmall,
    position: [6.4, groundHeightAt(6.4, 7.0), 7.0],
    scale: 1.6,
    rotation: 5.1,
  },
  {
    url: MODEL_URLS.rock,
    position: [0.4, groundHeightAt(0.4, -8.2), -8.2],
    scale: 1.2,
    rotation: 1.3,
  },
  {
    url: MODEL_URLS.rockCluster,
    position: [-3.4, groundHeightAt(-3.4, 8.0), 8.0],
    scale: 0.45,
    rotation: 3.4,
  },
  {
    url: MODEL_URLS.rock,
    position: [-8.6, groundHeightAt(-8.6, 2.0), 2.0],
    scale: 1.6,
    rotation: 2.2,
  },
  {
    url: MODEL_URLS.rock,
    position: [-2.6, WATER_ROCK_Y, 11.4],
    scale: 2.4,
    rotation: 0.7,
  },
  {
    url: MODEL_URLS.rock,
    position: [9.7, WATER_ROCK_Y, 3.4],
    scale: 2.2,
    rotation: 1.9,
  },
  {
    url: MODEL_URLS.rockSmall,
    position: [-9.6, WATER_ROCK_Y, -3.8],
    scale: 2,
    rotation: 4.2,
  },
  {
    url: MODEL_URLS.rockSmall,
    position: [7.6, WATER_ROCK_Y, 8.6],
    scale: 1.8,
    rotation: 5.5,
  },
];

/** A barrel and two crates, so the workbench reads as a lived-in workspace. */
export const DECORATION_BARREL: ModelPlacement = {
  url: MODEL_URLS.barrel,
  position: [-6.9, groundHeightAt(-6.9, 1.9), 1.9],
  scale: 3.2,
  rotation: 0.6,
};

export const DECORATION_CRATES: readonly ModelPlacement[] = [
  {
    // crate.glb is already over a metre across, so it takes a scale well under
    // 1 to read as a crate beside the bench rather than a second bench.
    url: MODEL_URLS.crate,
    position: [-7.2, groundHeightAt(-7.2, -1.0), -1.0],
    scale: 0.8,
    rotation: 0.35,
  },
  {
    url: MODEL_URLS.crate,
    position: [-7.1, groundHeightAt(-7.1, 0.5), 0.5],
    scale: 0.68,
    rotation: 1.15,
  },
];

/** The jetty over the water, and the rowing boat tied beside it. */
export const DECORATION_DOCKS: readonly ModelPlacement[] = DOCK_POSITIONS.map((position) => ({
  url: MODEL_URLS.dock,
  position,
  scale: DOCK_SCALE,
  rotation: 0,
  platform: true,
}));

export const DECORATION_BOAT: ModelPlacement = {
  url: MODEL_URLS.boat,
  position: BOAT_POSITION,
  scale: BOAT_SCALE,
  rotation: BOAT_ROTATION,
};
