"use client";
import React from "react";
import * as THREE from "three";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Html, RoundedBox, Sparkles, useGLTF } from "@react-three/drei";
import gsap from "gsap";
import { easing } from "maath";
import type { Language } from "@/lib/projects";
import { CHABUDAI, DESK, LEVELS, PHONE_YAW, SURFACES, distanceFactorFor, type StationId } from "./stations";
import { BoardScreen, MonitorScreen, PhoneScreen, PosterScreen } from "./screens";
import { toonUniforms, toonifyTree } from "./toon";

/* Kenney Furniture Kit (CC0), converted to GLB in meters, centered on X/Z. */
const MODELS = [
  "desk",
  "chairDesk",
  "bookcaseOpenLow",
  "books",
  "lampSquareTable",
  "plantSmall1",
  "plantSmall2",
  "plantSmall3",
  "pottedPlant",
  "tableCoffeeSquare",
  "benchCushionLow",
  "speakerSmall",
  "radio",
] as const;
type ModelName = (typeof MODELS)[number];
const modelUrl = (name: ModelName) => `/desk/models/${name}.glb`;
MODELS.forEach((name) => useGLTF.preload(modelUrl(name)));

/**
 * Diorama palette (refs: isometric Japanese rooms): washi cream walls, honey
 * hinoki for structure, one darker wood for trims, pale straw tatami with
 * dark green borders and a single rose accent for fabrics.
 */
const PALETTE = {
  plaster: "#efe5d2",
  plasterDark: "#d9c8aa",
  wood: "#9a6a41",
  woodLight: "#c99a68",
  woodDark: "#4e3424",
  paper: "#fbf4e4",
  tatami: "#d2c58c",
  tatamiEdge: "#2f4136",
  rose: "#b5566f",
  roseDark: "#7d3348",
  ink: "#1a1420",
  pink: "#f0a6ca",
  lavender: "#b5a6d3",
  warm: "#ffb37a",
  moon: "#cfd8ff",
};

/* ------------------------------------------------------------------ */
/* Mood: 0 = night (lavender, lanterns on), 1 = day (warm sunlight)    */
/* ------------------------------------------------------------------ */

export type Mood = "night" | "day";

const MoodCtx = React.createContext<React.MutableRefObject<number>>({ current: 0 });
const useMood = () => React.useContext(MoodCtx);

/** Lerp helper for colors: writes a + (b - a) * t into `out`. */
const tmpA = new THREE.Color();
const tmpB = new THREE.Color();
function mixColor(out: THREE.Color, a: string, b: string, t: number) {
  out.copy(tmpA.set(a)).lerp(tmpB.set(b), t);
}

/** Reduced motion, read at call time (event handlers outside React state). */
const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The shadow map is static; things that move for a while ask for refreshes. */
let shadowDirtyUntil = 0;
function markShadowsDirty(seconds: number) {
  shadowDirtyUntil = Math.max(shadowDirtyUntil, performance.now() + seconds * 1000);
}

/** Kenney material names → room palette (fabrics in the rose accent, honey wood). */
const RECOLOR: Record<string, string> = {
  carpet: PALETTE.rose,
  carpetDarker: PALETTE.roseDark,
  carpetWhite: "#f3ece0",
  wood: "#b5845a",
  woodDark: PALETTE.wood,
};

function Model({
  name,
  castShadow = true,
  wind = 0,
  ...props
}: { name: ModelName; castShadow?: boolean; /** Plant sway height (0 = none). */ wind?: number } & React.JSX.IntrinsicElements["group"]) {
  const { scene } = useGLTF(modelUrl(name));
  const clone = React.useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = castShadow;
      mesh.receiveShadow = true;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (RECOLOR[mat.name]) {
        mesh.material = mat.clone();
        (mesh.material as THREE.MeshStandardMaterial).color.set(RECOLOR[mat.name]);
      }
    });
    if (wind > 0) c.userData.toon = { wind };
    return c;
  }, [scene, castShadow, wind]);
  return <primitive object={clone} {...props} />;
}

/* ------------------------------------------------------------------ */
/* Procedural textures                                                 */
/* ------------------------------------------------------------------ */

/** Small seeded PRNG so procedural details are stable across renders. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function useCanvasTexture(draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void, w: number, h: number, repeat: [number, number]) {
  return React.useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    draw(canvas.getContext("2d")!, w, h);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat[0], repeat[1]);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** One tatami mat (2:1) with the woven straw and the dark cloth border. */
function useTatamiTexture(repeat: [number, number]) {
  return useCanvasTexture(
    (ctx, w, h) => {
      // Smooth straw with a faint weave: reads as tatami without visual noise.
      ctx.fillStyle = PALETTE.tatami;
      ctx.fillRect(0, 0, w, h);
      for (let y = 0; y < h; y += 4) {
        ctx.fillStyle = y % 8 === 0 ? "rgba(90,80,30,0.07)" : "rgba(255,250,220,0.06)";
        ctx.fillRect(0, y, w, 2);
      }
      ctx.fillStyle = PALETTE.tatamiEdge;
      ctx.fillRect(0, 0, 12, h);
      ctx.fillRect(w - 12, 0, 12, h);
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fillRect(4, 0, 2, h);
      ctx.fillRect(w - 6, 0, 2, h);
    },
    256,
    512,
    repeat
  );
}

function usePlankTexture(repeat: [number, number]) {
  return useCanvasTexture(
    (ctx, w, h) => {
      const rows = 8;
      const rh = h / rows;
      for (let r = 0; r < rows; r++) {
        let x = -((r * 97) % 200);
        while (x < w) {
          const pw = 180 + ((r * 31 + x) % 120);
          // Honey planks with a gentle tone shift and hairline seams.
          const shade = ((r * 13 + Math.abs(x)) % 10) - 5;
          ctx.fillStyle = `rgb(${196 + shade}, ${146 + shade}, ${96 + shade})`;
          ctx.fillRect(x, r * rh, pw, rh);
          ctx.fillStyle = "rgba(70,40,15,0.22)";
          ctx.fillRect(x, r * rh, 1, rh);
          x += pw;
        }
        ctx.fillStyle = "rgba(70,40,15,0.25)";
        ctx.fillRect(0, r * rh, w, 1);
      }
    },
    512,
    512,
    repeat
  );
}

/* ------------------------------------------------------------------ */
/* Japanese building blocks                                            */
/* ------------------------------------------------------------------ */

const ROOM = { half: 2.5, height: 3.0, t: 0.1 };
const WINDOW = { z0: -2.1, z1: -0.9, y0: 1.25, y1: 2.3 };

/** Lattice of wooden bars with paper behind: windows, doors and panels. */
function Shoji({
  width,
  height,
  cols = 3,
  rows = 4,
  paper = true,
  glow = 0,
  depth = 0.03,
}: {
  width: number;
  height: number;
  cols?: number;
  rows?: number;
  paper?: boolean;
  glow?: number;
  depth?: number;
}) {
  const bar = 0.025;
  const bars: [number, number, number, number][] = [];
  for (let c = 0; c <= cols; c++) bars.push([-width / 2 + (c * width) / cols, 0, bar, height]);
  for (let r = 0; r <= rows; r++) bars.push([0, -height / 2 + (r * height) / rows, width, bar]);
  return (
    <group>
      {paper && (
        <mesh position={[0, 0, -depth / 2]}>
          <planeGeometry args={[width, height]} />
          <meshStandardMaterial
            color={PALETTE.paper}
            emissive={PALETTE.paper}
            emissiveIntensity={glow}
            roughness={1}
            side={THREE.DoubleSide}
            transparent
            opacity={0.92}
          />
        </mesh>
      )}
      {bars.map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, 0]} castShadow>
          <boxGeometry args={[w, h, depth]} />
          <meshStandardMaterial color={PALETTE.woodDark} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/** Paper lantern (chōchin): warm, slightly breathing glow. */
function Lantern({
  position,
  radius = 0.16,
  height = 0.3,
  reducedMotion,
  light = 1.6,
}: {
  position: [number, number, number];
  radius?: number;
  height?: number;
  reducedMotion: boolean;
  light?: number;
}) {
  const mat = React.useRef<THREE.MeshStandardMaterial>(null);
  const bulb = React.useRef<THREE.PointLight>(null);
  const mood = useMood();
  const seed = position[0] * 3.1 + position[2];
  useFrame(({ clock }) => {
    // Lanterns dim to a soft paper glow by day (they stay lit: late afternoon).
    const on = 1 - mood.current * 0.6;
    // Flicker "on fours": the value changes 4 times a second, like hand-drawn animation.
    const stepped = Math.floor(clock.getElapsedTime() * 4) / 4;
    const flicker = reducedMotion ? 0 : Math.sin(stepped * 2.1 + seed) * 0.08;
    if (mat.current) mat.current.emissiveIntensity = (0.75 + flicker) * on;
    if (bulb.current) bulb.current.intensity = light * on;
  });
  return (
    <group position={position}>
      <mesh castShadow>
        <sphereGeometry args={[radius, 20, 14]} />
        <meshStandardMaterial ref={mat} color="#ffe2b8" emissive="#ffb467" emissiveIntensity={0.75} roughness={1} />
      </mesh>
      {[-height / 2, height / 2].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[radius * 0.45, radius * 0.45, 0.03, 16]} />
          <meshStandardMaterial color={PALETTE.woodDark} />
        </mesh>
      ))}
      <pointLight ref={bulb} intensity={light} distance={3.2} decay={2} color="#ffbf80" />
    </group>
  );
}

