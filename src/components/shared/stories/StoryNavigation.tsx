import NextImage from "next/image";

interface StoryNavigationProps {
  totalImages: number;
  totalStories: number;
  activeStoryIndex: number;
  activeImageIndex: number;
  setActiveStoryIndex: (index: number | null) => void;
  setActiveImageIndex: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function StoryNavigation({
  onPrev,
  onNext,
  activeStoryIndex,
  totalStories,
}: StoryNavigationProps) {
  return (
    <>
      {/* IG-style tap zones — left half = prev, right half = next */}
      <div className="absolute inset-0 z-[90] flex pointer-events-none">
        {/* Left tap zone */}
        <div
          className="flex-1 h-full cursor-pointer pointer-events-auto"
          onClick={onPrev}
        />
        {/* Right tap zone */}
        <div
          className="flex-1 h-full cursor-pointer pointer-events-auto"
          onClick={onNext}
        />
      </div>

      {/* Chevron buttons — decorative, sit above tap zones */}
      <div className="absolute inset-0 flex justify-between items-center px-3 z-[95] pointer-events-none">
        {activeStoryIndex > 0 && (
          <button
            className="w-9 h-9 bg-white rounded-md flex items-center justify-center cursor-pointer pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
          >
            <NextImage
              src="/icons/chevron-left.svg"
              alt="previous"
              width={20}
              height={20}
            />
          </button>
        )}
        <div className="flex-1" />
        {activeStoryIndex < totalStories - 1 && (
          <button
            className="w-9 h-9 bg-white rounded-md flex items-center justify-center cursor-pointer pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          >
            <NextImage
              src="/icons/chevron-right.svg"
              alt="next"
              width={20}
              height={20}
            />
          </button>
        )}
      </div>
    </>
  );
}
