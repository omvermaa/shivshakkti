"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocation, Link as RouterLink } from "react-router-dom";
import logoImage from "../assets/logo.jpeg";
import moonGif from "../assets/moon.gif";
import Navigation from "./Navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function LandingClient() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#1a1a1a] font-serif selection:bg-white/30">
      {/* --- BACKGROUND (CLOUDS) --- */}
      {/* The scale-[1.5] and blur creates the illusion of pushing through the clouds */}
      <div
        className={`absolute inset-0 z-0 transition-all duration-[2500ms] ease-in-out origin-center ${
          isRevealed
            ? "scale-[1.5] blur-[4px] opacity-40"
            : "scale-100 opacity-80 blur-none"
        }`}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full pointer-events-none"
        >
          <source
            src="https://video.wixstatic.com/video/94a491_1e3d8c9a15de4dc098640bf081c4052e/1080p/mp4/file.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Subtle dark gradient overlay to make text pop */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/20 via-transparent to-black/70 pointer-events-none"></div>

      {/* --- INITIAL STATE (LOGO) --- */}
      {/* Gently fades out and floats upwards when clicked */}
      <div
        className={`absolute inset-0 z-20 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
          isRevealed
            ? "opacity-0 -translate-y-12 pointer-events-none"
            : "opacity-100 translate-y-0"
        }`}
      >
        <p className="mb-6 text-xs md:text-sm tracking-[0.25em] text-white/80 uppercase drop-shadow-md text-center px-4">
          Click the Logo
        </p>

        <button
          onClick={() => setIsRevealed(true)}
          className="flex flex-col items-center w-full gap-6 px-2 transition-transform duration-500 hover:scale-105 group focus:outline-none"
        >
          <div className="w-56 h-56 md:w-64 md:h-64 bg-transparent border-[1px] border-white/20 rounded-full flex flex-col items-center justify-center pointer-events-auto cursor-pointer hover:border-white/50 transition-all duration-500 hover:scale-105">
            <img
              src={logoImage.src}
              alt="ShivShakti Tarot"
              className="w-44 h-44 md:w-64 md:h-64 rounded-full object-cover border-2 border-primary/30"
              style={{
                boxShadow: "var(--shadow-heavy)",
              }}
            />
          </div>

          <h1 className="text-3xl md:text-3xl tracking-[0.1em] md:tracking-[0.2em] text-white uppercase drop-shadow-lg text-center px-0 md:px-4 w-full">
            ShivShakkti
          </h1>
        </button>
      </div>

      {/* --- REVEALED STATE (CONTENT) --- */}
      {/* Fades in smoothly from the center as the clouds push past */}
      <div
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center transition-all duration-[1500ms] ease-out ${
          isRevealed
            ? "scale-100 opacity-100 delay-[600ms]"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center w-full -mt-20 px-0 md:px-8">
          <p className="mb-4 text-xs sm:text-lg md:text-xl tracking-[0.2em] md:tracking-[0.3em] text-white/90 uppercase drop-shadow-md text-center">
            Stop . Breathe . Heal
          </p>
          <h2 className="text-[12vw] sm:text-6xl md:text-8xl font-bold tracking-normal md:tracking-[0.1em] text-white uppercase text-center drop-shadow-2xl leading-tight md:leading-none w-full">
            ShivShakkti
            <span className="block mt-1 md:mt-2 text-[9vw] sm:text-5xl md:text-7xl">
              Tarot
            </span>
          </h2>
        </div>

        {/* Bottom Action Buttons */}
        <div className="absolute flex flex-row mb-10 items-center justify-center w-full gap-1 sm:gap-4 md:gap-8 px-0 sm:px-4 md:px-8 bottom-8 md:bottom-16">
          <Link
            href="/shop"
            className="flex-1 md:flex-none px-0 py-3 sm:px-8 sm:py-4 md:py-3 text-full md:text-base font-semibold tracking-wider sm:tracking-widest text-white uppercase transition-all duration-300 border rounded-[30px] bg-black/30 border-white/40 backdrop-blur-md hover:bg-white/20 hover:border-white text-center whitespace-nowrap"
          >
            Shop Online
          </Link>

          {/* Decorative Moon Element between buttons to match the aesthetic */}
          <div onClick={() => setNavOpen(true)} className="flex items-center justify-center w-22 h-22 sm:w-16 sm:h-16 md:w-32 md:h-32 transition-opacity opacity-70 hover:opacity-100 cursor-pointer flex-shrink-0">
            {/* Make sure to download the moon.png from your Wix site and place it in your Next.js /public folder */}
            <img
              src={moonGif.src}
              width="100%"
              height="100%"
              alt="Open Navigation"
              className="object-contain w-full h-full drop-shadow-lg rounded-full mix-blend-screen"
            />
          </div>

          <Link
            href="/store"
            className="flex-1 md:flex-none px-0 py-3 sm:px-8 sm:py-4 md:py-3 text-full md:text-base font-semibold tracking-wider sm:tracking-widest text-white uppercase transition-all duration-300 border rounded-[30px] bg-black/30 border-white/40 backdrop-blur-md hover:bg-white/20 hover:border-white text-center whitespace-nowrap"
          >
            Visit Store
          </Link>
        </div>
      </div>
      <AnimatePresence>
        {navOpen && <Navigation onClose={() => setNavOpen(false)} />}
      </AnimatePresence>
    </main>
  );
}

