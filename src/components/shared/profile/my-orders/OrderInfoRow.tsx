interface OrderInfoRowProps {
  label: string;
  value: React.ReactNode;
}

export default function OrderInfoRow({ label, value }: OrderInfoRowProps) {
  return (
    <div className="border-b border-b-[#EEF2F6] py-4 flex flex-row justify-between">
      <p className="font-medium text-sm">{label}</p>
      <div className="font-light text-sm flex items-center gap-2">{value}</div>
    </div>
  );
}