/** Floor lantern on a pole, as one piece with its origin at the base. */
function LanternStand({
  position,
  radius,
  height,
  pole,
  base,
  reducedMotion,
}: {
  position: [number, number, number];
  radius: number;
  height: number;
  pole: number;
  base: number;
  reducedMotion: boolean;
}) {
  return (
    <group position={position}>
      <Lantern position={[0, pole + height / 2 + 0.02, 0]} radius={radius} height={height} reducedMotion={reducedMotion} />
      <mesh position={[0, pole / 2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, pole, 6]} />
        <meshStandardMaterial color={PALETTE.woodDark} />
      </mesh>
      <mesh position={[0, 0.015, 0]}>
        <cylinderGeometry args={[base, base, 0.03, 12]} />
        <meshStandardMaterial color={PALETTE.woodDark} />
      </mesh>
    </group>
  );
}

/** Bonsai: a crooked trunk and three foliage pads, in a shallow pot. */
function Bonsai({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale} userData={{ toon: { wind: 0.12 } }}>
      <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.14, 0.11, 0.06, 6]} />
        <meshStandardMaterial color="#3b3a44" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.065, 0]}>
        <cylinderGeometry args={[0.125, 0.125, 0.01, 6]} />
        <meshStandardMaterial color="#5a4a3a" roughness={1} />
      </mesh>
      <mesh position={[0.01, 0.17, 0]} rotation={[0, 0, 0.25]} castShadow>
        <cylinderGeometry args={[0.018, 0.03, 0.22, 6]} />
        <meshStandardMaterial color="#4a3222" roughness={1} />
      </mesh>
      <mesh position={[0.08, 0.3, 0]} rotation={[0, 0, -0.9]} castShadow>
        <cylinderGeometry args={[0.012, 0.02, 0.16, 5]} />
        <meshStandardMaterial color="#4a3222" roughness={1} />
      </mesh>
      {[
        [0.0, 0.33, 0.0, 0.11],
        [0.14, 0.36, 0.02, 0.08],
        [-0.09, 0.26, -0.04, 0.07],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} scale={[1, 0.55, 1]} castShadow>
          <sphereGeometry args={[r, 10, 7]} />
          <meshStandardMaterial color={i === 1 ? "#4f7a46" : "#3f6b3b"} roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

/** Flat floor cushion. */
function Zabuton({ position, rotation = 0, color = PALETTE.rose }: { position: [number, number, number]; rotation?: number; color?: string }) {
  return (
    <RoundedBox args={[0.5, 0.06, 0.5]} radius={0.025} position={[position[0], position[1] + 0.03, position[2]]} rotation={[0, rotation, 0]} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={1} />
    </RoundedBox>
  );
}

/** Tea set on the low table. */
function TeaSet({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.005, 0]} receiveShadow>
        <boxGeometry args={[0.28, 0.01, 0.18]} />
        <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} />
      </mesh>
      <mesh position={[-0.06, 0.05, 0]} castShadow>
        <sphereGeometry args={[0.045, 12, 8]} />
        <meshStandardMaterial color="#2c2a33" roughness={0.6} />
      </mesh>
      <mesh position={[-0.12, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.008, 0.012, 0.06, 6]} />
        <meshStandardMaterial color="#2c2a33" roughness={0.6} />
      </mesh>
      {[0.06, 0.1].map((x, i) => (
        <mesh key={i} position={[x, 0.03, i ? 0.05 : -0.04]} castShadow>
          <cylinderGeometry args={[0.022, 0.018, 0.04, 10]} />
          <meshStandardMaterial color="#e9e0d0" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/** Rolled futon on the loft. */
function Futon({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, 0.25, 0]}>
      <mesh position={[0, 0.16, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.16, 0.16, 0.6, 14]} />
        <meshStandardMaterial color="#f3ece0" roughness={1} />
      </mesh>
      {[-0.18, 0.18].map((x) => (
        <mesh key={x} position={[x, 0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.165, 0.165, 0.03, 14]} />
          <meshStandardMaterial color={PALETTE.rose} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Shell: three floor levels, plaster walls, wood trims, window         */
/* ------------------------------------------------------------------ */

function Shell() {
  const tatami = useTatamiTexture([5 / 0.9, 5 / 1.8]);
  const deckPlanks = usePlankTexture([2.5, 1]);
  const loftPlanks = usePlankTexture([1, 1.2]);
  const H = ROOM.height;
  const back = -ROOM.half - ROOM.t / 2;
  const left = -ROOM.half - ROOM.t / 2;
  const { z0, z1, y0, y1 } = WINDOW;

  const plaster = <meshStandardMaterial color={PALETTE.plaster} roughness={1} />;
  const wood = <meshStandardMaterial color={PALETTE.wood} roughness={0.85} />;

  // Left wall is built around the window opening.
  const leftBox = (z: number, y: number, d: number, h: number, key: string) => (
    <mesh key={key} position={[left, y, z]} receiveShadow>
      <boxGeometry args={[ROOM.t, h, d]} />
      {plaster}
    </mesh>
  );

  return (
    <group>
      {/* Level 0: tatami over the whole footprint */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[ROOM.half * 2, 0.1, ROOM.half * 2]} />
        <meshStandardMaterial map={tatami} roughness={1} />
      </mesh>
      {/* Tatami seams: two mats across, dark cloth between them */}
      {[-1.7, -0.8, 0.1, 1.0, 1.9].map((x) => (
        <mesh key={x} position={[x, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.02, ROOM.half * 2]} />
          <meshBasicMaterial color={PALETTE.tatamiEdge} />
        </mesh>
      ))}

      {/* Level 1: wooden deck along the back wall */}
      <mesh position={[(-ROOM.half + 0.9) / 2, LEVELS.deck / 2, (-ROOM.half - 0.7) / 2]} castShadow receiveShadow>
        <boxGeometry args={[0.9 + ROOM.half, LEVELS.deck, ROOM.half - 0.7]} />
        <meshStandardMaterial map={deckPlanks} roughness={0.8} />
      </mesh>
      <mesh position={[(-ROOM.half + 0.9) / 2, LEVELS.deck - 0.03, -0.7 + 0.03]}>
        <boxGeometry args={[0.9 + ROOM.half, 0.06, 0.06]} />
        <meshStandardMaterial color={PALETTE.woodDark} roughness={0.8} />
      </mesh>
      {/* Step down to the tatami */}
      <mesh position={[-0.3, LEVELS.deck / 4, -0.7 + 0.2]} castShadow receiveShadow>
        <boxGeometry args={[1.0, LEVELS.deck / 2, 0.4]} />
        {wood}
      </mesh>

      {/* Level 2: platform in the back-right corner */}
      <mesh position={[(0.9 + ROOM.half) / 2, LEVELS.loft / 2, (-ROOM.half - 0.5) / 2]} castShadow receiveShadow>
        <boxGeometry args={[ROOM.half - 0.9, LEVELS.loft, ROOM.half - 0.5]} />
        <meshStandardMaterial map={loftPlanks} roughness={0.8} />
      </mesh>
      <mesh position={[0.9 + 0.03, LEVELS.loft - 0.03, (-ROOM.half - 0.5) / 2]}>
        <boxGeometry args={[0.06, 0.06, ROOM.half - 0.5]} />
        <meshStandardMaterial color={PALETTE.woodDark} roughness={0.8} />
      </mesh>
      <mesh position={[(0.9 + ROOM.half) / 2, LEVELS.loft - 0.03, -0.5 + 0.03]}>
        <boxGeometry args={[ROOM.half - 0.9, 0.06, 0.06]} />
        <meshStandardMaterial color={PALETTE.woodDark} roughness={0.8} />
      </mesh>
      {/* Step from the deck up to the platform */}
      <mesh position={[0.9 - 0.2, LEVELS.deck + (LEVELS.loft - LEVELS.deck) / 4, -2.0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, (LEVELS.loft - LEVELS.deck) / 2, 0.8]} />
        {wood}
      </mesh>
      {/* Step from the tatami up to the platform (front face) */}
      <mesh position={[1.7, LEVELS.loft / 4, -0.5 + 0.2]} castShadow receiveShadow>
        <boxGeometry args={[0.8, LEVELS.loft / 2, 0.4]} />
        {wood}
      </mesh>
      {/* Railing on the platform's front edge */}
      {[1.0, 1.75, 2.45].map((x) => (
        <mesh key={x} position={[x, LEVELS.loft + 0.3, -0.5 + 0.03]} castShadow>
          <boxGeometry args={[0.05, 0.6, 0.05]} />
          <meshStandardMaterial color={PALETTE.woodDark} />
        </mesh>
      ))}
      <mesh position={[1.725, LEVELS.loft + 0.6, -0.5 + 0.03]} castShadow>
        <boxGeometry args={[1.55, 0.05, 0.05]} />
        <meshStandardMaterial color={PALETTE.woodDark} />
      </mesh>

      {/* Diorama base: the room floats on a thick slab with a light cut edge */}
      <mesh position={[-ROOM.t / 2, -0.28, -ROOM.t / 2]} receiveShadow>
        <boxGeometry args={[ROOM.half * 2 + ROOM.t, 0.36, ROOM.half * 2 + ROOM.t]} />
        <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} />
      </mesh>
      <mesh position={[-ROOM.t / 2, -0.115, -ROOM.t / 2]}>
        <boxGeometry args={[ROOM.half * 2 + ROOM.t + 0.01, 0.03, ROOM.half * 2 + ROOM.t + 0.01]} />
        <meshStandardMaterial color={PALETTE.woodLight} roughness={0.8} />
      </mesh>
      {/* Wall caps: the cut top of each wall, lighter so the silhouette reads */}
      <mesh position={[0, H + 0.012, back]}>
        <boxGeometry args={[ROOM.half * 2 + ROOM.t * 2, 0.024, ROOM.t + 0.01]} />
        <meshStandardMaterial color={PALETTE.woodLight} roughness={0.8} />
      </mesh>
      <mesh position={[left, H + 0.012, 0]}>
        <boxGeometry args={[ROOM.t + 0.01, 0.024, ROOM.half * 2]} />
        <meshStandardMaterial color={PALETTE.woodLight} roughness={0.8} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, H / 2, back]} receiveShadow>
        <boxGeometry args={[ROOM.half * 2 + ROOM.t * 2, H, ROOM.t]} />
        {plaster}
      </mesh>
      {/* Left wall around the window */}
      {leftBox((-ROOM.half + z0) / 2, H / 2, z0 + ROOM.half, H, "lb")}
      {leftBox((z1 + ROOM.half) / 2, H / 2, ROOM.half - z1, H, "lf")}
      {leftBox((z0 + z1) / 2, y0 / 2, z1 - z0, y0, "lbot")}
      {leftBox((z0 + z1) / 2, (y1 + H) / 2, z1 - z0, H - y1, "ltop")}

      {/* Wood frame: posts, lintel, baseboards */}
      {[
        [-ROOM.half + 0.05, -ROOM.half + 0.05],
        [ROOM.half - 0.05, -ROOM.half + 0.05],
        [-ROOM.half + 0.05, ROOM.half - 0.05],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, H / 2, z]} castShadow>
          <boxGeometry args={[0.1, H, 0.1]} />
          {wood}
        </mesh>
      ))}
      <mesh position={[0, H - 0.08, -ROOM.half + 0.06]}>
        <boxGeometry args={[ROOM.half * 2, 0.16, 0.12]} />
        {wood}
      </mesh>
      <mesh position={[-ROOM.half + 0.06, H - 0.08, 0]}>
        <boxGeometry args={[0.12, 0.16, ROOM.half * 2]} />
        {wood}
      </mesh>
      {/* Nageshi: the horizontal rail halfway up both walls */}
      <mesh position={[0, 2.1, -ROOM.half + 0.04]}>
        <boxGeometry args={[ROOM.half * 2, 0.08, 0.08]} />
        {wood}
      </mesh>
      <mesh position={[-ROOM.half + 0.04, 2.1, 0]}>
        <boxGeometry args={[0.08, 0.08, ROOM.half * 2]} />
        {wood}
      </mesh>
      {/* Baseboards following each level */}
      <mesh position={[(-ROOM.half + 0.9) / 2, LEVELS.deck + 0.04, -ROOM.half + 0.02]}>
        <boxGeometry args={[0.9 + ROOM.half, 0.08, 0.04]} />
        <meshStandardMaterial color={PALETTE.woodDark} />
      </mesh>
      <mesh position={[(0.9 + ROOM.half) / 2, LEVELS.loft + 0.04, -ROOM.half + 0.02]}>
        <boxGeometry args={[ROOM.half - 0.9, 0.08, 0.04]} />
        <meshStandardMaterial color={PALETTE.woodDark} />
      </mesh>

      {/* Window on the left wall: shoji lattice with the night behind */}
      <group position={[-ROOM.half, (y0 + y1) / 2, (z0 + z1) / 2]} rotation={[0, Math.PI / 2, 0]}>
        <Shoji width={z1 - z0} height={y1 - y0} cols={4} rows={3} paper={false} depth={0.06} />
        <mesh position={[0, -(y1 - y0) / 2 - 0.03, 0.06]}>
          <boxGeometry args={[z1 - z0 + 0.14, 0.04, 0.16]} />
          {wood}
        </mesh>
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[z1 - z0, y1 - y0]} />
          <meshPhysicalMaterial color="#c9d6ff" transparent opacity={0.07} roughness={0.05} />
        </mesh>
      </group>

      {/* Shoji panel on the back wall, over the platform, lit from behind */}
      <group position={[1.7, LEVELS.loft + 0.95, -ROOM.half + 0.04]}>
        <Shoji width={1.6} height={1.25} cols={4} rows={3} glow={0.18} />
      </group>

      {/* Tokonoma: alcove on the left wall with a raised floor for the scroll */}
      <group position={[-ROOM.half, 0, 0.9]}>
        <mesh position={[0.3, 0.075, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.15, 1.4]} />
          {wood}
        </mesh>
        <mesh position={[0.012, 1.42, 0]} receiveShadow>
          <boxGeometry args={[0.024, 1.9, 1.4]} />
          <meshStandardMaterial color={PALETTE.plasterDark} roughness={1} />
        </mesh>
        {[-0.72, 0.72].map((z) => (
          <mesh key={z} position={[0.3, 1.2, z]} castShadow>
            <boxGeometry args={[0.6, 2.4, 0.06]} />
            {wood}
          </mesh>
        ))}
        <mesh position={[0.3, 2.4, 0]}>
          <boxGeometry args={[0.6, 0.08, 1.5]} />
          {wood}
        </mesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Night outside the window: moon, mountain, torii                     */
/* ------------------------------------------------------------------ */

/**
 * Painted landscape for the window: sky gradient, sun or moon, layered
 * mountains, a small torii. Drawn once per mood on a canvas, like a backdrop
 * in a diorama, so nothing outside the room needs to exist in 3D.
 */
function paintView(mood: Mood) {
  const w = 512;
  const h = 440;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  const night = mood === "night";
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  (night
    ? [[0, "#141233"], [0.55, "#2c2559"], [0.85, "#5a4686"], [1, "#8a6aa3"]]
    : [[0, "#8fb2e0"], [0.5, "#d9c3dc"], [0.8, "#f6c8a0"], [1, "#f7ad7e"]]
  ).forEach(([at, col]) => sky.addColorStop(at as number, col as string));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  // Sun / moon with a soft halo.
  const [cx, cy, r] = night ? [340, 110, 34] : [150, 170, 44];
  const halo = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r * 3.2);
  halo.addColorStop(0, night ? "rgba(220,225,255,0.45)" : "rgba(255,240,200,0.7)");
  halo.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = night ? "#e4e8ff" : "#fff6d8";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  if (night) {
    const rand = mulberry32(7);
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    for (let i = 0; i < 40; i++) ctx.fillRect(rand() * w, rand() * h * 0.55, 1.5, 1.5);
  }
  // Mountain layers, far to near.
  const layers = night ? ["#3a3166", "#2a2350", "#1c1838"] : ["#b9a7c9", "#8f86ad", "#5f6a8a"];
  const ridge = (base: number, amp: number, seed: number, color: string) => {
    const rand = mulberry32(seed);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 32) ctx.lineTo(x, base - Math.sin(x / 90 + seed) * amp - rand() * amp * 0.4);
    ctx.lineTo(w, h);
    ctx.fill();
  };
  // Fuji-like peak with snow first, then the ridges in front of it.
  ctx.fillStyle = layers[0];
  ctx.beginPath();
  ctx.moveTo(60, h * 0.78);
  ctx.lineTo(250, h * 0.36);
  ctx.lineTo(300, h * 0.36);
  ctx.lineTo(470, h * 0.78);
  ctx.fill();
  ctx.fillStyle = night ? "#a99fd0" : "#fbf7ff";
  ctx.beginPath();
  ctx.moveTo(215, h * 0.44);
  ctx.lineTo(250, h * 0.36);
  ctx.lineTo(300, h * 0.36);
  ctx.lineTo(335, h * 0.44);
  ctx.lineTo(300, h * 0.42);
  ctx.lineTo(275, h * 0.46);
  ctx.lineTo(250, h * 0.42);
  ctx.fill();
  ridge(h * 0.72, 14, 3, layers[1]);
  // Torii on the near ridge.
  ctx.fillStyle = night ? "#7a2f3a" : "#c2443f";
  const tx = 360;
  const ty = h * 0.8;
  ctx.fillRect(tx - 34, ty - 70, 7, 70);
  ctx.fillRect(tx + 27, ty - 70, 7, 70);
  ctx.fillRect(tx - 44, ty - 76, 88, 8);
  ctx.fillRect(tx - 36, ty - 60, 72, 5);
  ridge(h * 0.86, 10, 11, layers[2]);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Backdrop just behind the window (hidden by the wall from every angle). */
