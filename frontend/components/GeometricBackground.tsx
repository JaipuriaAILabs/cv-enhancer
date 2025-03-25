"use client"

import React, { useRef, useEffect, useState } from 'react';

const GeometricBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number, y: number } | null>(null);
  const [trail, setTrail] = useState<Array<{ x: number, y: number, opacity: number }>>([]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Grid configuration
    const gridSize = 40; // Size of each grid cell
    const lineWidth = 0.5;
    const lineColor = 'rgba(0, 0, 0, 0.1)';
    const hoverColor = 'rgba(239, 127, 26, 0.3)'; // Orange color with transparency
    const trailLength = 10; // Number of positions to keep in the trail
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Update mouse position
      setMousePos({ x, y });
      
      // Update trail
      setTrail(prevTrail => {
        // Add new position to the beginning of the trail
        const newTrail = [
          { x, y, opacity: 1 },
          ...prevTrail.map(point => ({ ...point, opacity: point.opacity * 0.99 }))
        ].slice(0, trailLength);
        
        return newTrail;
      });
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    
    const drawGrid = () => {
      if (!canvas || !ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid lines
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = lineColor;
      
      // Draw vertical lines
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Draw horizontal lines
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Add subtle dots at intersections
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      for (let x = 0; x <= canvas.width; x += gridSize) {
        for (let y = 0; y <= canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      // Draw the trail (from oldest to newest)
      trail.slice().reverse().forEach(point => {
        const gridX = Math.floor(point.x / gridSize) * gridSize;
        const gridY = Math.floor(point.y / gridSize) * gridSize;
        
        ctx.fillStyle = `rgba(239, 127, 26, ${0.3 * point.opacity})`;
        ctx.fillRect(gridX, gridY, gridSize, gridSize);
      });
      
      // Draw the current hover square last (for highest visibility)
      if (mousePos) {
        const hoverGridX = Math.floor(mousePos.x / gridSize) * gridSize;
        const hoverGridY = Math.floor(mousePos.y / gridSize) * gridSize;
        
        ctx.fillStyle = hoverColor;
        ctx.fillRect(hoverGridX, hoverGridY, gridSize, gridSize);
      }
    };
    
    const animate = () => {
      drawGrid();
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mousePos, trail]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-40"
    />
  );
};

export default GeometricBackground;