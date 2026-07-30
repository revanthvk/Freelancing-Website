export function RLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 120"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/*
        Outer R silhouette (stem + bowl outer + leg),
        inner bowl hole punched out via evenodd fill rule.
      */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="
          M0 0 L0 120 L28 120 L28 72 L50 72
          L76 120 L100 120 L75 71
          C90 65 96 53 96 40
          C96 20 80 0 57 0
          Z
          M28 18 L54 18
          C70 18 74 28 74 40
          C74 52 70 60 54 60
          L28 60 Z
        "
      />
    </svg>
  );
}
