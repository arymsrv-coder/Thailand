/** The small static map thumbnail above the filters — same embed the destination pages use, just cropped down to a preview size. Google's own embed already carries an "open in Maps" link, so nothing is layered on top of it here. */
export default function CarsMapThumb() {
  return (
    <div className="cars-map-thumb">
      <iframe
        title="Map of Thailand"
        src="https://www.google.com/maps?q=Thailand&z=6&output=embed"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
