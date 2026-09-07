import { MapIcon } from './icons';

/**
 * The small static map above the sidebar filters, with the reference's
 * "View map" link below it. Same embed the destination pages use, cropped to
 * a preview size; the link opens the full map in Google's own UI.
 */
export default function ResultsMapThumb() {
  return (
    <div className="cars-map">
      <div className="cars-map-thumb">
        <iframe
          title="Map of Thailand"
          src="https://www.google.com/maps?q=Thailand&z=6&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <a
        className="cars-map-view"
        href="https://www.google.com/maps?q=Thailand&z=6"
        target="_blank"
        rel="noreferrer"
      >
        <MapIcon width={16} height={16} />
        View map
      </a>
    </div>
  );
}
