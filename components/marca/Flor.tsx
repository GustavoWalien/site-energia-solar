/** A flor do ipê, logo da marca. Decorativa: o nome da empresa vem em texto ao lado. */
export function Flor({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <g fill="#FAFAF5" stroke="#0E3557" strokeWidth="1.6">
        <ellipse cx="16" cy="7" rx="4" ry="6" />
        <ellipse cx="16" cy="25" rx="4" ry="6" />
        <ellipse cx="7" cy="16" rx="6" ry="4" />
        <ellipse cx="25" cy="16" rx="6" ry="4" />
      </g>
      <circle cx="16" cy="16" r="5" fill="#0E3557" />
    </svg>
  );
}