function WindowView() {
  const { night, day } = React.useMemo(() => ({ night: paintView("night"), day: paintView("day") }), []);
  const mood = useMood();
  const dayMat = React.useRef<THREE.MeshBasicMaterial>(null);
  useFrame(() => {
    if (dayMat.current) dayMat.current.opacity = mood.current;
  });
  const { z0, z1, y0, y1 } = WINDOW;
  const size: [number, number] = [2.1, 1.8];
  return (
    <group position={[-ROOM.half - 0.45, (y0 + y1) / 2, (z0 + z1) / 2]} rotation={[0, Math.PI / 2, 0]}>
      <mesh>
        <planeGeometry args={size} />
        <meshBasicMaterial map={night} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.002]}>
        <planeGeometry args={size} />
        <meshBasicMaterial ref={dayMat} map={day} toneMapped={false} transparent opacity={0} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Enzo at the desk                                                    */
/* ------------------------------------------------------------------ */

/** Kanji print for the hoodie (white on black), drawn once. */
function useKanjiTexture() {
  return React.useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 256;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#1b1a20";
    ctx.fillRect(0, 0, 128, 256);
    ctx.fillStyle = "#f2f0ea";
    ctx.font = "bold 72px serif";
    ctx.textAlign = "center";
    ctx.fillText("武", 64, 90);
    ctx.fillText("道", 64, 190);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

/**
 * Enzo works facing the room: the desk sits in front of him, the chair backs
 * onto the wall. The whole workstation is turned a little towards the home
 * camera so his face reads in three-quarters.
 */
const CHAR_YAW = Math.PI + 0.3;
/** Where the chair stands on the deck (between the desk and the back wall). */
const SEAT = { x: DESK.x, z: -2.05 } as const;

/** Mate with its bombilla. */
function Mate(props: JSX.IntrinsicElements["group"]) {
  return (
    <group {...props}>
      <mesh position={[0, 0.035, 0]} castShadow>
        <cylinderGeometry args={[0.032, 0.024, 0.07, 12]} />
        <meshStandardMaterial color="#6b4a2b" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.071, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.004, 12]} />
        <meshStandardMaterial color="#4f7a46" roughness={1} />
      </mesh>
      <mesh position={[0.012, 0.1, -0.008]} rotation={[0.25, 0, -0.3]}>
        <cylinderGeometry args={[0.003, 0.003, 0.12, 6]} />
        <meshStandardMaterial color="#c9c2b4" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

/**
 * Enzo, chibi proportions: curly hair, thin gold glasses, moustache, black
 * hoodie with a kanji print. Types on the laptop with the head down; every
 * few seconds looks up at the visitor (the head follows the pointer) and
 * waves. Local frame: front = -z, origin on the seat.
 */
// Enzo casts no shadow: the shadow map is only refreshed when the light moves,
// and his animated pose would leave a frozen silhouette behind.
function Enzo({ reducedMotion, station }: { reducedMotion: boolean; station: StationId }) {
  const head = React.useRef<THREE.Group>(null);
  const armL = React.useRef<THREE.Group>(null);
  const foreL = React.useRef<THREE.Group>(null);
  const armR = React.useRef<THREE.Group>(null);
  const foreR = React.useRef<THREE.Group>(null);
  const torso = React.useRef<THREE.Group>(null);
  const eyes = React.useRef<THREE.Group>(null);
  const kanji = useKanjiTexture();
  const blink = React.useRef({ next: 2, until: 0 });
  const look = React.useRef({ next: 3, until: 0 });
  // Squash impulse (GSAP animates it): > 0 stretches, < 0 squashes.
  const squash = React.useRef({ v: 0 });
  const firstStation = React.useRef(true);
  React.useEffect(() => {
    // A little hop whenever the visitor goes somewhere: anticipate, stretch, settle.
    if (firstStation.current) {
      firstStation.current = false;
      return;
    }
    if (reducedMotion) return;
    const tl = gsap
      .timeline()
      .to(squash.current, { v: -0.12, duration: 0.12, ease: "power2.out" })
      .to(squash.current, { v: 0.1, duration: 0.14, ease: "power2.out" })
      .to(squash.current, { v: 0, duration: 0.9, ease: "elastic.out(1, 0.45)" });
    return () => {
      tl.kill();
    };
  }, [station, reducedMotion]);
  useFrame(({ clock, pointer }, delta) => {
    const t = clock.getElapsedTime();
    const dt = Math.min(delta, 0.1);
    // Looks up for ~2.8 s every 7–11 s; waves in the middle of it.
    const l = look.current;
    if (!reducedMotion && t > l.next) {
      l.until = t + 2.8;
      l.next = t + 7 + Math.random() * 4;
    }
    const up = !reducedMotion && t < l.until;
    const waving = up && t > l.until - 2.3 && t < l.until - 0.5;
    if (torso.current) {
      // Squash & stretch with constant volume: y by s, x and z by 1/sqrt(s).
      const s = 1 + (reducedMotion ? 0 : Math.sin(t * 2.1) * 0.012) + squash.current.v;
      const k = 1 / Math.sqrt(s);
      torso.current.scale.set(k, s, k);
    }
    if (head.current) {
      // Positive x tilts the face up, positive y turns it towards the camera.
      const ty = up ? 0.38 + pointer.x * 0.3 : Math.sin(t * 0.4) * 0.05;
      const tx = up ? 0.16 + pointer.y * 0.15 : -0.32;
      // Damped towards the target in seconds, not per frame (same feel at 60 or 120 Hz).
      easing.damp(head.current.rotation, "y", ty, 0.2, dt);
      easing.damp(head.current.rotation, "x", tx, 0.2, dt);
    }
    const b = blink.current;
    if (t > b.next) {
      b.until = t + 0.12;
      b.next = t + 3 + Math.random() * 3;
    }
    if (eyes.current) eyes.current.scale.y = t < b.until ? 0.1 : 1;
    // Typing: forearms flat on the keyboard with a small alternate tap.
    const tap = reducedMotion ? 0 : 0.05;
    if (foreL.current) foreL.current.rotation.x = 1.1 + Math.sin(t * 17) * tap;
    if (armR.current) {
      easing.damp(armR.current.rotation, "x", waving ? 0 : 0.45, 0.12, dt);
      easing.damp(armR.current.rotation, "z", waving ? 2.5 : -0.15, 0.12, dt);
    }
    if (foreR.current) {
      easing.damp(foreR.current.rotation, "x", waving ? 0 : 1.1 + Math.sin(t * 17 + 1.7) * tap, 0.06, dt);
      easing.damp(foreR.current.rotation, "z", waving ? 0.5 + Math.sin(t * 12) * 0.35 : 0, 0.06, dt);
    }
  });
  const skin = <meshStandardMaterial color="#e9bd98" roughness={0.85} />;
  const hoodie = <meshStandardMaterial color="#1f1d24" roughness={0.95} />;
  const pants = <meshStandardMaterial color="#34323e" roughness={1} />;
  const hair = <meshStandardMaterial color="#1c140f" roughness={0.9} />;
  const frame = <meshStandardMaterial color="#2e2c33" roughness={0.35} metalness={0.6} />;
  // From his photo: thin light-brown moustache and a little chin stubble.
  const whisker = <meshStandardMaterial color="#5a4232" roughness={1} />;
  const curls = React.useMemo(() => {
    const rand = mulberry32(21);
    const out: [number, number, number, number][] = [];
    for (let i = 0; i < 22; i++) {
      const a = rand() * Math.PI * 2;
      const r = 0.05 + rand() * 0.09;
      const y = 0.13 + rand() * 0.07 - r * 0.3;
      out.push([Math.cos(a) * r, y, Math.sin(a) * r * 0.9 - 0.01, 0.05 + rand() * 0.025]);
    }
    return out;
  }, []);
  // One arm: upper arm hangs from the shoulder pivot, forearm from the elbow.
  const arm = (side: -1 | 1) => (
    <group
      ref={side < 0 ? armL : armR}
      position={[0.25 * side, 0.54, 0.02]}
      rotation={[0.45, 0, -0.15 * side]}
    >
      <mesh position={[0, -0.13, 0]}>
        <boxGeometry args={[0.11, 0.28, 0.11]} />
        {hoodie}
      </mesh>
      <group ref={side < 0 ? foreL : foreR} position={[0, -0.26, 0]} rotation={[1.1, 0, 0]}>
        <mesh position={[0, -0.13, 0]}>
          <boxGeometry args={[0.1, 0.26, 0.1]} />
          {hoodie}
        </mesh>
        <mesh position={[0, -0.29, 0]}>
          <boxGeometry args={[0.09, 0.07, 0.09]} />
          {skin}
        </mesh>
      </group>
    </group>
  );
  return (
    <group ref={torso} rotation={[-0.06, 0, 0]}>
      {/* Hips + thighs forward (under the desk), shins down, sneakers */}
      <mesh position={[0, 0.06, 0.02]}>
        <boxGeometry args={[0.34, 0.14, 0.26]} />
        {pants}
      </mesh>
      {[-0.09, 0.09].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.07, -0.2]}>
            <boxGeometry args={[0.13, 0.13, 0.34]} />
            {pants}
          </mesh>
          <mesh position={[x, -0.16, -0.34]}>
            <boxGeometry args={[0.12, 0.38, 0.12]} />
            {pants}
          </mesh>
          <mesh position={[x, -0.37, -0.38]}>
            <boxGeometry args={[0.12, 0.06, 0.22]} />
            <meshStandardMaterial color="#f3ece0" roughness={0.9} />
          </mesh>
        </group>
      ))}
      {/* Hoodie torso, kanji print on the chest (front = local -z) */}
      <RoundedBox args={[0.42, 0.46, 0.25]} radius={0.06} position={[0, 0.36, 0.02]}>
        {hoodie}
      </RoundedBox>
      <mesh position={[0.07, 0.36, -0.106]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.1, 0.2]} />
        <meshStandardMaterial map={kanji} roughness={1} />
      </mesh>
      {/* Collar + hood bump behind the neck */}
      <mesh position={[0, 0.6, 0.03]}>
        <cylinderGeometry args={[0.1, 0.14, 0.1, 12]} />
        {hoodie}
      </mesh>
      <RoundedBox args={[0.3, 0.12, 0.12]} radius={0.05} position={[0, 0.6, 0.14]}>
        {hoodie}
      </RoundedBox>
      {arm(-1)}
      {arm(1)}
      {/* Head: chibi, ~40 % of the seated height */}
      <group ref={head} position={[0, 0.84, 0.02]}>
        <RoundedBox args={[0.28, 0.3, 0.27]} radius={0.1}>
          {skin}
        </RoundedBox>
        <RoundedBox args={[0.29, 0.1, 0.28]} radius={0.05} position={[0, 0.13, -0.005]}>
          {hair}
        </RoundedBox>
        <mesh position={[0, 0.07, 0.1]}>
          <boxGeometry args={[0.27, 0.12, 0.08]} />
          {hair}
        </mesh>
        {curls.map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[r, 10, 8]} />
            {hair}
          </mesh>
        ))}
        {[-0.09, -0.03, 0.04, 0.1].map((x, i) => (
          <mesh key={x} position={[x, 0.1 - (i % 2) * 0.02, -0.115]}>
            <sphereGeometry args={[0.045, 10, 8]} />
            {hair}
          </mesh>
        ))}
        {/* Thick straight brows, outer end slightly lower */}
        {[-0.057, 0.057].map((x) => (
          <mesh key={x} position={[x, 0.047, -0.137]} rotation={[0, 0, x > 0 ? -0.1 : 0.1]}>
            <boxGeometry args={[0.06, 0.016, 0.008]} />
            {hair}
          </mesh>
        ))}
        <group ref={eyes} position={[0, 0.005, -0.137]}>
          {[-0.055, 0.055].map((x) => (
            <mesh key={x} position={[x, 0, 0]}>
              <boxGeometry args={[0.03, 0.026, 0.01]} />
              <meshStandardMaterial color="#1a1612" roughness={0.6} />
            </mesh>
          ))}
        </group>
        {/* Aviator glasses: thin dark metal, wide lenses, double bridge */}
        {[-0.06, 0.06].map((x) => (
          <group key={x} position={[x, -0.002, -0.146]}>
            {[
              [0, 0.034, 0.1, 0.007],
              [x > 0 ? 0.004 : -0.004, -0.034, 0.088, 0.007],
              // Inner side shorter so the bridge doesn't read as an "H".
              [x > 0 ? -0.05 : 0.05, -0.012, 0.007, 0.046],
              [x > 0 ? 0.05 : -0.05, 0, 0.007, 0.07],
            ].map(([bx, by, w, h], i) => (
              <mesh key={i} position={[bx, by, 0]}>
                <boxGeometry args={[w, h, 0.007]} />
                {frame}
              </mesh>
            ))}
          </group>
        ))}
        <mesh position={[0, 0.032, -0.146]}>
          <boxGeometry args={[0.03, 0.006, 0.006]} />
          {frame}
        </mesh>
        {[-0.142, 0.142].map((x) => (
          <mesh key={x} position={[x, 0.028, -0.07]}>
            <boxGeometry args={[0.007, 0.007, 0.15]} />
            {frame}
          </mesh>
        ))}
        <mesh position={[0, -0.035, -0.142]}>
          <boxGeometry args={[0.03, 0.04, 0.02]} />
          {skin}
        </mesh>
        {/* Thin moustache in two halves that droop a little at the ends */}
        {[-0.021, 0.021].map((x) => (
          <mesh key={x} position={[x, -0.071, -0.1365]} rotation={[0, 0, x > 0 ? -0.18 : 0.18]}>
            <boxGeometry args={[0.04, 0.007, 0.006]} />
            {whisker}
          </mesh>
        ))}
        {/* Chin stubble on the rounded underside of the face */}
        <mesh position={[0, -0.125, -0.103]} rotation={[-0.85, Math.PI, 0]}>
          <planeGeometry args={[0.07, 0.035]} />
          <meshStandardMaterial color="#9c7158" roughness={1} />
        </mesh>
        <mesh position={[0, -0.1, -0.1244]}>
          <boxGeometry args={[0.05, 0.008, 0.008]} />
          <meshStandardMaterial color="#b4705e" roughness={1} />
        </mesh>
        {[-0.145, 0.145].map((x) => (
          <mesh key={x} position={[x, -0.01, 0]}>
            <sphereGeometry args={[0.028, 10, 8]} />
            {skin}
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Code on the laptop screen: a few colored lines on the dark editor theme. */
function useCodeTexture() {
  return React.useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 160;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#1d1827";
    ctx.fillRect(0, 0, 256, 160);
    const rand = mulberry32(5);
    const colors = ["#f0a6ca", "#b5a6d3", "#9ad1b6", "#e6e1f0", "#ffcf8a"];
    for (let y = 14, i = 0; y < 150; y += 12, i++) {
      let x = 14 + (i % 4 === 0 ? 0 : (1 + (i % 3)) * 12);
      const parts = 1 + Math.floor(rand() * 3);
      for (let p = 0; p < parts; p++) {
        const w = 14 + rand() * 50;
        ctx.fillStyle = colors[Math.floor(rand() * colors.length)];
        ctx.fillRect(x, y, w, 5);
        x += w + 8;
      }
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

/** Laptop open towards Enzo (+z); the lid's back, with a sticker, faces the room. */
function Laptop() {
  const code = useCodeTexture();
  const shell = <meshStandardMaterial color="#cfc9d6" roughness={0.4} metalness={0.5} />;
  return (
    <group>
      <RoundedBox args={[0.34, 0.016, 0.23]} radius={0.006} position={[0, 0.008, 0]} castShadow receiveShadow>
        {shell}
      </RoundedBox>
      <mesh position={[0, 0.0165, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.29, 0.12]} />
        <meshStandardMaterial color="#2b2733" roughness={0.8} />
      </mesh>
      <group position={[0, 0.016, -0.11]} rotation={[-0.3, 0, 0]}>
        <RoundedBox args={[0.34, 0.23, 0.012]} radius={0.006} position={[0, 0.115, 0]} castShadow>
          {shell}
        </RoundedBox>
        <mesh position={[0, 0.115, 0.0065]}>
          <planeGeometry args={[0.31, 0.195]} />
          <meshBasicMaterial map={code} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.12, -0.0065]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.035, 24]} />
          <meshBasicMaterial color={PALETTE.pink} toneMapped={false} />
        </mesh>
      </group>
      {/* Screen glow on his face */}
      <pointLight position={[0, 0.2, 0.12]} intensity={0.7} distance={0.9} decay={2} color="#ffd1e6" />
    </group>
  );
}

/** Chair, Enzo and laptop share one transform, turned towards the camera. */
function Workstation({ reducedMotion, station }: { reducedMotion: boolean; station: StationId }) {
  return (
    <group position={[SEAT.x, LEVELS.deck, SEAT.z]} rotation={[0, CHAR_YAW, 0]}>
      <Model name="chairDesk" />
      {/* Characters get a harder light/shadow cut than the set, as in Messenger. */}
      <group position={[0, 0.46, 0]} userData={{ toon: { cut: [0.1, 0.15] } }}>
        <Enzo reducedMotion={reducedMotion} station={station} />
      </group>
      <group position={[0, 0.769, -0.44]}>
        <Laptop />
      </group>
    </group>
  );
}

/** Retro console on the platform's shelf: opens the Warcraft version. */
function Arcade({ onArcade }: { onArcade: () => void }) {
  const { bind } = useHoverCursor();
  const mood = useMood();
  const glow = React.useRef<THREE.MeshBasicMaterial>(null);
  useFrame(({ clock }) => {
    if (!glow.current) return;
    const pulse = 0.75 + Math.sin(clock.getElapsedTime() * 2.5) * 0.15;
    glow.current.opacity = pulse * (1 - mood.current * 0.5);
  });
  return (
    <group
      position={[2.2, LEVELS.loft + 0.8, -1.3]}
      rotation={[0, -Math.PI / 2, 0]}
      {...bind}
      onClick={(e) => {
        if (e.delta > 6) return;
        e.stopPropagation();
        onArcade();
      }}
    >
      {/* CRT body */}
      <RoundedBox args={[0.3, 0.26, 0.26]} radius={0.02} position={[0, 0.13, 0]} castShadow>
        <meshStandardMaterial color="#d9d2c4" roughness={0.8} />
      </RoundedBox>
      <mesh position={[0, 0.14, 0.131]}>
        <planeGeometry args={[0.22, 0.17]} />
        <meshBasicMaterial ref={glow} color="#38b6ff" toneMapped={false} transparent />
      </mesh>
      {/* Knobs */}
      {[0.05, 0.1].map((y) => (
        <mesh key={y} position={[0.1, y + 0.02, 0.131]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.01, 8]} />
          <meshStandardMaterial color="#5a5248" />
        </mesh>
      ))}
      {/* Cartridge + gamepad in front */}
      <mesh position={[-0.05, 0.015, 0.2]} rotation={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.08, 0.03, 0.1]} />
        <meshStandardMaterial color="#4a3222" roughness={0.8} />
      </mesh>
      <mesh position={[0.08, 0.01, 0.21]} rotation={[0, -0.2, 0]} castShadow>
        <boxGeometry args={[0.1, 0.02, 0.05]} />
        <meshStandardMaterial color="#2b3140" roughness={0.7} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Interactive objects                                                 */
/* ------------------------------------------------------------------ */

type Interactive = {
  station: StationId;
  language: Language;
  /** Content is interactive inside the scene (false on phones: a sheet shows it). */
  inScene: boolean;
  onSelect: (id: Exclude<StationId, "home">) => void;
};

function useHoverCursor() {
  const [hovered, setHovered] = React.useState(false);
  React.useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);
  return {
    hovered,
    bind: {
      onPointerOver: (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHovered(true);
      },
      onPointerOut: () => setHovered(false),
    },
  };
}

/**
 * Squeeze and elastic bounce back, the "poke" from Messenger: on hover a
 * light one, on click a deeper one (0.9) right before the camera flies.
 */
function poke(target: THREE.Object3D, depth: number) {
  if (prefersReducedMotion()) return;
  gsap.killTweensOf(target.scale);
  gsap
    .timeline()
    .to(target.scale, { x: depth, y: depth, z: depth, duration: 0.16, ease: "power2.out" })
    .to(target.scale, { x: 1, y: 1, z: 1, duration: 0.9, ease: `elastic.out(1, ${(0.5 + Math.random() * 0.3).toFixed(2)})` });
}

/**
 * Wraps a clickable object: ignores clicks that were really drags and pokes
 * the object around `pivot` (its centre), so it squeezes in place.
 */
function Clickable({
  id,
  station,
  onSelect,
  pivot,
  children,
}: {
  id: Exclude<StationId, "home">;
  station: StationId;
  onSelect: Interactive["onSelect"];
  pivot: THREE.Vector3;
  children: React.ReactNode;
}) {
  const { bind } = useHoverCursor();
  const enabled = station !== id;
  const squeeze = React.useRef<THREE.Group>(null);
  const lastPoke = React.useRef(0);
  return (
    <group
      {...(enabled
        ? {
            ...bind,
            onPointerOver: (e: ThreeEvent<PointerEvent>) => {
              bind.onPointerOver(e);
              const now = performance.now();
              if (squeeze.current && now - lastPoke.current > 700) {
                lastPoke.current = now;
                poke(squeeze.current, 0.96);
              }
            },
          }
        : {})}
      onClick={(e) => {
        if (!enabled || e.delta > 6) return;
        e.stopPropagation();
        if (squeeze.current) poke(squeeze.current, 0.9);
        onSelect(id);
      }}
    >
      <group position={pivot}>
        <group ref={squeeze}>
          <group position={pivot.clone().negate()}>{children}</group>
        </group>
      </group>
    </group>
  );
}

function ScreenHtml({
  id,
  active,
  inScene,
  children,
}: {
  id: Exclude<StationId, "home">;
  active: boolean;
  inScene: boolean;
  children: React.ReactNode;
}) {
  const s = SURFACES[id];
  const [w, h] = s.px;
  const interactive = active && inScene;
  return (
    <Html
      transform
      position={s.center.toArray()}
      rotation={s.rotation}
      distanceFactor={distanceFactorFor(s)}
      zIndexRange={[20, 0]}
      pointerEvents={interactive ? "auto" : "none"}
      // Phones get the content in a 2D sheet, so the in-scene copy stays a
      // non-interactive cover (the screens set aria-hidden/inert themselves).
      style={{ width: w, height: h }}
    >
      {children}
    </Html>
  );
}

/** Screen mounted on the back wall behind Enzo, in a slim dark bezel. */
function Monitor({ station, language, inScene, onSelect }: Interactive) {
  const active = station === "projects";
  const c = SURFACES.projects.center;
  const [w, h] = SURFACES.projects.size;
  return (
    <Clickable id="projects" station={station} onSelect={onSelect} pivot={SURFACES.projects.center}>
      <RoundedBox args={[w + 0.05, h + 0.05, 0.03]} radius={0.01} position={[c.x, c.y, c.z - 0.02]} castShadow>
        <meshStandardMaterial color="#1a1622" roughness={0.5} metalness={0.3} />
      </RoundedBox>
      <mesh position={[c.x + w / 2 - 0.03, c.y - h / 2 - 0.014, c.z - 0.004]}>
        <circleGeometry args={[0.005, 10]} />
        <meshBasicMaterial color={PALETTE.pink} toneMapped={false} />
      </mesh>
      <ScreenHtml id="projects" active={active} inScene={inScene}>
        <MonitorScreen language={language} active={active && inScene} />
      </ScreenHtml>
    </Clickable>
  );
}

/** Board on the platform's back wall, framed in dark wood. */
function Board({ station, language, inScene, onSelect }: Interactive) {
  const active = station === "experience";
  const c = SURFACES.experience.center;
  return (
    <Clickable id="experience" station={station} onSelect={onSelect} pivot={SURFACES.experience.center}>
      <mesh position={[c.x, c.y, -ROOM.half + 0.065]} castShadow receiveShadow>
        <boxGeometry args={[1.32, 0.84, 0.03]} />
        <meshStandardMaterial color={PALETTE.woodDark} roughness={0.8} />
      </mesh>
      <mesh position={[c.x, c.y, -ROOM.half + 0.082]}>
        <boxGeometry args={[1.26, 0.78, 0.01]} />
        <meshStandardMaterial color="#1a1622" roughness={0.9} />
      </mesh>
      <ScreenHtml id="experience" active={active} inScene={inScene}>
        <BoardScreen language={language} active={active && inScene} />
      </ScreenHtml>
    </Clickable>
  );
}

/** Hanging scroll in the tokonoma. */
function Scroll({ station, language, inScene, onSelect }: Interactive) {
  const active = station === "about";
  const c = SURFACES.about.center;
  const [w, h] = SURFACES.about.size;
  const rod = <meshStandardMaterial color={PALETTE.woodDark} roughness={0.7} />;
  return (
    <Clickable id="about" station={station} onSelect={onSelect} pivot={SURFACES.about.center}>
      {/* Backing cloth sits just behind the HTML (x = -2.465); rods in front. */}
      <group position={[-ROOM.half + 0.029, c.y, c.z]}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.01, h + 0.3, w + 0.1]} />
          <meshStandardMaterial color="#3d2f52" roughness={1} />
        </mesh>
        {[h / 2 + 0.16, -h / 2 - 0.16].map((y) => (
          <mesh key={y} position={[0.025, y, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, w + 0.2, 10]} />
            {rod}
          </mesh>
        ))}
        <mesh position={[0, h / 2 + 0.3, 0]}>
          <boxGeometry args={[0.006, 0.12, 0.012]} />
          {rod}
        </mesh>
      </group>
      <ScreenHtml id="about" active={active} inScene={inScene}>
        <PosterScreen language={language} active={active && inScene} />
      </ScreenHtml>
    </Clickable>
  );
}

