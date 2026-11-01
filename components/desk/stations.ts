import * as THREE from "three";

export type StationId = "home" | "projects" | "experience" | "about" | "contact";

export const STATION_ORDER: readonly Exclude<StationId, "home">[] = [
  "projects",
  "experience",
  "about",
  "contact",
];

/**
 * A surface in the room that holds one section's HTML. The camera frames it
 * by looking at `center` along `normal`, from far enough to fit `size` in the
 * viewport, so the same data works for any aspect ratio.
 */
export type Surface = {
  center: THREE.Vector3;
  /** Direction the surface faces (unit vector, towards the viewer). */
  normal: THREE.Vector3;
  /** Width and height in meters. */
  size: [number, number];
  /** Rotation applied to the HTML so it lies on the surface. */
  rotation: THREE.Euler;
  /** Design size of the HTML in CSS pixels. */
  px: [number, number];
  /** Breathing room around the surface when framed (1 = edge to edge). */
  margin: number;
};

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/**
 * The room is split in three heights: tatami at floor level (front), a wooden
 * deck with the desk along the back wall, and a higher platform in the
 * back-right corner. Objects sit on top of these, so the levels are shared.
 */
export const LEVELS = { tatami: 0, deck: 0.42, loft: 0.84 } as const;

/** Where the desk sits on the deck: free-standing, Enzo works behind it facing the room. */
export const DESK = { x: -0.9, z: -1.4 } as const;

/** Low table on the tatami that holds the phone. */
export const CHABUDAI = { x: 0.25, z: 0.95, top: 0.46 } as const;

/** Yaw of the phone on the table; the camera matches it so the screen reads upright. */
export const PHONE_YAW = -0.35;

export const SURFACES: Record<Exclude<StationId, "home">, Surface> = {
  // Wall-mounted screen on the back wall, above Enzo's head.
  projects: {
    center: v(DESK.x, 2.25, -2.375),
    normal: v(0, 0, 1),
    size: [0.84, 0.48],
    rotation: new THREE.Euler(0, 0, 0),
    px: [1120, 640],
    margin: 1.15,
  },
  experience: {
    center: v(1.7, LEVELS.loft + 0.95, -2.463),
    normal: v(0, 0, 1),
    size: [1.2, 0.72],
    rotation: new THREE.Euler(0, 0, 0),
    px: [1000, 600],
    margin: 1.22,
  },
  // Hanging scroll (kakejiku) in the alcove of the left wall: portrait.
  about: {
    center: v(-2.465, 1.42, 0.9),
    normal: v(1, 0, 0),
    size: [0.52, 0.92],
    rotation: new THREE.Euler(0, Math.PI / 2, 0),
    px: [520, 920],
    margin: 1.3,
  },
  // Phone lying on the low table: the surface itself is flat (rotation), the
  // camera looks at it from above and a little in front so `up` stays valid.
  contact: {
    center: v(CHABUDAI.x, CHABUDAI.top + 0.0085, CHABUDAI.z),
    normal: v(0.3 * Math.sin(PHONE_YAW), 1, 0.3 * Math.cos(PHONE_YAW)).normalize(),
    size: [0.068, 0.142],
    rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
    px: [340, 710],
    margin: 1.45,
  },
};

export const HOME = {
  position: v(4.7, 3.4, 4.9),
  target: v(-0.25, 0.8, -0.45),
};

/**
 * Camera pose that frames a surface: on its normal (slightly raised for
 * walls, slightly tilted for the phone so it doesn't look perfectly flat),
 * at the distance that fits it with a margin.
 */
export function framePose(surface: Surface, fovDeg: number, aspect: number) {
  const { margin } = surface;
  const [w, h] = surface.size;
  const vfov = THREE.MathUtils.degToRad(fovDeg);
  const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect);
  const distH = (h * margin) / 2 / Math.tan(vfov / 2);
  const distW = (w * margin) / 2 / Math.tan(hfov / 2);
  const dist = Math.max(distH, distW);
  const position = surface.center.clone().addScaledVector(surface.normal, dist);
  return { position, target: surface.center.clone() };
}

/** Pixels per meter → drei <Html transform> distanceFactor. */
export function distanceFactorFor(surface: Surface) {
  return (surface.size[0] * 400) / surface.px[0];
}

export function isStation(value: string): value is Exclude<StationId, "home"> {
  return (STATION_ORDER as readonly string[]).includes(value);
}
