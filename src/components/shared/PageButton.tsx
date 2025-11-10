export default function PageButton({
  number,
  active,
  onClick,
}: {
  number: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col items-center cursor-pointer">
      <button
        onClick={onClick}
        className={`w-[36px] cursor-pointer h-[24px] text-[12px] font-[400] leading-none flex items-center justify-center ${
          active ? "text-black" : "text-[#445566]"
        }`}
        aria-current={active ? "page" : undefined}
      >
        {number}
      </button>
      {/* Active underline: 0.5px visual approximation — using border-b-[0.5px] may be inconsistent; use 1px but reduced opacity */}
      <div
        className={`w-[36px] ${active ? "border-b-[1px] border-black" : "border-b-[1px] border-transparent"}`}
        style={{ height: 0.5 }}
      />
    </div>
  );
}
