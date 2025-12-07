import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FeedbackInputProps {
  label: string;
  placeholder?: string;
  value?: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
  onChange?: (val: string) => void;
}

export default function FeedbackInput({
  label,
  placeholder,
  value,
  error,
  multiline = false,
  rows = 3,
  onChange,
}: FeedbackInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-0.5">
        <label className="text-xs font-normal text-[#697586] mb-2 block">
          {label}
        </label>
        {error && <span className="text-xs font-[400] text-red-600">*</span>}
      </div>

      {multiline ? (
        <Textarea
          placeholder={placeholder}
          rows={rows}
          value={value}
          className={`border-black w-full ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
          onChange={(e) => onChange && onChange(e.target.value)}
        />
      ) : (
        <Input
          placeholder={placeholder}
          value={value}
          className={`border-black w-full ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
          onChange={(e) => onChange && onChange(e.target.value)}
        />
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
