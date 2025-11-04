"use client"

type SaveBarProps = {
  visible: boolean;
  onSave: () => void;
  className?: string;
};

export default function SaveBar({ visible, onSave, className = "" }: SaveBarProps) {
  if (!visible) return null;
  return (
    <div className={`mb-4 flex items-center justify-end ${className}`}>
      <button
        type="button"
        onClick={onSave}
        className="rounded-full bg-accent px-5 py-2 text-white hover:bg-accent/80"
      >
        Save
      </button>
    </div>
  );
}