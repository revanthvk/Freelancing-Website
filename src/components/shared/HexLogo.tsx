export function HexLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 2 L22 8 L22 16 L12 22 L2 16 L2 8Z" />
      <path d="M12 8 L17 11 L17 15 L12 18 L7 15 L7 11Z" />
    </svg>
  );
}
