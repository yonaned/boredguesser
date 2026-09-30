"use client";

import { useEffect, useId, useRef } from "react";

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

  // Safe unique ID for SVG clip path (sanitized for SVG url references)
  const rawId = useId();
  const clipId = `eye-inner-clip-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  // Position interpolation state for 60fps movement
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const animFrameId = useRef<number | null>(null);

  // Blink timing state
  const blinkStartTime = useRef<number | null>(null);

  const triggerBlink = () => {
    blinkStartTime.current = performance.now();
  };

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

    // Smooth render loop
    const render = (time: number) => {
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.12;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.12;

      // 1. Move pupil
      if (pupilRef.current) {
        pupilRef.current.setAttribute(
          "transform",
          `translate(${currentPos.current.x.toFixed(2)}, ${currentPos.current.y.toFixed(2)})`
        );
      }

      // 2. Calculate blink progress (0 = fully open, 1 = fully shut)
      let blinkAmount = 0;
      if (blinkStartTime.current !== null) {
        const elapsed = time - blinkStartTime.current;
        const blinkDuration = 220;
        if (elapsed < blinkDuration) {
          const t = elapsed / blinkDuration;
          if (t < 0.35) {
            blinkAmount = Math.sin((t / 0.35) * (Math.PI / 2));
          } else {
            blinkAmount = Math.cos(((t - 0.35) / 0.65) * (Math.PI / 2));
          }
        } else {
          blinkStartTime.current = null;
        }
      }

      // 3. Eyelid position:
      // Looking up lifts eyelid (-y), looking down droops it (+y)
      const gazeLidY = currentPos.current.y * 0.45;
      
      // When closed during blink, slide the lid down to y = 145 (covers the pupil)
      const closedLidY = 145;
      const finalLidY = gazeLidY + blinkAmount * (closedLidY - gazeLidY);

      if (eyelidRef.current) {
        eyelidRef.current.setAttribute(
          "transform",
          `translate(0, ${finalLidY.toFixed(2)})`
        );
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    // Natural occasional micro-blink
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.35) {
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

  return (
    // Outer circular container with overflow-hidden ensures nothing can ever bleed out
    <div
      ref={containerRef}
      onClick={triggerBlink}
      className={`relative aspect-square select-none cursor-pointer rounded-full overflow-hidden ${className}`}
      title="Click me to blink!"
    >
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full drop-shadow-sm select-none"
      >
        <defs>
          {/* Static inner clip boundary: radius 172 matches the inside of the outer ring */}
          <clipPath id={clipId}>
            <circle cx="200" cy="200" r="172" />
          </clipPath>
        </defs>

        {/* 1. Eye White / Canvas Fill */}
        <circle cx="200" cy="200" r="172" fill={bgColor} />

        {/* 2. Pupil Layer (Tracked and bounded inside the eye) */}
        <g clipPath={`url(#${clipId})`}>
          <circle
            ref={pupilRef}
            cx="200"
            cy="200"
            r="58"
            fill={pupilColor}
          />
        </g>

        {/* 3. Eyelid Layer:
               - The outer <g> holds the STATIC clipPath (so it never moves)
               - The inner <g ref={eyelidRef}> performs the vertical translation
        */}
        <g clipPath={`url(#${clipId})`}>
          <g ref={eyelidRef}>
            {/* Solid fill covering everything above the horizontal dividing line */}
            <rect
              x="0"
              y="-400"
              width="400"
              height="600"
              fill={bgColor}
            />

            {/* Horizontal dividing line - trimmed by the static clip into the circle */}
            <line
              x1="0"
              y1="200"
              x2="400"
              y2="200"
              stroke={accentColor}
              strokeWidth="28"
            />
          </g>
        </g>

        {/* 4. Outer Circular Frame (Drawn in the foreground on top of the edges) */}
        <circle
          cx="200"
          cy="200"
          r="186"
          stroke={accentColor}
          strokeWidth="28"
          fill="none"
        />
      </svg>
    </div>
  );
}