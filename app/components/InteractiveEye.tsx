"use client";

import { useEffect, useRef, useState } from "react";

interface InteractiveEyeProps {
  className?: string;
  accentColor?: string; // Color of the outer ring & eyelid bar (defaults to #ff1a53)
  pupilColor?: string;  // Color of the pupil (defaults to #1c1e1d)
  bgColor?: string;     // Color matching the page background (defaults to #f0f3e8)
}

export default function InteractiveEye({
  className = "",
  accentColor = "#ff1a53",
  pupilColor = "#1c1e1d",
  bgColor = "#f0f3e8",
}: InteractiveEyeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pupilRef = useRef<SVGCircleElement>(null);
  const eyelidRef = useRef<SVGGElement>(null);
  const [isBlinking, setIsBlinking] = useState(false);

  // Position interpolation state for 60fps buttery movement
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const animFrameId = useRef<number | null>(null);

  // Handle cursor / touch coordinates
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const dist = Math.hypot(dx, dy);

      // Max pupil travel radius inside the eye (in SVG coordinate units)
      const maxDistance = 46;
      const angle = Math.atan2(dy, dx);
      const intensity = Math.min(dist * 0.16, maxDistance);

      targetPos.current = {
        x: Math.cos(angle) * intensity,
        y: Math.sin(angle) * intensity,
      };
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onReset = () => {
      targetPos.current = { x: 0, y: 0 };
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mouseleave", onReset);
    window.addEventListener("touchend", onReset);

    // Smooth lerp render loop
    const render = () => {
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.12;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.12;

      if (pupilRef.current) {
        pupilRef.current.setAttribute(
          "transform",
          `translate(${currentPos.current.x.toFixed(2)}, ${currentPos.current.y.toFixed(2)})`
        );
      }

      if (eyelidRef.current) {
        // The upper eyelid & horizontal dividing bar move with vertical gaze (35% factor).
        // This ensures looking "up" lifts the upper eyelid mask to reveal the eyeball/pupil,
        // and looking "down" slightly droops the eyelid naturally.
        const eyelidY = (currentPos.current.y * 0.35).toFixed(2);
        eyelidRef.current.setAttribute("transform", `translate(0, ${eyelidY})`);
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    // Natural occasional micro-blink
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.4) {
        triggerBlink();
      }
    }, 4500);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseleave", onReset);
      window.removeEventListener("touchend", onReset);
      clearInterval(blinkInterval);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  const triggerBlink = () => {
    setIsBlinking(true);
    setTimeout(() => setIsBlinking(false), 200);
  };

  return (
    <div
      ref={containerRef}
      onClick={triggerBlink}
      className={`relative select-none cursor-pointer transition-transform duration-150 ease-out active:scale-95 ${className}`}
      style={{
        transform: isBlinking ? "scaleY(0.08)" : "scaleY(1)",
        transformOrigin: "center center",
        transitionProperty: "transform",
      }}
      title="Click me!"
    >
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full drop-shadow-sm overflow-hidden"
      >
        <defs>
          {/* Inner boundary clip so the pupil and eyelids never exceed the outer ring */}
          <clipPath id="inner-eye-clip">
            <circle cx="200" cy="200" r="162" />
          </clipPath>
        </defs>

        {/* 1. Eye White / Canvas Fill */}
        <circle cx="200" cy="200" r="162" fill={bgColor} />

        {/* 2. Pupil Layer (Tracked and bounded inside the circle) */}
        <g clipPath="url(#inner-eye-clip)">
          <circle
            ref={pupilRef}
            cx="200"
            cy="200"
            r="56"
            fill={pupilColor}
          />
        </g>

        {/* 3. Animating Eyelid Group (Moves vertically when looking up/down) */}
        <g ref={eyelidRef} clipPath="url(#inner-eye-clip)">
          {/* Eyelid mask (Covers the top half so the pupil only peeks under the bar) */}
          <path
            d="M 38 200 A 162 162 0 0 1 362 200 Z"
            fill={bgColor}
          />

          {/* Horizontal Eyelid Bar */}
          <line
            x1="38"
            y1="200"
            x2="362"
            y2="200"
            stroke={accentColor}
            strokeWidth="26"
            strokeLinecap="round"
          />
        </g>

        {/* 4. Outer Circular Frame (Fixed foreground layer) */}
        <circle
          cx="200"
          cy="200"
          r="169"
          stroke={accentColor}
          strokeWidth="26"
          fill="none"
        />
      </svg>
    </div>
  );
}