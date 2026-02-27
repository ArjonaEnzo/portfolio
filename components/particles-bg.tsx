"use client";
import { useEffect, useRef } from "react";
import { useTheme } from "@/context/theme-context";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
};

const COUNT = 28;

export default function ParticlesBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener("resize", setSize);

    // Soft violet in both modes; slightly deeper in dark
    const rgb = theme === "dark" ? "109, 40, 217" : "139, 92, 246";

    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.10,
      vy: (Math.random() - 0.5) * 0.10,
      r: Math.random() * 1.0 + 0.3,
      alpha: Math.random() * 0.08 + 0.02,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        else if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        else if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${p.alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setSize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}
