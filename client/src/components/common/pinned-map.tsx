import { cn } from "@/lib/utils";
import React from "react";

type Coord = [number, number];

interface PinnedMapProps {
  className?: string;
  coords: Coord[]; // Array of [lng, lat] pairs
}

/**
 * Returns a Google Maps embed link for the first coordinate.
 * No API key is needed for basic embed.
 */
const getGoogleMapsEmbedSrc = (coords: Coord[]): string => {
  let lat = 28.6129;
  let lng = 77.2118;

  if (coords && coords[0] && !isNaN(coords[0][0]) && !isNaN(coords[0][1])) {
    lng = coords[0][0];
    lat = coords[0][1];
  }

  // Embed with marker. The query param "q" marks the point on Google Maps.
  return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
};

const PinnedMap: React.FC<PinnedMapProps> = ({ className = "", coords }) => {
  const embedSrc = getGoogleMapsEmbedSrc(coords);
  const viewLink = `https://maps.google.com/?q=${
    coords && coords[0] ? `${coords[0][1]},${coords[0][0]}` : "28.6129,77.2118"
  }`;

  return (
    <div
      className={cn(
        "w-full h-full min-h-[300px] rounded-lg overflow-hidden relative bg-muted",
        className
      )}
      style={{ position: "relative" }}
    >
      <iframe
        title="Google Map Location"
        src={embedSrc}
        width="100%"
        height="100%"
        className="absolute top-0 left-0 w-full h-full z-0"
        style={{
          border: 0,
          minHeight: 300,
        }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
      {/* Overlay for link (optional, can be removed if you want just the map) */}
      <a
        href={viewLink}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-primary text-lg font-semibold bg-white/80 rounded-md px-4 py-2 shadow-lg hover:bg-white/90 backdrop-blur-[4px] border border-gray-100"
        style={{ textDecoration: "none", cursor: "pointer" }}
        title="Open location in Google Maps"
      >
        View location on Google Maps
      </a>
    </div>
  );
};

export { PinnedMap };