// --- FROM app/pages/not-found.jsx ---
export const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <RouterLink to="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </RouterLink>
      </div>
    </div>
  );
};

// --- FROM app/pages/Index.jsx ---
const brandEase = [0.22, 1, 0.36, 1];

export const Index = () => {
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      className="relative min-h-screen bg-transparent overflow-hidden flex items-center justify-center"
      style={{ perspective: "1200px" }}
    >
      {/* Logo Threshold */}
      <AnimatePresence>
        {!revealed && (
          <motion.div
            key="logo"
            className="flex flex-col items-center gap-8 cursor-pointer select-none"
            onClick={() => setRevealed(true)}
            exit={{
              scale: 8,
              rotateY: 90,
              z: 1000,
              opacity: 0,
            }}
            transition={{ duration: 1.2, ease: brandEase }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              className="animate-pulse-glow"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.5, ease: brandEase }}
            >
              <img
                src={logoImage.src}
                alt="ShivShakti Tarot"
                className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-2 border-primary/30"
                style={{
                  boxShadow: "var(--shadow-heavy)",
                }}
              />
            </motion.div>
            <motion.p
              className="text-muted-foreground uppercase tracking-widest text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
            >
              Enter the portal
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Revealed Content */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            key="content"
            className="flex flex-col items-center gap-10 px-6 text-center"
            initial={{ opacity: 0, z: -200, scale: 0.95 }}
            animate={{ opacity: 1, z: 0, scale: 1 }}
            transition={{ duration: 1.8, delay: 0.3 }}
            exit={{
              scale: 0.95,
              opacity: 0,
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Small logo */}
            <motion.img
              src={logoImage.src}
              alt="ShivShakti Tarot"
              className="w-20 h-20 rounded-full object-cover border border-primary/30"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8, ease: brandEase }}
              style={{ boxShadow: "var(--shadow-heavy)" }}
            />

            {/* Tagline */}
            <motion.p
              className="text-muted-foreground uppercase tracking-widest text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              The geometry of destiny
            </motion.p>

            {/* Headline */}
            <motion.h1
              className="font-display text-5xl md:text-8xl font-medium uppercase tracking-[0.15em] text-copper-gradient leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1, ease: brandEase }}
            >
              ShivShakti
              <br />
              Tarot
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-muted-foreground max-w-md text-sm leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              A bridge between the ancient and the immediate.
              <br />
              Professional readings. Sacred artifacts.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8, ease: brandEase }}
            >
              <button className="btn-ritual">Shop Online</button>
              <button className="btn-ritual">Visit Store</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- FROM app/pages/Landing.jsx ---
function makeCloud(cx, cy, size, depth) {
  const puffs = [];
  
  // Real clouds have more varied, distributed shapes (wispier edges)
  const numPuffs = 25 + Math.floor(Math.random() * 15);
  
  for (let i = 0; i < numPuffs; i++) {
    // Spread horizontally significantly
    const ox = (Math.random() - 0.5) * size * 3.0;
    // Keep bottom relatively flat, vary top height
    const oy = (Math.random() - 0.8) * size * 0.8;
    
    // Taper off size towards the edges
    const distFromCenter = Math.abs(ox) / (size * 1.5);
    const maxR = size * Math.max(0.2, 1 - Math.pow(distFromCenter, 1.5));
    const r = maxR * (0.4 + Math.random() * 0.6);
    
    puffs.push({ ox, oy, r });
  }

  // Sort by size so largest are drawn first
  puffs.sort((a, b) => b.r - a.r);

  // Slow down the movement slightly for realism
  return { cx, cy, puffs, vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.05, parallaxDepth: depth, targetCx: cx, targetCy: cy };
}

