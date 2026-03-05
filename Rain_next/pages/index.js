import { useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';

const PARTICLES = ['🔥', '✨', '🌟', '💫', '⚡'];
const FALL_SPEED_BASE = 6;
const MOUSE_RADIUS = 110;

export default function Home() {
  const rainContainerRef = useRef(null);
  const mouseRingRef = useRef(null);
  const badgeRef = useRef(null);
  const emojiPositionsRef = useRef(new Set());
  const mouseRef = useRef({ x: -500, y: -500 });
  const animationFrameRef = useRef();
  const countRef = useRef(0);

  const updateBadge = useCallback(() => {
    if (badgeRef.current) badgeRef.current.textContent = `${countRef.current} particles`;
  }, []);

  const isOverlap = (newX) =>
    Array.from(emojiPositionsRef.current).some((x) => Math.abs(newX - x) < 36);

  const isNearMouse = (x, y) => {
    const dx = x - mouseRef.current.x;
    const dy = y - mouseRef.current.y;
    return dx * dx + dy * dy < MOUSE_RADIUS * MOUSE_RADIUS;
  };

  const updateEmojiPositions = useCallback(() => {
    if (rainContainerRef.current) {
      rainContainerRef.current.querySelectorAll('.particle').forEach((el) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        if (isNearMouse(cx, cy)) {
          const angle = Math.atan2(cy - mouseRef.current.y, cx - mouseRef.current.x);
          const push = MOUSE_RADIUS + 25;
          const nx = mouseRef.current.x + Math.cos(angle) * push;
          const ny = mouseRef.current.y + Math.sin(angle) * push;
          el.style.transform = `translate(${nx - cx}px,${ny - cy}px)`;
        } else {
          el.style.transform = '';
        }
      });
    }
    animationFrameRef.current = requestAnimationFrame(updateEmojiPositions);
  }, []);

  const createParticle = useCallback(() => {
    if (!rainContainerRef.current) return;
    const el = document.createElement('span');
    el.textContent = PARTICLES[Math.floor(Math.random() * PARTICLES.length)];
    el.classList.add('particle');

    const size = Math.floor(Math.random() * 24) + 18;
    el.style.fontSize = `${size}px`;

    let startX = Math.random() * window.innerWidth;
    let attempts = 0;
    while (isOverlap(startX) && attempts < 20) {
      startX = Math.random() * window.innerWidth;
      attempts++;
    }
    el.style.left = `${startX}px`;
    el.style.top = '-50px';

    const drift = ((Math.random() - 0.5) * 30).toFixed(1);
    el.style.setProperty('--drift', `${drift}px`);

    const spinDir = Math.random() > 0.5 ? 1 : -1;
    el.style.setProperty('--spin', `${spinDir * (Math.floor(Math.random() * 360) + 90)}deg`);

    const dur = (FALL_SPEED_BASE + Math.random() * 4).toFixed(2);
    el.style.animationDuration = `${dur}s`;

    rainContainerRef.current.appendChild(el);
    emojiPositionsRef.current.add(startX);
    countRef.current += 1;
    updateBadge();

    el.addEventListener('animationend', () => {
      el.remove();
      emojiPositionsRef.current.delete(startX);
      countRef.current = Math.max(0, countRef.current - 1);
      updateBadge();
    });
  }, [updateBadge]);

  // Throttle mouse ring update to avoid layout thrash
  const handleMouseMove = useCallback((e) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
    if (mouseRingRef.current) {
      // Use transform instead of left/top — stays on the GPU compositor layer
      mouseRingRef.current.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
    }
  }, []);

  const startRain = useCallback(
    () =>
      setInterval(() => {
        const n = Math.floor(Math.random() * 6) + 3;
        for (let i = 0; i < n; i++) createParticle();
      }, 160),
    [createParticle]
  );

  useEffect(() => {
    const iv = startRain();
    animationFrameRef.current = requestAnimationFrame(updateEmojiPositions);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearInterval(iv);
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rainContainerRef.current) rainContainerRef.current.innerHTML = '';
      emojiPositionsRef.current.clear();
    };
  }, [startRain, updateEmojiPositions, handleMouseMove]);

  return (
    <>
      <Head>
        <title>Fire Rain ✨</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="An interactive cinematic particle rain experience." />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@700;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Nebula blobs */}
      <div className="nebula nb1" />
      <div className="nebula nb2" />
      <div className="nebula nb3" />

      {/* Particle rain container */}
      <div ref={rainContainerRef} className="rain" />

      {/* Mouse repel ring — positioned via transform, never triggers React re-render */}
      <div ref={mouseRingRef} className="mouse-ring" />

      {/* HUD title card */}
      <div className="hud">
        <h1 className="hud-title">FIRE RAIN</h1>
        <p className="hud-sub">Move your mouse to repel the storm</p>
        <div ref={badgeRef} className="hud-badge">0 particles</div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;900&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: #050010;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'Outfit', sans-serif;
          cursor: none;
        }

        /* ── Animated nebula background ─────────────────────────── */
        .nebula {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
          animation: drift 18s ease-in-out infinite alternate;
          will-change: transform;
        }
        .nb1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(120,20,200,0.35) 0%, transparent 70%);
          top: -150px; left: -100px;
          animation-duration: 20s;
        }
        .nb2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(255,60,0,0.25) 0%, transparent 70%);
          bottom: -100px; right: -80px;
          animation-duration: 15s;
          animation-direction: alternate-reverse;
        }
        .nb3 {
          width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(0,120,255,0.18) 0%, transparent 70%);
          top: 40%; left: 45%;
          animation-duration: 25s;
        }
        @keyframes drift {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(60px, 40px) scale(1.12); }
        }

        /* ── Particle rain container ─────────────────────────────── */
        .rain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }

        /* ── Individual particles ────────────────────────────────── */
        .particle {
          position: absolute;
          animation: fall linear forwards;
          will-change: transform;
          user-select: none;
          filter: drop-shadow(0 0 6px rgba(255,120,0,0.8));
          transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes fall {
          0%   { transform: translateY(0)    translateX(0)                         rotate(0deg);                     opacity: 0;   }
          5%   { opacity: 1; }
          50%  { transform: translateY(48vh) translateX(var(--drift, 0))            rotate(calc(var(--spin,180deg)*0.5)); opacity: 0.9; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(108vh) translateX(calc(var(--drift,0)*2))   rotate(var(--spin,180deg));       opacity: 0;   }
        }

        /* ── Mouse repel ring (GPU-composited via transform) ─────── */
        .mouse-ring {
          position: fixed;
          top: 0; left: 0;
          width: ${MOUSE_RADIUS * 2}px;
          height: ${MOUSE_RADIUS * 2}px;
          border-radius: 50%;
          border: 2px solid rgba(255, 100, 30, 0.6);
          box-shadow: 0 0 18px 4px rgba(255,80,0,0.35), inset 0 0 18px 4px rgba(255,80,0,0.12);
          pointer-events: none;
          z-index: 3;
          will-change: transform;
          animation: ringPulse 2s ease-in-out infinite;
        }
        @keyframes ringPulse {
          0%, 100% { box-shadow: 0 0 18px 4px rgba(255,80,0,0.35), inset 0 0 18px 4px rgba(255,80,0,0.12); border-color: rgba(255,100,30,0.6); }
          50%       { box-shadow: 0 0 32px 8px rgba(255,80,0,0.55), inset 0 0 28px 8px rgba(255,80,0,0.2);  border-color: rgba(255,160,60,0.9); }
        }

        /* ── HUD title card ──────────────────────────────────────── */
        .hud {
          position: fixed;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 36px 52px 28px;
          background: rgba(10, 0, 25, 0.45);
          backdrop-filter: blur(18px) saturate(180%);
          -webkit-backdrop-filter: blur(18px) saturate(180%);
          border: 1px solid rgba(255, 100, 30, 0.25);
          border-radius: 24px;
          box-shadow: 0 0 60px rgba(200,60,0,0.25), 0 8px 40px rgba(0,0,0,0.6);
          animation: hudPop 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
          pointer-events: none;
        }
        @keyframes hudPop {
          0%   { opacity: 0; transform: scale(0.85) translateY(20px); }
          100% { opacity: 1; transform: scale(1)   translateY(0); }
        }

        .hud-title {
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 900;
          letter-spacing: 0.12em;
          background: linear-gradient(135deg, #ff8c00 0%, #ff2d55 45%, #bf37ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 20px rgba(255,60,0,0.6));
          animation: titleGlow 3s ease-in-out infinite alternate;
          line-height: 1;
        }
        @keyframes titleGlow {
          0%   { filter: drop-shadow(0 0 18px rgba(255,60,0,0.5)); }
          100% { filter: drop-shadow(0 0 36px rgba(255,60,0,0.9)) drop-shadow(0 0 70px rgba(200,0,255,0.4)); }
        }

        .hud-sub {
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,200,140,0.7);
        }

        .hud-badge {
          margin-top: 4px;
          padding: 4px 16px;
          border-radius: 999px;
          background: rgba(255,100,30,0.18);
          border: 1px solid rgba(255,100,30,0.4);
          color: rgba(255,180,90,0.9);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-variant-numeric: tabular-nums;
        }

        @media (prefers-reduced-motion: reduce) {
          .particle { animation-duration: 20s !important; }
          .nebula   { animation: none !important; }
        }
      `}</style>
    </>
  );
}