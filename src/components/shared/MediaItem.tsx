import Image from "next/image";

export type MediaItemT =
  | { id: string | number; type: "image"; src: string; alt?: string }
  | {
      id: string | number;
      type: "video";
      src: string;
      poster?: string;
      alt?: string;
    };

export default function MediaItem({
  media,
  onClick,
  fullHeight = false,
}: {
  media: MediaItemT;
  onClick?: () => void;
  fullHeight?: boolean;
}) {
  const isVideo = media.type === "video";

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden ${
        fullHeight ? "h-full" : ""
      }`}
      onClick={onClick}
    >
      {isVideo ? (
        <div className="relative w-full h-full overflow-hidden bg-black/50 flex items-center justify-center">
          <video
            src={media.src}
            controls
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <Image
          src={media.src}
          alt={media.alt || ""}
          fill
          className="object-cover"
        />
      )}
    </div>
  );
}