function Phone({ station, language, inScene, onSelect }: Interactive) {
  const active = station === "contact";
  const c = SURFACES.contact.center;
  return (
    <Clickable id="contact" station={station} onSelect={onSelect} pivot={SURFACES.contact.center}>
      <group position={[c.x, CHABUDAI.top, c.z]} rotation={[0, PHONE_YAW, 0]}>
        <RoundedBox args={[0.076, 0.008, 0.156]} radius={0.003} position={[0, 0.004, 0]} castShadow>
          <meshStandardMaterial color="#d9d2e6" roughness={0.35} metalness={0.5} />
        </RoundedBox>
        <group position={[0, c.y - CHABUDAI.top, 0]}>
          <Html
            transform
            rotation={SURFACES.contact.rotation}
            distanceFactor={distanceFactorFor(SURFACES.contact)}
            zIndexRange={[20, 0]}
            pointerEvents={active && inScene ? "auto" : "none"}
            style={{ width: SURFACES.contact.px[0], height: SURFACES.contact.px[1] }}
          >
            <PhoneScreen language={language} active={active && inScene} />
          </Html>
        </group>
      </group>
    </Clickable>
  );
}

/* ------------------------------------------------------------------ */
/* Hotspot markers                                                     */
/* ------------------------------------------------------------------ */

