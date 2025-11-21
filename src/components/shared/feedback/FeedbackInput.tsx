import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FeedbackInputProps {
  label: string;
  value: string;
  placeholder?: string;
  error?: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
}

export default function FeedbackInput({
  label,
  value,
  placeholder,
  error,
  onChange,
  multiline = false,
  rows = 3,
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
          value={value}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          className={`border-black w-full ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
        />
      ) : (
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`border-black w-full ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
        />
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
