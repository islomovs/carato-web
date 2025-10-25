"use client";

import Image from "next/image";

interface StoryControlsProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onClose: () => void;
}

export default function StoryControls({
  isMuted,
  onToggleMute,
  onClose,
}: StoryControlsProps) {
  return (
    <div className="absolute top-[28px] right-3 md:top-[32px] md:right-[32px] z-[90] flex gap-3">
      {/* Mute / Unmute Button */}
      <button
        onClick={onToggleMute}
        className="w-9 h-9 flex items-center justify-center bg-transparent md:bg-white rounded-md cursor-pointer"
      >
        <Image
          src={isMuted ? "/icons/volume-x.svg" : "/icons/volume-max.svg"}
          alt="volume"
          width={20}
          height={20}
        />
      </button>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="w-9 h-9 flex items-center justify-center bg-transparent md:bg-white rounded-md cursor-pointer"
      >
        <Image src="/icons/x-close.svg" alt="close" width={20} height={20} />
      </button>
    </div>
  );
}
