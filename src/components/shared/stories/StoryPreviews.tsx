import Image from "next/image";

interface StoryPreviewsProps {
  stories: { image: string }[];
  activeStoryIndex: number | null;
}

export default function StoryPreviews({
  stories,
  activeStoryIndex,
}: StoryPreviewsProps) {
  if (activeStoryIndex === null) return null;

  return (
    <div className="hidden md:block">
      {/* Left Preview */}
      {activeStoryIndex > 0 && (
        <div className="absolute top-[50px] bottom-[50px] left-[20px] w-[33%] overflow-hidden z-[60] scale-[0.9]">
          <Image
            src={stories[activeStoryIndex - 1].image}
            alt="previous story"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#00000080]" />
        </div>
      )}

      {/* Right Preview */}
      {activeStoryIndex < stories.length - 1 && (
        <div className="absolute top-[50px] bottom-[50px] right-[20px] w-[33%] overflow-hidden z-[60] scale-[0.9]">
          <Image
            src={stories[activeStoryIndex + 1].image}
            alt="next story"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#00000080]" />
        </div>
      )}
    </div>
  );
}
