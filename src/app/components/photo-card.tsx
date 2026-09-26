"use client";

import type { ReactNode } from "react";
import { useCallback, useRef } from "react";

export function PhotoCard({
  imageUrl,
  alt = "",
  aspect = "aspect-[4/5]",
  footer,
  badge,
  gold = false,
}: {
  imageUrl: string | null;
  alt?: string;
  aspect?: string;
  footer?: ReactNode;
  badge?: ReactNode;
  gold?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(10px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0)";
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group glass ${gold ? "hof-glass" : ""}`}
    >
      <div className="glass-inner" style={{ padding: 0, overflow: "hidden" }}>
        <div
          className={`relative ${aspect} overflow-hidden`}
          style={{ background: "var(--color-pearl)" }}
        >
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={alt}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          )}
          {badge && <div className="absolute bottom-2 right-2">{badge}</div>}
        </div>
        {footer && <div className="p-4">{footer}</div>}
      </div>
    </div>
  );
}
