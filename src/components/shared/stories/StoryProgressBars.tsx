import { motion } from "framer-motion";

export default function StoryProgressBars({
  currentStory,
  activeImageIndex,
  progress,
}: {
  currentStory: { images: { image: string }[] }; // ← loosened type
  activeImageIndex: number;
  progress: number;
}) {
  return (
    <div className="absolute top-3 left-3 right-3 flex gap-1 z-[85]">
      {currentStory.images.map((_, index) => (
        <div
          key={index}
          className="flex-1 h-[4px] rounded-full bg-[#9AA4B2] overflow-hidden"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width:
                index === activeImageIndex
                  ? `${progress}%`
                  : index < activeImageIndex
                    ? "100%"
                    : "0%",
            }}
            transition={{ ease: "linear", duration: 0.3 }}
            className="h-full bg-white"
          />
        </div>
      ))}
    </div>
  );
}
