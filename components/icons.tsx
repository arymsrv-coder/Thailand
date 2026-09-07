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

export function CompassIcon({ width = 18, height = 18 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.6}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" />
    </svg>
  );
}

export function QuestionIcon({ width = 18, height = 18 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.6}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.3 9.3a2.7 2.7 0 115 1.5c0 1.6-2.3 1.6-2.3 3.4" />
      <path d="M12 17.2v.1" strokeLinecap="round" />
    </svg>
  );
}

export function MailIcon({ width = 18, height = 18 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.6}>
      <rect x="3" y="5" width="18" height="14" rx="2.4" />
      <path d="M4 6.5l8 6.5 8-6.5" />
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

/*
 * The sidebar's fuller category list and the promo strip below the hero
 * pull in a wider icon set than the site otherwise needs — several of these
 * (Bed, Plane, Car…) label sections with no page behind them yet, but still
 * need a recognisable glyph rather than a blank space in the row.
 */

export function BedIcon({ width = 18, height = 18 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.6}>
      <path d="M3 18v-7a2 2 0 012-2h5a2 2 0 012 2v2" />
      <path d="M12 13h7a2 2 0 012 2v3" />
      <path d="M3 18h18M3 11V7M21 20v-2" />
      <circle cx="7" cy="10.5" r="1.4" />
    </svg>
  );
}

export function PlaneIcon({ width = 18, height = 18 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.6}>
      <path d="M10.5 20l1.5-5 6.5-4.2c1-.65 1-2.1 0-2.75-.6-.4-1.4-.4-2 0L10 11.5 5 10l-2 1.3 4 2.7-1 3.3 1.7 1 1.8-2.6 1 4.3z" />
    </svg>
  );
}

export function CarIcon({ width = 18, height = 18 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.6}>
      <path d="M4 16v-3.5l1.8-4A2 2 0 017.6 7.3h8.8a2 2 0 011.8 1.2l1.8 4V16" />
      <path d="M3.5 16h17v2.2a.8.8 0 01-.8.8h-1.4a.8.8 0 01-.8-.8V17H6.5v1.2a.8.8 0 01-.8.8H4.3a.8.8 0 01-.8-.8V16z" />
      <circle cx="7.5" cy="13.2" r="1" />
      <circle cx="16.5" cy="13.2" r="1" />
    </svg>
  );
}

export function SuitcaseIcon({ width = 18, height = 18 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.6}>
      <rect x="3.5" y="8" width="17" height="12" rx="2" />
      <path d="M9 8V6a2 2 0 012-2h2a2 2 0 012 2v2" />
      <path d="M3.5 13.5h17" />
    </svg>
  );
}

export function PeopleIcon({ width = 18, height = 18 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.6}>
      <circle cx="9" cy="8.5" r="2.8" />
      <path d="M3.5 19c0-3 2.5-5.2 5.5-5.2s5.5 2.2 5.5 5.2" />
      <circle cx="16.5" cy="8" r="2.2" />
      <path d="M14.8 13.9c2.5.2 4.7 2.3 4.7 5.1" />
    </svg>
  );
}

export function ShipIcon({ width = 18, height = 18 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.6}>
      <path d="M4 14l1.4 5.2a1 1 0 00.96.73h11.28a1 1 0 00.96-.73L20 14" />
      <path d="M6 14V6h9l3 5" />
      <path d="M6 14H3l1.5 2.4M20 14h2l-1.5 2.4" />
      <path d="M10 6V3.5h2V6" />
    </svg>
  );
}

export function SparkleIcon({ width = 18, height = 18 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.6} strokeLinejoin="round">
      <path d="M12 3.5l1.7 4.8 4.8 1.7-4.8 1.7-1.7 4.8-1.7-4.8-4.8-1.7 4.8-1.7z" />
      <path d="M19 16.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
    </svg>
  );
}

export function LightbulbIcon({ width = 18, height = 18 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.6}>
      <path d="M9 18h6M9.8 21h4.4" />
      <path d="M12 3a6 6 0 00-3.5 10.9c.6.45 1 1.15 1 1.9v.2h5v-.2c0-.75.4-1.45 1-1.9A6 6 0 0012 3z" />
    </svg>
  );
}

export function MapIcon({ width = 18, height = 18 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.6} strokeLinejoin="round">
      <path d="M9 4L3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4z" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  );
}

export function TagIcon({ width = 18, height = 18 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.6} strokeLinejoin="round">
      <path d="M20 12.5L12.5 20a1.4 1.4 0 01-2 0l-6.5-6.5a1.4 1.4 0 010-2L11.5 4H18a2 2 0 012 2v6.5z" />
      <circle cx="15" cy="8" r="1.4" />
    </svg>
  );
}

export function AwardIcon({ width = 18, height = 18 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.6}>
      <circle cx="12" cy="9" r="5" />
      <path d="M9 13.3L7.5 21l4.5-2.4 4.5 2.4-1.5-7.7" />
    </svg>
  );
}

export function DownloadIcon({ width = 18, height = 18 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.6}>
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M12 7v6m0 0l-2.3-2.3M12 13l2.3-2.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 18.5h2" strokeLinecap="round" />
    </svg>
  );
}

export function ShieldCheckIcon({ width = 22, height = 22 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.6}>
      <path d="M12 3l7 3v5.5c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3z" />
      <path d="M8.7 12l2.2 2.2 4.4-4.4" />
    </svg>
  );
}

export function HeadsetIcon({ width = 22, height = 22 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.6}>
      <path d="M4 13v-1a8 8 0 0116 0v1" />
      <rect x="3" y="13" width="4" height="6" rx="1.4" />
      <rect x="17" y="13" width="4" height="6" rx="1.4" />
      <path d="M20 19.5a3.5 3.5 0 01-3.5 3.5H13" />
    </svg>
  );
}

export function InfoIcon({ width = 14, height = 14 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.6}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" strokeLinecap="round" />
      <path d="M12 8v.1" strokeLinecap="round" />
    </svg>
  );
}

/** Gearbox: the reference's transmission glyph — an H-pattern shift gate. */
export function GearIcon({ width = 15, height = 15 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.6} strokeLinecap="round">
      <path d="M5 5v14" />
      <path d="M12 5v14" />
      <path d="M19 5v9" />
      <path d="M5 12h14" />
      <circle cx="5" cy="5" r="1.6" />
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="19" cy="5" r="1.6" />
    </svg>
  );
}

/** Speedometer: the reference's mileage glyph. */
export function GaugeIcon({ width = 14, height = 14 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.6} strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5 11 13" />
    </svg>
  );
}

/** Filled star, for the hotel-tier row on a package deal. */
export function StarIcon({ width = 14, height = 14 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={width} height={height} fill="currentColor">
      <path d="m12 2.6 2.85 5.78 6.38.93-4.62 4.5 1.1 6.35L12 17.16l-5.71 3 1.1-6.35-4.62-4.5 6.38-.93z" />
    </svg>
  );
}

/** Clock, for the duration line on an activity card. */
export function ClockIcon({ width = 14, height = 14 }: IconProps) {
  return (
    <svg {...stroke} width={width} height={height} strokeWidth={1.6} strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}
