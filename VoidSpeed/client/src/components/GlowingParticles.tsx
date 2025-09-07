
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  glowIntensity: number;
  velocityX: number;
  velocityY: number;
}

interface GlowingParticlesProps {
  particleCount?: number;
  className?: string;
  color?: string;
  maxSize?: number;
  minSize?: number;
}

export default function GlowingParticles({
  particleCount = 150,
  className = "fixed inset-0 z-0 pointer-events-none",
  color = "255, 255, 255",
  maxSize = 2.5,
  minSize = 0.5
}: GlowingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create particles
    const createParticles = () => {
      particlesRef.current = [];

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * (maxSize - minSize) + minSize,
          opacity: Math.random() * 0.7 + 0.3,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          glowIntensity: Math.random() * 0.5 + 0.3,
          velocityX: (Math.random() - 0.5) * 0.2,
          velocityY: (Math.random() - 0.5) * 0.2,
        });
      }
    };

    createParticles();

    // Animation loop
    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.016;

      particlesRef.current.forEach((particle) => {
        // Calculate twinkling opacity
        const twinkle = Math.sin(time * particle.twinkleSpeed * 100) * 0.3 + 0.7;
        const currentOpacity = particle.opacity * twinkle;

        // Draw particle glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        gradient.addColorStop(0, `rgba(${color}, ${currentOpacity})`);
        gradient.addColorStop(0.5, `rgba(${color}, ${currentOpacity * 0.3})`);
        gradient.addColorStop(1, `rgba(${color}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw particle core
        ctx.fillStyle = `rgba(${color}, ${currentOpacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Update position with floating movement
        particle.x += particle.velocityX + Math.sin(time * 0.5 + particle.y * 0.01) * 0.1;
        particle.y += particle.velocityY + Math.cos(time * 0.3 + particle.x * 0.01) * 0.05;

        // Wrap around screen
        if (particle.x > canvas.width + 10) particle.x = -10;
        if (particle.x < -10) particle.x = canvas.width + 10;
        if (particle.y > canvas.height + 10) particle.y = -10;
        if (particle.y < -10) particle.y = canvas.height + 10;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particleCount, color, maxSize, minSize]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ background: "transparent" }}
    />
  );
}
