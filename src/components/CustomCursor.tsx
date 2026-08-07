import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [ringPosition, setRingPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    let frameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.closest('.interactive') ||
          target.getAttribute('role') === 'button' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Smooth lag ring interpolation loop
    const followCursor = () => {
      setRingPosition((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.25,
        y: prev.y + (position.y - prev.y) * 0.25,
      }));
      frameId = requestAnimationFrame(followCursor);
    };

    frameId = requestAnimationFrame(followCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(frameId);
    };
  }, [position.x, position.y]);

  return (
    <>
      {/* Center dot */}
      <div
        className="fixed pointer-events-none z-[9999] rounded-full transition-transform duration-75 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isHovered ? '10px' : '8px',
          height: isHovered ? '10px' : '8px',
          backgroundColor: '#00daf3',
          boxShadow: '0 0 10px #00daf3',
          transform: `translate(-50%, -50%) scale(${isMouseDown ? 0.8 : 1})`,
        }}
      />

      {/* Lagging Ring */}
      <div
        className="fixed pointer-events-none z-[9998] rounded-full transition-all duration-300 ease-out"
        style={{
          left: `${ringPosition.x}px`,
          top: `${ringPosition.y}px`,
          width: isHovered ? '54px' : '32px',
          height: isHovered ? '54px' : '32px',
          border: isHovered ? '1px solid rgba(0, 227, 253, 0.8)' : '1px solid rgba(0, 218, 243, 0.4)',
          backgroundColor: isHovered ? 'rgba(0, 227, 253, 0.08)' : 'transparent',
          transform: `translate(-50%, -50%) scale(${isMouseDown ? 1.2 : 1})`,
        }}
      />
    </>
  );
};
