// src/components/AnimatedBackground.jsx

import React, { useEffect, useRef } from "react";

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 9000);
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
      }
    };

    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      color: getRandomColor(),
      velocity: {
        x: (Math.random() - 0.5) * 0.5,
        y: (Math.random() - 0.5) * 0.5,
      },
      opacity: Math.random() * 0.5 + 0.1,
    });

    const getRandomColor = () => {
      const colors = [
        "rgba(139, 92, 246, 0.5)", // Purple
        "rgba(236, 72, 153, 0.5)", // Pink
        "rgba(239, 68, 68, 0.5)", // Red
        "rgba(16, 185, 129, 0.5)", // Green
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    const drawParticle = (particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.opacity;
      ctx.fill();
    };

    const updateParticle = (particle) => {
      particle.x += particle.velocity.x;
      particle.y += particle.velocity.y;

      if (particle.x < 0 || particle.x > canvas.width)
        particle.velocity.x *= -1;
      if (particle.y < 0 || particle.y > canvas.height)
        particle.velocity.y *= -1;
    };

    const drawGradientOverlay = () => {
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height,
      );
      gradient.addColorStop(0, "rgba(17, 24, 39, 0.7)");
      gradient.addColorStop(1, "rgba(88, 28, 135, 0.7)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGradientOverlay();

      particles.forEach((particle) => {
        drawParticle(particle);
        updateParticle(particle);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ pointerEvents: "none" }}
    />
  );
};

export default AnimatedBackground;
