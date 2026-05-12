interface PriceArrowProps {
  isPriceIncreased?: boolean | null;
  size?: number;
}

export default function PriceArrow({ isPriceIncreased, size = 16 }: PriceArrowProps) {
  if (isPriceIncreased === null || isPriceIncreased === undefined) return null;

  const color = isPriceIncreased ? "#17B26A" : "#F04438";

  return isPriceIncreased ? (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M10 16V4M10 4L4 10M10 4L16 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M10 4V16M10 16L4 10M10 16L16 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
