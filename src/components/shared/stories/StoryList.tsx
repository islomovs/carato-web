"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface Story {
  title: string;
  image: string;
}

interface StoryListProps {
  stories: Story[];
  onSelect: (index: number) => void;
}

export default function StoryList({ stories, onSelect }: StoryListProps) {
  return (
    <div className="flex overflow-x-auto no-scrollbar">
      {stories.map((story, i) => (
        <motion.div
          key={story.title || i}
          onClick={() => onSelect(i)}
          className="relative min-w-[144px] h-[200px] cursor-pointer group overflow-hidden shrink-0"
          whileHover={{ scale: 1.02 }}
        >
          <Image
            src={story.image}
            alt={story.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <motion.div className="absolute bottom-0 left-0 right-0 h-[52px] bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-[12px] font-[400]">
              {story.title}
            </span>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
