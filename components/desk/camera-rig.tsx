"use client";
import React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { HOME, SURFACES, framePose, type StationId } from "./stations";

// Tweens follow wall-clock time even after a background tab or a long frame,
// otherwise a throttled tab leaves the camera stuck mid-flight.
gsap.ticker.lagSmoothing(0);

const FOV = 35;
const MAX_YAW = 0.85;
const MAX_PITCH = 0.3;

/** Home pose pulled back on narrow screens so the whole desk stays in frame. */
function homePose(aspect: number) {
  const offset = HOME.position.clone().sub(HOME.target);
  // Portrait phones crop the sides instead of shrinking the room to a strip.
  const k = aspect < 1.4 ? Math.min(1.75, Math.pow(1.4 / aspect, 0.6)) : 1;
  return { position: HOME.target.clone().addScaledVector(offset, k), target: HOME.target.clone() };
}

/**
 * Moves the camera between stations with GSAP and, in the home view, lets the
 * visitor drag to orbit a little around the target (springs back on leave).
 */
/** Share of the screen left above the mobile sheet (the sheet takes 68dvh). */
const SHEET_VISIBLE = 0.32;

export default function CameraRig({
  station,
  entered,
  reducedMotion,
  compact,
}: {
  station: StationId;
  entered: boolean;
  reducedMotion: boolean;
  /** Phones: sections open in a bottom sheet, so frame objects in the strip above it. */
  compact: boolean;
}) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);

  const base = React.useRef(new THREE.Vector3());
  const target = React.useRef(new THREE.Vector3());
  const look = React.useRef({ yaw: 0, pitch: 0, toYaw: 0, toPitch: 0 });
  const initialised = React.useRef(false);

  // Initial pose: far out, so "Enter" can fly in.
  React.useLayoutEffect(() => {
    if (initialised.current) return;
    initialised.current = true;
    const { position, target: t } = homePose(size.width / size.height);
    base.current.copy(t).addScaledVector(position.clone().sub(t), 1.7);
    base.current.y += 0.6;
    target.current.copy(t);
    camera.fov = FOV;
    camera.updateProjectionMatrix();
  }, [camera, size]);

  // Tween to the pose of the current station (also re-fits on resize).
  React.useEffect(() => {
    if (!entered) return;
    const aspect = size.width / size.height;
    const sheet = compact && station !== "home";
    let pose;
    if (station === "home") pose = homePose(aspect);
    else if (sheet) {
      // Fit the object in the visible strip (same width, a fraction of the
      // height), then aim below it so it sits in that strip instead of the
      // middle of the screen. (A projection view offset would be simpler, but
      // drei's <Html transform> ignores it and the screens drift.)
      const surface = SURFACES[station];
      const halfTan = Math.tan(THREE.MathUtils.degToRad(FOV) / 2);
      const fov = THREE.MathUtils.radToDeg(2 * Math.atan(halfTan * SHEET_VISIBLE));
      pose = framePose(surface, fov, aspect / SHEET_VISIBLE);
      const dist = pose.position.distanceTo(pose.target);
      const view = surface.normal.clone().negate();
      const up = new THREE.Vector3(0, 1, 0).addScaledVector(view, -view.y).normalize();
      const ndcY = 1 - SHEET_VISIBLE; // centre of the strip, in NDC
      pose.target.addScaledVector(up, -dist * halfTan * ndcY);
    } else pose = framePose(SURFACES[station], FOV, aspect);
    const duration = reducedMotion ? 0 : 1.4;
    const ease = "power3.inOut";
    const tweens = [
      gsap.to(base.current, { x: pose.position.x, y: pose.position.y, z: pose.position.z, duration, ease }),
      gsap.to(target.current, { x: pose.target.x, y: pose.target.y, z: pose.target.z, duration, ease }),
    ];
    if (station !== "home") {
      look.current.toYaw = 0;
      look.current.toPitch = 0;
    }
    return () => tweens.forEach((t) => t.kill());
  }, [station, entered, size.width, size.height, reducedMotion, compact]);

  // Drag to look around (home view only).
  React.useEffect(() => {
    const el = gl.domElement;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const move = (e: PointerEvent) => {
      if (!dragging || station !== "home") return;
      const l = look.current;
      l.toYaw = THREE.MathUtils.clamp(l.toYaw - ((e.clientX - lastX) / size.width) * 1.6, -MAX_YAW, MAX_YAW);
      l.toPitch = THREE.MathUtils.clamp(l.toPitch + ((e.clientY - lastY) / size.height) * 0.8, -MAX_PITCH, MAX_PITCH);
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const up = () => {
      dragging = false;
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [gl, station, size.width, size.height]);

  const offset = React.useMemo(() => new THREE.Vector3(), []);
  const spherical = React.useMemo(() => new THREE.Spherical(), []);

  useFrame((_, delta) => {
    const l = look.current;
    const k = reducedMotion ? 1 : 1 - Math.exp(-delta * 6);
    l.yaw += (l.toYaw - l.yaw) * k;
    l.pitch += (l.toPitch - l.pitch) * k;

    offset.copy(base.current).sub(target.current);
    spherical.setFromVector3(offset);
    spherical.theta += l.yaw;
    spherical.phi = THREE.MathUtils.clamp(spherical.phi + l.pitch, 0.05, Math.PI - 0.05);
    offset.setFromSpherical(spherical);
    camera.position.copy(target.current).add(offset);
    camera.lookAt(target.current);
  });

  return null;
}
