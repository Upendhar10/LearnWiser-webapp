type ProgressBarProps = {
  value: number; // 0–100
};

export const ProgressBar = ({ value }: ProgressBarProps) => {
  return (
    <div className="w-full h-2 rounded-full bg-neutral-800">
      <div
        className="h-2 rounded-full bg-indigo-500 transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};