const MARKERS: { id: Exclude<StationId, "home"> | "arcade"; position: [number, number, number] }[] = [
  { id: "projects", position: [DESK.x, 2.6, -2.33] },
  { id: "experience", position: [1.7, LEVELS.loft + 1.5, -2.38] },
  { id: "about", position: [-2.3, 2.15, 0.9] },
  { id: "contact", position: [CHABUDAI.x, CHABUDAI.top + 0.2, CHABUDAI.z] },
  { id: "arcade", position: [2.2, LEVELS.loft + 1.2, -1.3] },
];

function Markers({ visible, reducedMotion }: { visible: boolean; reducedMotion: boolean }) {
  const refs = React.useRef<(THREE.Mesh | null)[]>([]);
  const size = React.useRef(MARKERS.map(() => ({ s: 0 })));
  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    refs.current.forEach((m, i) => {
      if (!m) return;
      const sz = size.current[i];
      easing.damp(sz, "s", visible ? 1 : 0, 0.12, Math.min(delta, 0.1));
      m.scale.setScalar(Math.max(sz.s, 0.0001));
      if (reducedMotion) return;
      m.rotation.y = t * 1.2 + i;
      m.position.y = MARKERS[i].position[1] + Math.sin(t * 2 + i) * 0.02;
    });
  });
  return (
    <>
      {MARKERS.map((m, i) => (
        <mesh key={m.id} ref={(el) => {
            refs.current[i] = el;
          }} position={m.position} raycast={() => null}>
          <octahedronGeometry args={[0.035]} />
          <meshBasicMaterial color={PALETTE.pink} toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Lights + composition                                                */
/* ------------------------------------------------------------------ */

/** Pendulum around its hanging point: a slow, small sway (a draught in the room). */
function Swing({
  position,
  reducedMotion,
  children,
}: {
  position: [number, number, number];
  reducedMotion: boolean;
  children: React.ReactNode;
}) {
  const ref = React.useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current || reducedMotion) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.z = Math.sin(t * 0.9) * 0.05;
    ref.current.rotation.x = Math.sin(t * 0.63 + 1) * 0.03;
  });
  return (
    <group ref={ref} position={position}>
      {children}
    </group>
  );
}

/**
 * Dust motes floating in the light from the window: one Points draw call
 * (drei Sparkles). Brighter by day, when the sun comes through; still with
 * reduced motion.
 */
function Dust({ reducedMotion, day }: { reducedMotion: boolean; day: boolean }) {
  return (
    <Sparkles
      position={[-1.7, 1.55, -1.3]}
      count={36}
      scale={[1.6, 1.4, 1.8]}
      size={2.2}
      speed={reducedMotion ? 0 : 0.18}
      noise={0.6}
      color="#fff1d6"
      opacity={day ? 0.8 : 0.4}
    />
  );
}

/** Sakura petal: rounded sides with the little notch at the tip, ~6 cm (stylized, reads at room scale). */
function petalGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.6, 0.25, 0.55, 0.85, 0.18, 1);
  shape.lineTo(0, 0.86);
  shape.lineTo(-0.18, 1);
  shape.bezierCurveTo(-0.55, 0.85, -0.6, 0.25, 0, 0);
  const geo = new THREE.ShapeGeometry(shape, 6);
  geo.translate(0, -0.5, 0);
  geo.scale(0.06, 0.06, 0.06);
  return geo;
}

