import type { ReactNode } from "react";

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
  return (
    <div
      className={`group overflow-hidden rounded-lg border bg-surface shadow-card transition-all duration-200 ${
        gold
          ? "border-gold/30 hover:shadow-glow-gold"
          : "border-line hover:shadow-hover hover:border-accent/30"
      }`}
    >
      <div className={`relative ${aspect} overflow-hidden bg-pearl`}>
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
  );
}
