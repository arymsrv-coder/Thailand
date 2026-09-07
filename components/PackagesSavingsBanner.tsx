import { BedIcon, PlaneIcon } from './icons';

/** The wide line between the search card and the deals, as the reference has it. */
export default function PackagesSavingsBanner() {
  return (
    <p className="lp-savings">
      To get major savings, book your <strong>flight &amp; stay together</strong> on Amara Siam
      <span className="lp-savings-icons" aria-hidden="true">
        <PlaneIcon width={26} height={26} />
        <span>+</span>
        <BedIcon width={26} height={26} />
      </span>
    </p>
  );
}
