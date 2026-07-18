/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface FlowerParticlesRef {
  triggerBurst: (x?: number, y?: number) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  type: 'petal' | 'sparkle' | 'leaf';
  decay: number;
}

const PARTICLE_COLORS = {
  maroon: ['#5c0606', '#800a0a', '#4a0404', '#991b1b'],
  pink: ['#f43f5e', '#ec4899', '#fda4af', '#fbcfe8'],
  cream: ['#fff8e7', '#f5ebe0', '#fafaf9', '#fef3c7'],
  gold: ['#ffd700', '#d4af37', '#f59e0b', '#fbbf24', '#fef08a'],
  green: ['#16a34a', '#15803d', '#4ade80']
};

export const FlowerParticles = forwardRef<FlowerParticlesRef, { isActive?: boolean }>(
  ({ isActive = true }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const requestRef = useRef<number | null>(null);

    // Trigger a massive flower burst at a specific point
    const triggerBurst = (x?: number, y?: number) => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const spawnX = x !== undefined ? x : canvas.width / 2;
      const spawnY = y !== undefined ? y : canvas.height / 2;

      const burstParticles: Particle[] = [];

      // Spawns 120+ elements for "byurrrrr banyak bunga" effect
      for (let i = 0; i < 150; i++) {
        const angle = Math.random() * Math.PI * 2;
        // High initial velocity for explosion feel
        const speed = 2 + Math.random() * 12;
        const size = 6 + Math.random() * 14;

        // Choose random category
        const rand = Math.random();
        let type: 'petal' | 'sparkle' | 'leaf' = 'petal';
        let colorPalette = PARTICLE_COLORS.maroon;

        if (rand < 0.5) {
          type = 'petal';
          colorPalette = Math.random() < 0.6 ? PARTICLE_COLORS.maroon : PARTICLE_COLORS.pink;
        } else if (rand < 0.85) {
          type = 'sparkle';
          colorPalette = PARTICLE_COLORS.gold;
        } else {
          type = 'leaf';
          colorPalette = Math.random() < 0.3 ? PARTICLE_COLORS.green : PARTICLE_COLORS.cream;
        }

        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];

        burstParticles.push({
          x: spawnX,
          y: spawnY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5, // slightly upward bias
          alpha: 1,
          size,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.15,
          color,
          type,
          decay: 0.008 + Math.random() * 0.012
        });
      }

      particlesRef.current = [...particlesRef.current, ...burstParticles];
    };

    // Expose the triggerBurst function to parent components
    useImperativeHandle(ref, () => ({
      triggerBurst
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const handleResize = () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      };

      // Set initial dimensions
      handleResize();

      const resizeObserver = new ResizeObserver(() => handleResize());
      resizeObserver.observe(canvas);

      // Animation loop
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Spawn occasional ambient floating petals and gold glitters if active
        if (isActive && Math.random() < 0.06 && particlesRef.current.length < 150) {
          const type = Math.random() < 0.7 ? 'petal' : 'sparkle';
          const size = 5 + Math.random() * 8;
          const colorPalette = type === 'petal'
            ? (Math.random() < 0.5 ? PARTICLE_COLORS.maroon : PARTICLE_COLORS.pink)
            : PARTICLE_COLORS.gold;

          particlesRef.current.push({
            x: Math.random() * canvas.width,
            y: -20, // Spawn just above screen
            vx: -1 + Math.random() * 2,
            vy: 0.8 + Math.random() * 1.5, // Slow drift downwards
            alpha: 0.6 + Math.random() * 0.4,
            size,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.03,
            color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
            type: type as any,
            decay: 0.001 // Ambient floats last much longer
          });
        }

        // Update and draw all particles
        particlesRef.current = particlesRef.current.filter((p) => {
          // Physics
          p.x += p.vx;
          p.y += p.vy;
          
          // Apply horizontal drift / air resistance
          p.vx *= 0.98;
          // Apply light gravity for flowers
          if (p.type === 'petal' || p.type === 'leaf') {
            p.vy += 0.05;
          } else {
            p.vy += 0.01; // Gold glitter falls slower
          }
          
          p.rotation += p.rotationSpeed;
          p.alpha -= p.decay;

          if (p.alpha <= 0) return false;

          // Drawing
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.alpha;

          if (p.type === 'petal') {
            // Draw beautiful rose petal shape
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-p.size, -p.size / 2, -p.size, p.size, 0, p.size);
            ctx.bezierCurveTo(p.size, p.size, p.size, -p.size / 2, 0, 0);
            ctx.fillStyle = p.color;
            ctx.fill();

            // Highlight crease for realism
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(0, p.size * 0.5, 0, p.size);
            ctx.strokeStyle = 'rgba(255,255,255,0.15)';
            ctx.lineWidth = 1;
            ctx.stroke();

          } else if (p.type === 'sparkle') {
            // Draw a shiny 4-point star/diamond
            ctx.beginPath();
            ctx.moveTo(0, -p.size);
            ctx.quadraticCurveTo(0, 0, p.size, 0);
            ctx.quadraticCurveTo(0, 0, 0, p.size);
            ctx.quadraticCurveTo(0, 0, -p.size, 0);
            ctx.quadraticCurveTo(0, 0, 0, -p.size);
            ctx.fillStyle = p.color;
            ctx.fill();

          } else {
            // Draw small elliptical leaf/flower bud
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size * 0.8, p.size * 0.4, 0, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
          }

          ctx.restore();
          return true;
        });

        requestRef.current = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        resizeObserver.disconnect();
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
      };
    }, [isActive]);

    return (
      <canvas
        ref={canvasRef}
        id="flower-canvas"
        className="absolute inset-0 pointer-events-none z-30 w-full h-full"
      />
    );
  }
);

FlowerParticles.displayName = 'FlowerParticles';
