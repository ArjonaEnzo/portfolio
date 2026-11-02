/**
 * Quality tiers for the room, picked once before the canvas mounts (changing
 * shadow settings later would recompile every program).
 *
 * - high: desktops and laptops with a decent GPU.
 * - low: phones, tablets and weak GPUs: lower resolution, harder and smaller
 *   shadows, no dust particles, fewer petals.
 */
export type Tier = "high" | "low";

export type Quality = {
  /** Device pixel ratio range, and the one PerformanceMonitor drops to. */
  dpr: [number, number];
  dprLow: [number, number];
  /** PCF soft (high) or plain PCF (low): plain compiles and filters faster. */
  shadows: "soft" | "percentage";
  shadowMapSize: number;
  dust: boolean;
  petals: number;
};

export const QUALITY: Record<Tier, Quality> = {
  high: { dpr: [1, 1.75], dprLow: [1, 1.25], shadows: "soft", shadowMapSize: 2048, dust: true, petals: 70 },
  low: { dpr: [1, 1.5], dprLow: [1, 1], shadows: "percentage", shadowMapSize: 1024, dust: false, petals: 40 },
};

/** Integrated or mobile GPUs that struggle with this scene, by renderer string. */
const WEAK_GPU = /swiftshader|llvmpipe|software|mali|adreno \(tm\) [1-5]\d\d\b|powervr|intel.*hd graphics [2-5]\d{2,3}\b/i;

/** Checks for WebGL and picks a tier. `null` = no WebGL at all. */
export function detectTier(): Tier | null {
  let renderer = "";
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return null;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (ext) renderer = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL));
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    return null;
  }
  const nav = navigator as Navigator & { deviceMemory?: number };
  const touch = window.matchMedia("(pointer: coarse)").matches;
  const fewCores = (nav.hardwareConcurrency ?? 8) <= 4;
  const lowMemory = (nav.deviceMemory ?? 8) <= 4;
  return touch || fewCores || lowMemory || WEAK_GPU.test(renderer) ? "low" : "high";
}
