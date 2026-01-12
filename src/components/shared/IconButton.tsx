import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function IconButton({
  icon,
  onClick,
  badge,
}: {
  icon: string;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      aria-label="header-icon"
      onClick={onClick}
      className="relative w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#EEF2F6] transition-colors cursor-pointer"
    >
      <Image src={icon} alt="" width={16} height={16} />

      {!!badge && badge > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-4 min-w-[16px] px-[5px] text-[10px] leading-none flex items-center justify-center"
        >
          {badge}
        </Badge>
      )}
    </button>
  );
}
