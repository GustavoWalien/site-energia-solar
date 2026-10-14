/** A flor do ipê, logo da marca. Contorno e miolo seguem a cor do texto (currentColor). Decorativa. */
export function Flor({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <g fill="#FAFAF5" stroke="currentColor" strokeWidth="1.6">
        <ellipse cx="16" cy="7" rx="4" ry="6" />
        <ellipse cx="16" cy="25" rx="4" ry="6" />
        <ellipse cx="7" cy="16" rx="6" ry="4" />
        <ellipse cx="25" cy="16" rx="6" ry="4" />
      </g>
      <circle cx="16" cy="16" r="5" fill="currentColor" />
    </svg>
  );
}
