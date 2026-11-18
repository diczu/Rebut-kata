import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  alpha: number;
}

const COLORS = ['#0F766E', '#14B8A6', '#FACC15', '#EAB308', '#0D9488', '#FDE047'];

export function ConfettiCanvas({ active = true }: { active?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Particle[] = [];
    const spawnBurst = (count: number) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: -15 - Math.random() * 140,
          vx: (Math.random() - 0.5) * 4.5,
          vy: 2.2 + Math.random() * 4.2,
          size: 6 + Math.random() * 7,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.14,
          alpha: 0.95,
        });
      }
    };

    spawnBurst(110);
    const secondBurst = window.setTimeout(() => spawnBurst(70), 900);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.vx *= 0.995;
        p.rotation += p.vRot;

        if (p.y > canvas.height + 24) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65);
        ctx.restore();
      }

      if (particles.length > 0) {
        animId = window.requestAnimationFrame(tick);
      }
    };

    animId = window.requestAnimationFrame(tick);

    return () => {
      window.clearTimeout(secondBurst);
      window.cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40"
    />
  );
}
