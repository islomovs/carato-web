import NextImage from "next/image";
import { Story } from "./types";

export default function StoryNavigation({
  stories,
  activeStoryIndex,
  activeImageIndex,
  setActiveStoryIndex,
  setActiveImageIndex,
}: {
  stories: Story[];
  activeStoryIndex: number;
  activeImageIndex: number;
  setActiveStoryIndex: (index: number | null) => void;
  setActiveImageIndex: (index: number) => void;
}) {
  const currentStory = stories[activeStoryIndex];
  return (
    <div className="absolute inset-0 flex justify-between items-center px-3 z-[95]">
      <button
        className="w-9 h-9 bg-white rounded-md flex items-center justify-center cursor-pointer"
        onClick={() => {
          if (activeImageIndex > 0) {
            setActiveImageIndex(activeImageIndex - 1);
          } else if (activeStoryIndex! > 0) {
            setActiveStoryIndex(activeStoryIndex! - 1);
            const prevStory = stories[activeStoryIndex! - 1];
            setActiveImageIndex(prevStory?.images?.length - 1 || 0);
          }
        }}
      >
        <NextImage
          src="/icons/chevron-left.svg"
          alt="previous"
          width={20}
          height={20}
        />
      </button>

      <button
        className="w-9 h-9 bg-white rounded-md flex items-center justify-center cursor-pointer"
        onClick={() => {
          if (activeImageIndex < (currentStory.images?.length ?? 0) - 1) {
            setActiveImageIndex(activeImageIndex + 1);
          } else if (activeStoryIndex! < stories.length - 1) {
            setActiveStoryIndex(activeStoryIndex! + 1);
            setActiveImageIndex(0);
          } else {
            setActiveStoryIndex(null);
            setActiveImageIndex(0);
          }
        }}
      >
        <NextImage
          src="/icons/chevron-right.svg"
          alt="next"
          width={20}
          height={20}
        />
      </button>
    </div>
  );
}
