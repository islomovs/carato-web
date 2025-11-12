export interface FilterOption {
  title: string;
  options: string[];
}

export interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  total: number;
  selected: Record<string, string[]>;
  setSelected: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
}