function drawCloud(ctx, cloud, alpha, offsetX, offsetY) {
  if (alpha <= 0) return;
  ctx.save();
  
  // Use a global alpha for the entire cloud to control overall transparency
  ctx.globalAlpha = alpha;

  // Normal blending for realistic opacity (avoid glowing white intersections)
  ctx.globalCompositeOperation = 'source-over';

  cloud.puffs.forEach((p) => {
    const x = cloud.cx + p.ox + offsetX;
    const y = cloud.cy + p.oy + offsetY;
    const r = p.r;

    ctx.save();
    ctx.translate(x, y);
    // Stretch horizontally, squash vertically to simulate wind and strata
    ctx.scale(1.6, 0.7);

    // Sharper gradient stops for distinct cloud edges and a cohesive, clear shape
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    gradient.addColorStop(0, `rgba(255, 255, 255, 1)`);
    gradient.addColorStop(0.7, `rgba(255, 255, 255, 1)`);
    gradient.addColorStop(0.95, `rgba(255, 255, 255, 0.3)`);
    gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  ctx.restore();
}

function initClouds(w, h) {
  const layout = [
    { rx: -0.02, ry: 0.05,  size: 120, d: 0.2 },
    { rx: 0.15,  ry: -0.02, size: 140, d: 0.5 },
    { rx: 0.38,  ry: 0.04,  size: 115, d: 0.3 },
    { rx: 0.58,  ry: -0.05, size: 130, d: 0.7 },
    { rx: 0.78,  ry: 0.06,  size: 120, d: 0.4 },
    { rx: 0.96,  ry: 0.0,   size: 110, d: 0.6 },
    { rx: -0.04, ry: 0.28,  size: 105, d: 0.8 },
    { rx: 0.12,  ry: 0.32,  size: 100, d: 0.2 },
    { rx: 0.32,  ry: 0.25,  size: 118, d: 0.5 },
    { rx: 0.54,  ry: 0.30,  size: 108, d: 0.9 },
    { rx: 0.72,  ry: 0.26,  size: 125, d: 0.3 },
    { rx: 0.92,  ry: 0.32,  size: 105, d: 0.6 },
    { rx: 0.02,  ry: 0.55,  size: 112, d: 0.7 },
    { rx: 0.22,  ry: 0.60,  size: 100, d: 0.4 },
    { rx: 0.45,  ry: 0.55,  size: 115, d: 1.0 },
    { rx: 0.65,  ry: 0.60,  size: 108, d: 0.2 },
    { rx: 0.85,  ry: 0.58,  size: 118, d: 0.8 },
    { rx: 0.10,  ry: 0.82,  size: 120, d: 0.5 },
    { rx: 0.32,  ry: 0.88,  size: 110, d: 0.3 },
    { rx: 0.55,  ry: 0.84,  size: 125, d: 0.7 },
    { rx: 0.76,  ry: 0.88,  size: 115, d: 0.6 },
    { rx: 0.95,  ry: 0.82,  size: 108, d: 0.9 },
  ];
  return layout.map((l) =>
    makeCloud(l.rx * w, l.ry * h, l.size * 0.65 * (0.85 + Math.random() * 0.3), l.d)
  );
}

/** Compute where each cloud should settle on reveal — pushed out to the perimeter */
function computeTargets(clouds, w, h) {
  // Clear zone around center: ellipse with these half-axes
  const clearRx = w * 0.35;
  const clearRy = h * 0.32;
  clouds.forEach((cloud) => {
    // Calculate targets relative to current center
    const dx = cloud.cx - w / 2;
    const dy = cloud.cy - h / 2;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    // Normalised distance inside the clear ellipse
    const ex = dx / clearRx;
    const ey = dy / clearRy;
    const ellipseDist = Math.sqrt(ex * ex + ey * ey);
    if (ellipseDist < 1 && ellipseDist > 0) {
      // Inside clear zone — push outward until outside
      const scale = (1 / ellipseDist) * (1 + 0.25 + Math.random() * 0.2);
      cloud.targetCx = w / 2 + (dx / dist) * Math.abs(dx * scale);
      cloud.targetCy = h / 2 + (dy / dist) * Math.abs(dy * scale);
    } else {
      // Already outside — push a bit further for the parting effect
      const scale = 1.25 + Math.random() * 0.2;
      cloud.targetCx = w / 2 + dx * scale;
      cloud.targetCy = h / 2 + dy * scale;
    }
  });
}

export function Landing() {
  const [phase, setPhase] = useState("intro");
  const canvasRef = useRef(null);
  const cloudsRef = useRef([]);
  const animRef = useRef(0);
  const phaseRef = useRef("intro");
  const revealStartRef = useRef(0);
  const targetsSetRef = useRef(false);
  const rawMouseRef = useRef({ x: 0, y: 0 });
  const smoothMouseRef = useRef({ x: 0, y: 0 });
  const lastSizeRef = useRef({ w: 0, h: 0 });

  // Safely sync the phase state to the animation ref to avoid render-phase side effects
  useLayoutEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    if (phase === "fading") {
      const timer = setTimeout(() => {
        setPhase("revealed");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Scale the buffer for High-DPI displays while maintaining logical CSS size
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);

      if (cloudsRef.current.length === 0) {
        cloudsRef.current = initClouds(w, h);
      } else if (lastSizeRef.current.w > 0) {
        // Maintain relative cloud positions and targets on resize
        const scaleX = w / lastSizeRef.current.w;
        const scaleY = h / lastSizeRef.current.h;
        cloudsRef.current.forEach((cloud) => {
          cloud.cx *= scaleX;
          cloud.cy *= scaleY;
          cloud.targetCx *= scaleX;
          cloud.targetCy *= scaleY;
        });
      }

      lastSizeRef.current = { w, h };
      // Trigger target re-calculation for the new dimensions without resetting the timer
      targetsSetRef.current = false;
    };

    const onMouseMove = (e) => {
      rawMouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };

    function tick(t) {
      // Use logical dimensions for animation logic and clearing
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      // Smooth mouse
      const lerpSpeed = 0.045;
      smoothMouseRef.current.x += (rawMouseRef.current.x - smoothMouseRef.current.x) * lerpSpeed;
      smoothMouseRef.current.y += (rawMouseRef.current.y - smoothMouseRef.current.y) * lerpSpeed;

      const isRevealed = phaseRef.current === "revealed";

      // Set cloud targets once on first reveal tick
      if (isRevealed && !targetsSetRef.current) {
        computeTargets(cloudsRef.current, w, h);
        targetsSetRef.current = true;
        if (revealStartRef.current === 0) {
          revealStartRef.current = t;
        }
      }

      const elapsed = revealStartRef.current ? (t - revealStartRef.current) / 1000 : 0;
      const progress = Math.min(elapsed / 3.8, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -9 * progress);

      ctx.clearRect(0, 0, w, h);

      // Solid sky fill during intro to hide content below; fades once revealed
      const bgAlpha = isRevealed ? Math.max(0, 1 - eased * 1.6) : 1;
      if (bgAlpha > 0) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, `rgba(51, 65, 85, ${bgAlpha})`);
        bg.addColorStop(1, `rgba(15, 23, 42, ${bgAlpha})`);
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);
      }

      const maxParallax = 55;
      const clearRx = w * 0.35;
      const clearRy = h * 0.32;

      cloudsRef.current.forEach((cloud) => {
        const px = smoothMouseRef.current.x * maxParallax * cloud.parallaxDepth;
        const py = smoothMouseRef.current.y * maxParallax * cloud.parallaxDepth * 0.6;

        if (isRevealed) {
          if (progress < 1) {
            // Animate toward target (parting motion)
            cloud.cx += (cloud.targetCx - cloud.cx) * eased * 0.055;
            cloud.cy += (cloud.targetCy - cloud.cy) * eased * 0.055;
          } else {
            // Settled: gentle drift with soft repulsion from the clear center zone
            cloud.cx += cloud.vx;
            cloud.cy += cloud.vy;

            // Soft repulsion to keep clouds out of the clear ellipse
            const dx = cloud.cx - w / 2;
            const dy = cloud.cy - h / 2;
            const ex = dx / clearRx;
            const ey = dy / clearRy;
            const ellipseDist = Math.sqrt(ex * ex + ey * ey);
            if (ellipseDist < 1.1) {
              const push = (1.1 - ellipseDist) * 1.8;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              cloud.cx += (dx / dist) * push;
              cloud.cy += (dy / dist) * push;
            }

            // Wrap — but keep away from dead center to avoid reappearing there
            const margin = 280;
            if (cloud.cx < -margin) cloud.cx = w + margin;
            if (cloud.cx > w + margin) cloud.cx = -margin;
            if (cloud.cy < -margin) cloud.cy = h + margin;
            if (cloud.cy > h + margin) cloud.cy = -margin;
          }
        } else {
          // Intro: slow drift + wrap
          cloud.cx += cloud.vx;
          cloud.cy += cloud.vy;
          const margin = 300;
          if (cloud.cx < -margin) cloud.cx = w + margin;
          if (cloud.cx > w + margin) cloud.cx = -margin;
          if (cloud.cy < -margin) cloud.cy = h + margin;
          if (cloud.cy > h + margin) cloud.cy = -margin;
        }

        drawCloud(ctx, cloud, 1, px, py);
      });

      animRef.current = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    animRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [phase]);

  const handleLogoClick = () => {
    if (phase === "intro") {
      setPhase("fading");
    }
  };

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #334155 0%, #0f172a 100%)" }}
    >
      {/* Revealed content — behind clouds on intro, in front on revealed */}
      <div className="fixed inset-0 flex flex-col items-center justify-center" style={{ zIndex: phase === "revealed" ? 3 : 1 }}>
        <div className="relative flex flex-col items-center text-center px-6 gap-5 max-w-5xl w-full">
          <p style={{ fontFamily: "Georgia, serif", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", fontSize: "clamp(0.7rem,1.4vw,0.95rem)" }}>
            Seek . Divine . Transcend
          </p>
          <div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(3.5rem,12vw,9rem)", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", lineHeight: 1, color: "#ffffff", textShadow: "2px 4px 30px rgba(255,255,255,0.15)" }}>
              ShivShakti
            </h1>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem,6vw,5rem)", fontWeight: 700, letterSpacing: "0.55em", textTransform: "uppercase", lineHeight: 1.1, marginTop: "0.2em", color: "#e5e7eb", textShadow: "1px 2px 20px rgba(255,255,255,0.1)" }}>
              Tarot
            </h2>
          </div>
          <div className="flex items-center gap-6 md:gap-10 mt-2">
            <button
              style={{ padding: "0.75rem 2.4rem", borderRadius: "9999px", background: "rgba(255,255,255,0.05)", color: "#f0d898", border: "1.5px solid rgba(255,255,255,0.15)", fontFamily: "Georgia, serif", letterSpacing: "0.2em", fontSize: "0.8rem", textTransform: "uppercase", cursor: "pointer", backdropFilter: "blur(8px)", boxShadow: "0 4px 30px rgba(0,0,0,0.4)", transition: "transform 0.5s, background 0.3s" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Shop Online
            </button>
            <div style={{ width: "clamp(56px,6.2vw,84px)", height: "clamp(56px,6.2vw,84px)", borderRadius: "50%", flexShrink: 0, background: "radial-gradient(circle at 38% 36%, #ffe4a0 0%, #d4940a 40%, #7a4800 75%, #1a0800 100%)", boxShadow: "0 0 28px rgba(200,100,0,0.4), inset -3px -3px 10px rgba(0,0,0,0.5), inset 3px 3px 8px rgba(255,220,100,0.25)" }} />
            <button
              style={{ padding: "0.75rem 2.4rem", borderRadius: "9999px", background: "rgba(255,255,255,0.05)", color: "#f0d898", border: "1.5px solid rgba(255,255,255,0.15)", fontFamily: "Georgia, serif", letterSpacing: "0.2em", fontSize: "0.8rem", textTransform: "uppercase", cursor: "pointer", backdropFilter: "blur(8px)", boxShadow: "0 4px 30px rgba(0,0,0,0.4)", transition: "transform 0.5s, background 0.3s" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Visit Store
            </button>
          </div>
        </div>
      </div>

      {/* Cloud canvas — z-2, above content */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full block" style={{ zIndex: 2 }} />

      {/* Intro overlay — z-10, fades out on click */}
      <div
        className="fixed inset-0 flex flex-col items-center justify-center"
        style={{
          zIndex: 10,
          transition: "opacity 0.5s ease-out",
          opacity: phase === "intro" ? 1 : 0,
          pointerEvents: phase === "intro" ? "auto" : "none",
        }}
      >
        <div className="flex flex-col items-center gap-4 cursor-pointer select-none" onClick={handleLogoClick}>
          <p style={{ fontFamily: "Georgia, serif", letterSpacing: "0.35em", color: "#d1d5db", fontSize: "0.8rem", textTransform: "uppercase" }}>
            Click the Logo
          </p>
          <div className="relative" style={{ width: "clamp(165px, 19vw, 235px)", height: "auto", aspectRatio: "1 / 1" }}>
            <Image
              src={logoImage}
              alt="ShivShakti Tarot"
              fill
              className="relative aspect-square rounded-full object-contain"
              style={{ transition: "transform 0.5s" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          <p className="absolute top-72" style={{ fontFamily: "Georgia, serif", letterSpacing: "0.35em", color: "#d1d5db", fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase"}}>
            ShivShakti Tarot
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}