/** Floor height under a point: tatami, deck or platform (petals settle there). */
function floorAt(x: number, z: number) {
  if (x > 0.9 && z < -0.5) return LEVELS.loft;
  if (x < 0.9 && z < -0.7) return LEVELS.deck;
  return 0;
}

/**
 * Cherry blossom petals drifting down through the open room: one instanced
 * mesh (a single draw call), positions updated on the CPU each frame. They
 * spawn inside the walls and the breeze pushes them towards the open sides,
 * so none cross a wall. Off with reduced motion.
 */
function Petals({ count, reducedMotion }: { count: number; reducedMotion: boolean }) {
  const mesh = React.useRef<THREE.InstancedMesh>(null);
  const geo = React.useMemo(petalGeometry, []);
  const dummy = React.useMemo(() => new THREE.Object3D(), []);
  const petals = React.useMemo(() => {
    const rand = mulberry32(99);
    return Array.from({ length: count }, () => ({
      x: -2.3 + rand() * 5.4,
      y: rand() * 4.2,
      z: -2.3 + rand() * 5.4,
      fall: 0.16 + rand() * 0.2,
      sway: 0.12 + rand() * 0.22,
      phase: rand() * Math.PI * 2,
      rx: rand() * Math.PI * 2,
      ry: rand() * Math.PI * 2,
      rz: rand() * Math.PI * 2,
      spin: 0.6 + rand() * 1.5,
      rest: 0,
      flat: false,
    }));
  }, [count]);
  useFrame(({ clock }, delta) => {
    const m = mesh.current;
    if (!m) return;
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    // Spin "on twos": the fall stays smooth, the turning changes twice a second.
    const stepped = Math.floor(t * 2) / 2;
    petals.forEach((p, i) => {
      const floor = floorAt(p.x, p.z);
      const inside = Math.abs(p.x) < ROOM.half && Math.abs(p.z) < ROOM.half;
      if (p.rest > 0) {
        // Lying on the floor for a moment, then back to the top.
        p.rest -= dt;
        if (p.rest <= 0) {
          p.flat = false;
          p.y = 4 + Math.random() * 0.6;
          p.x = -2.3 + Math.random() * 4.5;
          p.z = -2.3 + Math.random() * 4.5;
        }
      } else {
        p.y -= p.fall * dt;
        p.x += (0.07 + Math.sin(t * 0.8 + p.phase) * p.sway) * dt;
        p.z += (0.05 + Math.cos(t * 0.6 + p.phase) * p.sway * 0.6) * dt;
        if (inside && p.y <= floor + 0.01) {
          p.y = floor + 0.006;
          p.flat = true;
          p.rest = 2 + Math.random() * 3;
        } else if (p.y < -0.5 || p.x > 3.6 || p.z > 3.6) {
          p.y = 4 + Math.random() * 0.6;
          p.x = -2.3 + Math.random() * 4.5;
          p.z = -2.3 + Math.random() * 4.5;
        }
      }
      dummy.position.set(p.x, p.y, p.z);
      if (p.flat) dummy.rotation.set(-Math.PI / 2, 0, p.rz);
      else dummy.rotation.set(p.rx + stepped * p.spin, p.ry + stepped * p.spin * 0.7, p.rz + stepped * p.spin * 0.4);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });
  if (reducedMotion) return null;
  return (
    <instancedMesh ref={mesh} args={[geo, undefined, count]} frustumCulled={false}>
      <meshStandardMaterial color="#f5a9c4" emissive="#e98bb0" emissiveIntensity={0.35} roughness={1} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

/** Night and day values for every light; `useFrame` blends them by mood. */
const LIGHTING = {
  night: {
    bg: "#120f19",
    ambient: { color: "#9b8cc9", intensity: 0.3 },
    hemi: { sky: "#6f63a8", ground: "#2a2118", intensity: 0.55 },
    sun: { color: "#b9c4ff", intensity: 1.1, position: [-7, 5, -2.5] as [number, number, number] },
    desk: 2.2,
    screen: 0.9,
    shoji: 1.2,
    spot: 1.1,
    // Two-tone shading: lavender shadows, slightly cool lit side.
    shadowTint: "#7d74b4",
    litTint: "#aaa2d2",
  },
  // Late afternoon rather than noon: warm, low sun with real shadows and the
  // lanterns still glowing a little, so the room keeps its contrast.
  day: {
    bg: "#e6d4bd",
    ambient: { color: "#ffdcb8", intensity: 0.32 },
    hemi: { sky: "#f3d9b8", ground: "#6e4a2e", intensity: 0.55 },
    sun: { color: "#ffc98a", intensity: 2.2, position: [-7, 4.2, -0.5] as [number, number, number] },
    desk: 1.0,
    screen: 0.6,
    shoji: 0.5,
    spot: 0.6,
    // Warm shadows and a sunny lit side.
    shadowTint: "#f2d4c2",
    litTint: "#fff3e4",
  },
};

function Lights() {
  const mood = useMood();
  const scene = useThree((s) => s.scene);
  const ambient = React.useRef<THREE.AmbientLight>(null);
  const hemi = React.useRef<THREE.HemisphereLight>(null);
  const sun = React.useRef<THREE.DirectionalLight>(null);
  const desk = React.useRef<THREE.PointLight>(null);
  const screen = React.useRef<THREE.PointLight>(null);
  const shoji = React.useRef<THREE.PointLight>(null);
  const spot = React.useRef<THREE.PointLight>(null);
  const sunPos = React.useMemo(() => new THREE.Vector3(), []);
  const gl = useThree((s) => s.gl);
  const shadow = React.useRef({ last: -1, frames: 0 });
  React.useEffect(() => {
    // Nothing that casts a shadow moves except the sun (day/night), so the
    // shadow map is drawn on demand instead of every frame.
    gl.shadowMap.autoUpdate = false;
    gl.shadowMap.needsUpdate = true;
    return () => {
      gl.shadowMap.autoUpdate = true;
    };
  }, [gl]);
  useFrame(() => {
    const t = mood.current;
    const sh = shadow.current;
    // First frames (models settling) and every frame of the mood tween.
    if (sh.frames < 10 || t !== sh.last || performance.now() < shadowDirtyUntil) gl.shadowMap.needsUpdate = true;
    sh.frames++;
    sh.last = t;
    const n = LIGHTING.night;
    const d = LIGHTING.day;
    const lerp = THREE.MathUtils.lerp;
    mixColor(toonUniforms.uShadowTint.value, n.shadowTint, d.shadowTint, t);
    mixColor(toonUniforms.uLitTint.value, n.litTint, d.litTint, t);
    if (ambient.current) {
      ambient.current.intensity = lerp(n.ambient.intensity, d.ambient.intensity, t);
      mixColor(ambient.current.color, n.ambient.color, d.ambient.color, t);
    }
    if (hemi.current) {
      hemi.current.intensity = lerp(n.hemi.intensity, d.hemi.intensity, t);
      mixColor(hemi.current.color, n.hemi.sky, d.hemi.sky, t);
      mixColor(hemi.current.groundColor, n.hemi.ground, d.hemi.ground, t);
    }
    if (sun.current) {
      sun.current.intensity = lerp(n.sun.intensity, d.sun.intensity, t);
      mixColor(sun.current.color, n.sun.color, d.sun.color, t);
      sunPos.fromArray(n.sun.position).lerp(new THREE.Vector3().fromArray(d.sun.position), t);
      sun.current.position.copy(sunPos);
    }
    if (desk.current) desk.current.intensity = lerp(n.desk, d.desk, t);
    if (screen.current) screen.current.intensity = lerp(n.screen, d.screen, t);
    if (shoji.current) shoji.current.intensity = lerp(n.shoji, d.shoji, t);
    if (spot.current) spot.current.intensity = lerp(n.spot, d.spot, t);
    const bg = scene.background as THREE.Color | null;
    if (bg && bg.isColor) mixColor(bg, n.bg, d.bg, t);
    const fog = scene.fog as THREE.Fog | null;
    if (fog) mixColor(fog.color, n.bg, d.bg, t);
  });
  return (
    <>
      <ambientLight ref={ambient} intensity={0.3} color="#9b8cc9" />
      <hemisphereLight ref={hemi} args={["#6f63a8", "#2a2118", 0.55]} />
      {/* Moon / sun light through the window on the left wall */}
      <directionalLight
        ref={sun}
        position={[-7, 5, -2.5]}
        intensity={1.1}
        color="#b9c4ff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-camera-near={0.5}
        shadow-camera-far={18}
      />
      {/* Desk lamp and monitor glow */}
      <pointLight ref={desk} position={[DESK.x - 0.55, LEVELS.deck + 1.3, DESK.z + 0.15]} intensity={2.2} distance={3} decay={2} color={PALETTE.warm} />
      <pointLight ref={screen} position={[DESK.x, 2.2, -2.0]} intensity={0.9} distance={1.6} decay={2} color={PALETTE.pink} />
      {/* Shoji panel backlight on the platform */}
      <pointLight ref={shoji} position={[1.7, LEVELS.loft + 1.0, -2.1]} intensity={1.2} distance={2.6} decay={2} color="#ffd9b0" />
      {/* Tokonoma spot on the scroll */}
      <pointLight ref={spot} position={[-1.9, 2.3, 0.9]} intensity={1.1} distance={2.2} decay={2} color="#ffe6c8" />
    </>
  );
}

/**
 * Applies the two-tone shading to every standard material in the scene once
 * the room has mounted, and drives the wind time.
 */
function Toonify({ reducedMotion }: { reducedMotion: boolean }) {
  const scene = useThree((s) => s.scene);
  React.useEffect(() => {
    toonifyTree(scene);
  }, [scene]);
  useFrame(({ clock }) => {
    toonUniforms.uTime.value = clock.getElapsedTime();
    toonUniforms.uWindAmp.value = reducedMotion ? 0 : 0.03;
  });
  return null;
}

/**
 * Entrance: each direct child grows from nothing with an elastic overshoot,
 * one after the other (Messenger's elastic.out(1, 0.75), 0.075 s apart), with
 * a small random turn that settles. Every child must have its origin at its
 * own base or centre. The canvas mounts on "Enter", so mount = entrance.
 */
function PopIn({ reducedMotion, children }: { reducedMotion: boolean; children: React.ReactNode }) {
  const ref = React.useRef<THREE.Group>(null);
  const original = React.useRef(new Map<THREE.Object3D, { s: THREE.Vector3; ry: number }>());
  React.useLayoutEffect(() => {
    const group = ref.current;
    if (!group || reducedMotion) return;
    const rest = original.current;
    const tweens: gsap.core.Tween[] = [];
    group.children.forEach((child, i) => {
      // Remember the resting pose once (StrictMode runs this effect twice).
      if (!rest.has(child)) rest.set(child, { s: child.scale.clone(), ry: child.rotation.y });
      const { s, ry } = rest.get(child)!;
      const delay = 0.2 + 0.075 * i;
      tweens.push(
        gsap.fromTo(child.scale, { x: 0.0001, y: 0.0001, z: 0.0001 }, { x: s.x, y: s.y, z: s.z, duration: 2.2, delay, ease: "elastic.out(1, 0.75)" }),
        gsap.fromTo(child.rotation, { y: ry + (Math.random() - 0.5) * 1.2 }, { y: ry, duration: 2.2, delay, ease: "elastic.out(1, 0.75)" })
      );
    });
    markShadowsDirty(0.2 + 0.075 * group.children.length + 2.4);
    return () => {
      tweens.forEach((t) => t.kill());
      rest.forEach(({ s, ry }, child) => {
        child.scale.copy(s);
        child.rotation.y = ry;
      });
    };
  }, [reducedMotion]);
  return <group ref={ref}>{children}</group>;
}

export default function Room({
  station,
  language,
  inScene,
  reducedMotion,
  mood,
  onSelect,
  onArcade,
}: Interactive & { reducedMotion: boolean; mood: Mood; onArcade: () => void }) {
  const shared = { station, language, inScene, onSelect };
  const deck = LEVELS.deck;
  const loft = LEVELS.loft;
  // 0 → 1 blend, tweened so the whole room eases between night and day.
  const moodRef = React.useRef(mood === "day" ? 1 : 0);
  React.useEffect(() => {
    const tween = gsap.to(moodRef, { current: mood === "day" ? 1 : 0, duration: reducedMotion ? 0 : 1.6, ease: "power2.inOut" });
    return () => {
      tween.kill();
    };
  }, [mood, reducedMotion]);
  return (
    <MoodCtx.Provider value={moodRef}>
      <Lights />
      <Shell />
      <WindowView />

      {/* Furniture pops in one piece after another; screens, markers and
          particles stay outside (they have their own transitions). */}
      <PopIn reducedMotion={reducedMotion}>
        <Model name="desk" position={[DESK.x, deck, DESK.z]} />
        <Workstation reducedMotion={reducedMotion} station={station} />
        <Model name="lampSquareTable" position={[DESK.x - 0.55, deck + 0.769, DESK.z + 0.15]} />
        <Model name="plantSmall1" position={[DESK.x + 0.58, deck + 0.769, DESK.z + 0.2]} wind={0.35} />
        <Model name="books" position={[DESK.x - 0.55, deck + 0.769, DESK.z - 0.22]} rotation={[0, 0.4, 0]} />
        <Mate position={[DESK.x + 0.45, deck + 0.769, DESK.z - 0.12]} />
        <Model name="speakerSmall" position={[-2.25, deck, -2.3]} />
        <Model name="radio" position={[-2.0, deck, -1.2]} rotation={[0, 0.9, 0]} />
        <Model name="pottedPlant" position={[-2.1, deck, -0.95]} wind={0.9} />
        <Model name="plantSmall3" position={[0.55, deck, -2.3]} wind={0.35} />
        <Swing position={[0.45, deck + 2.47, -1.4]} reducedMotion={reducedMotion}>
          <Lantern position={[0, -0.57, 0]} radius={0.13} height={0.26} reducedMotion={reducedMotion} light={1.0} />
          <mesh position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.004, 0.004, 0.45, 4]} />
            <meshStandardMaterial color={PALETTE.ink} />
          </mesh>
        </Swing>
        <Model name="bookcaseOpenLow" position={[2.2, loft, -1.0]} rotation={[0, -Math.PI / 2, 0]} />
        <Model name="books" position={[2.2, loft + 0.44, -1.1]} rotation={[0, -Math.PI / 2, 0]} />
        <Model name="plantSmall2" position={[2.2, loft + 0.8, -0.75]} wind={0.35} />
        <Futon position={[1.95, loft, -2.1]} />
        <Zabuton position={[1.25, loft, -1.3]} rotation={0.2} />
        <LanternStand position={[1.3, loft, -2.2]} radius={0.17} height={0.34} pole={0.34} base={0.14} reducedMotion={reducedMotion} />
        <Model name="tableCoffeeSquare" position={[CHABUDAI.x, 0, CHABUDAI.z]} />
        <TeaSet position={[CHABUDAI.x - 0.14, CHABUDAI.top, CHABUDAI.z - 0.1]} />
        <Zabuton position={[CHABUDAI.x - 0.75, 0, CHABUDAI.z + 0.1]} rotation={0.1} />
        <Zabuton position={[CHABUDAI.x + 0.75, 0, CHABUDAI.z - 0.05]} rotation={-0.15} color={PALETTE.roseDark} />
        <Zabuton position={[CHABUDAI.x, 0, CHABUDAI.z + 0.78]} rotation={0.05} />
        <Model name="benchCushionLow" position={[1.95, 0, 1.75]} rotation={[0, -Math.PI / 2 - 0.3, 0]} />
        <Bonsai position={[-2.15, 0.15, 0.55]} scale={1.1} />
        <Bonsai position={[-1.95, 0, 2.05]} scale={0.8} />
        <LanternStand position={[1.95, 0, 0.6]} radius={0.2} height={0.4} pole={0.5} base={0.16} reducedMotion={reducedMotion} />
        <Arcade onArcade={onArcade} />
      </PopIn>
      {/* Pink LED strip on the desk's front edge (the side facing the room) */}
      <mesh position={[DESK.x, deck + 0.735, DESK.z + 0.395]}>
        <boxGeometry args={[1.44, 0.008, 0.008]} />
        <meshBasicMaterial color={PALETTE.pink} toneMapped={false} />
      </mesh>
      <Monitor {...shared} />
      <Board {...shared} />
      <Phone {...shared} />
      <Dust reducedMotion={reducedMotion} day={mood === "day"} />
      <Petals count={inScene ? 70 : 40} reducedMotion={reducedMotion} />

      <Scroll {...shared} />
      <Markers visible={station === "home"} reducedMotion={reducedMotion} />
      <Toonify reducedMotion={reducedMotion} />
    </MoodCtx.Provider>
  );
}
