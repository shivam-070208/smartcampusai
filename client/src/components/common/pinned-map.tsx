import { cn } from "@/lib/utils";
import React from "react";
/***********************************************************************************************
 *                                            TODO:                                            *
 * MAKE THIS MAP COMPONENT SUCHTHAT IT WILL GET LOCATION BY PROPS AND THEN MARK THOSE LOCATION *
 ***********************************************************************************************/
interface PinnedMapProps {
  className?: string;
}

const PinnedMap: React.FC<PinnedMapProps> = ({
  className = "",

}) => {

  const placeholderSrc =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14008.822242922432!2d77.2118!3d28.6129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3e0c9b3ee71%3A0x75667f182947734e!2sIndia%20Gate!5e0!3m2!1sen!2sin!4v1716273954677!5m2!1sen!2sin";

  return (
    <div className={cn("w-full h-full flex items-center justify-center bg-muted", className)}>
      <iframe
        title="Pinned Location (Placeholder)"
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: 300, borderRadius: 8 }}
        src={placeholderSrc}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      {/* Props lat/lng/zoom ignored for now - just a showcase placeholder */}
    </div>
  );
};

export { PinnedMap };
