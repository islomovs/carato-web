import { Star } from "lucide-react";

interface RatingStarsProps {
  selectedRating: number;
  onChange: (rating: number) => void;
  error?: string;
}

export default function RatingStars({
  selectedRating,
  onChange,
  error,
}: RatingStarsProps) {
  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <div className="flex justify-between md:gap-[10px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-20 h-20 flex items-center justify-center cursor-pointer"
            onClick={() => onChange(i + 1)}
          >
            <Star
              size={60}
              fill={i < selectedRating ? "#FAC515" : "none"}
              stroke={error ? "#EF4444" : "#FAC515"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
