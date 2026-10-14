/**
 * The drawn icon set. One geometry, one 1.4 stroke, one cap style — the same
 * hand as the theme toggle, so no unicode glyph ever stands in for an icon.
 */
type IconProps = { className?: string };

const base = {
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function ArrowDown({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M10 4v12M5.4 11.4 10 16l4.6-4.6" />
    </svg>
  );
}

export function ArrowUp({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M10 16V4M5.4 8.6 10 4l4.6 4.6" />
    </svg>
  );
}

export function ArrowRight({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 10h12M10.6 4.6 16 10l-5.4 5.4" />
    </svg>
  );
}

export function ArrowLeft({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M16 10H4M9.4 4.6 4 10l5.4 5.4" />
    </svg>
  );
}

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6.4 13.6 13.6 6.4M7.2 6.4h6.4v6.4" />
    </svg>
  );
}

export function Asterisk({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M10 4.6v10.8M5.3 7.3l9.4 5.4M14.7 7.3l-9.4 5.4" />
    </svg>
  );
}

export function Menu({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 7h12M4 13h12" />
    </svg>
  );
}

export function Close({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5.6 5.6l8.8 8.8M14.4 5.6l-8.8 8.8" />
    </svg>
  );
}

/**
 * The badge marks: solid geometry set inline between words, the way a stamp
 * sits in a line of type. Filled shapes, never outlines. `cut` is the colour
 * knocked out of the shape and should match the ground behind it.
 */
type BadgeProps = IconProps & { cut?: string };

export function BadgeArrow({ className, cut = "var(--field)" }: BadgeProps) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M13.2 0h13.6l9.6 5.6L40 20l-3.6 14.4-9.6 5.6H13.2l-9.6-5.6L0 20 3.6 5.6z"
      />
      <path
        fill="none"
        stroke={cut}
        strokeWidth="3.4"
        strokeLinecap="square"
        d="M13.6 26.4 26.4 13.6M15.8 13.6h10.6v10.6"
      />
    </svg>
  );
}

export function BadgeAsterisk({ className, cut = "var(--field)" }: BadgeProps) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={className}>
      <rect width="40" height="40" fill="currentColor" />
      <path fill="none" stroke={cut} strokeWidth="3.4" d="M20 6v28M8 13l24 14M32 13 8 27" />
    </svg>
  );
}

export function BadgeQuatrefoil({ className }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M9.6 1.2h8.2v16.6H1.2V9.6a8.4 8.4 0 0 1 8.4-8.4zm12.6 0h8.2a8.4 8.4 0 0 1 8.4 8.4v8.2H22.2zM1.2 22.2h16.6v16.6H9.6a8.4 8.4 0 0 1-8.4-8.4zm21 0h16.6v8.2a8.4 8.4 0 0 1-8.4 8.4h-8.2z"
      />
    </svg>
  );
}
