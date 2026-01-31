/**
 * Google Maps Embed Component
 * Free embedded map with marker at ChinaTop location
 */

import { cn } from "@/lib/utils";

interface MapViewProps {
  className?: string;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  onMapReady?: (map: any) => void;
}

export function MapView({
  className,
}: MapViewProps) {
  // Use place search URL with address - this shows a red marker on the location
  const address = "Жаманбаева 8/2, Бишкек, Кыргызстан";
  const encodedAddress = encodeURIComponent(address);

  // This URL format shows a marker at the searched location
  const embedUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=17&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className={cn("w-full h-[500px] rounded-2xl overflow-hidden shadow-xl", className)}>
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="ChinaTop - Жаманбаева 8/2, Бишкек, Кыргызстан"
      />
    </div>
  );
}
