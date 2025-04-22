
import React, { useEffect, useRef } from 'react';

export const StarryBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const stars: { x: number; y: number; radius: number; color: string; alpha: number; speed: number }[] = [];
    let animationFrameId: number;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars.length = 0;
      const starCount = Math.floor((canvas.width * canvas.height) / 8000);
      
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 1.5;
        const color = `rgba(${180 + Math.random() * 75}, ${180 + Math.random() * 75}, ${250}, 1)`;
        const alpha = 0.1 + Math.random() * 0.9;
        const speed = 0.005 + Math.random() * 0.01;
        
        stars.push({ x, y, radius, color, alpha, speed });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach(star => {
        // Update star alpha for twinkling effect
        star.alpha += star.speed;
        if (star.alpha > 1) {
          star.alpha = 0;
          star.speed = 0.005 + Math.random() * 0.01;
        }
        
        // Draw the star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color.replace('1)', `${star.alpha})`);
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};
