"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
  speed?: number; // seconds for one full cycle
}

export function Marquee({
  children,
  className,
  pauseOnHover = true,
  direction = "left",
  speed = 30,
}: MarqueeProps) {
  const [animationDuration, setAnimationDuration] = useState(`${speed}s`);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAnimationDuration(`${speed}s`);
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "group flex overflow-hidden p-1 [--gap:1rem] gap-[var(--gap)]",
        className,
      )}
    >
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex shrink-0 gap-[var(--gap)] animate-marquee",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
          )}
          style={{
            animationDuration,
            animationDirection: direction === "right" ? "reverse" : "normal",
          }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
