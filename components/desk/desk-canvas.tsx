"use client";
import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import type { Language } from "@/lib/projects";
import CameraRig from "./camera-rig";
import Room, { type Mood } from "./room";
import type { StationId } from "./stations";

export type DeskCanvasProps = {
  station: StationId;
  entered: boolean;
  language: Language;
  inScene: boolean;
  reducedMotion: boolean;
  mood: Mood;
  label: string;
  onSelect: (id: Exclude<StationId, "home">) => void;
  onArcade: () => void;
  /** Called once the scene has drawn its first frame (the boot screen hides then). */
  onReady: () => void;
};

/** Fires `onReady` after the first rendered frame (models resolved, shaders compiled). */
function FirstFrame({ onReady }: { onReady: () => void }) {
  const done = React.useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    requestAnimationFrame(onReady);
  });
  return null;
}

/** Loaded with next/dynamic (ssr: false): three.js only runs in the browser. */
/** Device pixel ratio range: full detail by default, lower when frames drop. */
const DPR_HIGH: [number, number] = [1, 1.75];
const DPR_LOW: [number, number] = [1, 1.25];

export default function DeskCanvas({ station, entered, language, inScene, reducedMotion, mood, label, onSelect, onArcade, onReady }: DeskCanvasProps) {
  const [dpr, setDpr] = React.useState(DPR_HIGH);
  return (
    <Canvas
      shadows="soft"
      dpr={dpr}
      camera={{ fov: 35, near: 0.05, far: 60, position: [6, 4, 6] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      aria-label={label}
      role="img"
      className="!touch-none"
    >
      {/* Drops the resolution if the device can't hold the frame rate (and gives
          it back when it recovers); after 3 flip-flops it stays put. */}
      <PerformanceMonitor flipflops={3} onDecline={() => setDpr(DPR_LOW)} onIncline={() => setDpr(DPR_HIGH)} />
      <React.Suspense fallback={null}>
        <Room
          station={station}
          language={language}
          inScene={inScene}
          reducedMotion={reducedMotion}
          mood={mood}
          onSelect={onSelect}
          onArcade={onArcade}
        />
        <FirstFrame onReady={onReady} />
      </React.Suspense>
      <CameraRig station={station} entered={entered} reducedMotion={reducedMotion} compact={!inScene} />
    </Canvas>
  );
}
