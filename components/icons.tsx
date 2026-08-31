/**
 * The inline SVGs from the original markup, lifted verbatim so the rendered
 * paths are byte-identical. Each takes the size it was used at as a default.
 */

type IconProps = { width?: number; height?: number };

const stroke = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
} as const;

export function InstagramIcon({ width = 18, height = 18 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.6}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" />
    </svg>
  );
}

export function PinIcon({ width = 18, height = 18 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.6}>
      <path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

export function CalendarIcon({ width = 18, height = 18 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.6}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

export function GuestsIcon({ width = 18, height = 18 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.6}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
    </svg>
  );
}

export function SearchIcon({ width = 18, height = 18 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={2}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

export function HeartIcon({ width = 16, height = 16 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.8}>
      <path d="M12 20.5s-7.5-4.7-9.8-9.4C.6 7.6 2.4 4 6 4c2 0 3.5 1 6 3.5C14.5 5 16 4 18 4c3.6 0 5.4 3.6 3.8 7.1C19.5 15.8 12 20.5 12 20.5z" />
    </svg>
  );
}

export function ChevronDownIcon({ width = 16, height = 16 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={2}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function ChevronLeftIcon({ width = 16, height = 16 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={2}>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export function ChevronRightIcon({ width = 16, height = 16 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={2}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function CoordsIcon({ width = 14, height = 14 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.6}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
    </svg>
  );
}

export function CloseIcon({ width = 18, height = 18 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={2}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function CheckCircleIcon({ width = 40, height = 40 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.6}>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12.5l2.5 2.5L16 9" />
    </svg>
  );
}
