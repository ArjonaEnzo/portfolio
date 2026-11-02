"use client";
import React from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import type { Language } from "@/lib/projects";
import CameraRig from "./camera-rig";
import Room, { type Mood } from "./room";
import type { StationId } from "./stations";
import { QUALITY, type Tier } from "./quality";

export type DeskCanvasProps = {
  station: StationId;
  entered: boolean;
  tier: Tier;
  language: Language;
  inScene: boolean;
  reducedMotion: boolean;
  mood: Mood;
  label: string;
  onSelect: (id: Exclude<StationId, "home">) => void;
  onArcade: () => void;
  /** Called once every shader is compiled and a first frame was drawn. */
  onWarm: () => void;
};

/**
 * Warms the scene up behind the boot screen: compiles every program with
 * `compileAsync` (parallel compile, so the link doesn't block the main
 * thread), then draws one frame so textures and the shadow map are uploaded.
 * After that, "Enter" only has to show the canvas.
 */
function Prewarm({ onWarm }: { onWarm: () => void }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const advance = useThree((s) => s.advance);
  const done = React.useRef(onWarm);
  done.current = onWarm;
  React.useEffect(() => {
    let alive = true;
    // Runs after the room's own effects (toon patch included), so the
    // programs compiled here are the ones the first frame will use.
    gl.compileAsync(scene, camera)
      .catch(() => {})
      .then(() => {
        if (!alive) return;
        advance(performance.now());
        requestAnimationFrame(() => alive && done.current());
      });
    return () => {
      alive = false;
    };
  }, [gl, scene, camera, advance]);
  return null;
}

/**
 * The frame loop starts on "Enter". Draws that first frame right away (before
 * the browser paints), so the entrance starts from its first pose instead of
 * flashing the warm-up frame.
 */
function EnterFrame({ entered }: { entered: boolean }) {
  const advance = useThree((s) => s.advance);
  React.useLayoutEffect(() => {
    if (entered) advance(performance.now());
  }, [entered, advance]);
  return null;
}

/** Loaded with next/dynamic (ssr: false): three.js only runs in the browser. */
export default function DeskCanvas({ station, entered, tier, language, inScene, reducedMotion, mood, label, onSelect, onArcade, onWarm }: DeskCanvasProps) {
  const quality = QUALITY[tier];
  const [dpr, setDpr] = React.useState(quality.dpr);
  return (
    <Canvas
      shadows={quality.shadows}
      dpr={dpr}
      // Nothing runs per frame until "Enter": the warm-up draws one frame by hand.
      frameloop={entered ? "always" : "never"}
      camera={{ fov: 35, near: 0.05, far: 60, position: [6, 4, 6] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      aria-label={label}
      role="img"
      className="!touch-none"
      // Hidden while it warms up (screens rendered with <Html> included).
      style={{ visibility: entered ? "visible" : "hidden" }}
    >
      {/* Drops the resolution if the device can't hold the frame rate (and gives
          it back when it recovers); after 3 flip-flops it stays put. */}
      <PerformanceMonitor flipflops={3} onDecline={() => setDpr(quality.dprLow)} onIncline={() => setDpr(quality.dpr)} />
      <React.Suspense fallback={null}>
        <Room
          station={station}
          entered={entered}
          quality={quality}
          language={language}
          inScene={inScene}
          reducedMotion={reducedMotion}
          mood={mood}
          onSelect={onSelect}
          onArcade={onArcade}
        />
        <Prewarm onWarm={onWarm} />
        <EnterFrame entered={entered} />
      </React.Suspense>
      <CameraRig station={station} entered={entered} reducedMotion={reducedMotion} compact={!inScene} />
    </Canvas>
  );
}
