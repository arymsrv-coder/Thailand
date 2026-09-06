import {
  CheckCircleIcon,
  HeadsetIcon,
  InfoIcon,
  PeopleIcon,
  PinIcon,
  ShieldCheckIcon,
  TagIcon,
} from './icons';

const TRUST_BADGES = [
  {
    icon: ShieldCheckIcon,
    title: 'Secure Payment',
    detail: 'Encrypted checkout on every booking',
  },
  {
    icon: HeadsetIcon,
    title: '24/7 Support',
    detail: 'Real people, any hour you need us',
  },
  {
    icon: CheckCircleIcon,
    title: 'Best Price Promise',
    detail: 'Fair, upfront pricing — no surprise fees',
  },
];

/*
 * Three real coupons rather than three fake ones: Amara Siam only sells
 * tours, but it genuinely does sell both of these kinds (see the sidebar's
 * Private/Group Tours), plus the general first-booking offer — unlike the
 * hotel data elsewhere on this page, a discount on Amara's own product is
 * this business's own claim to make, not a claim about someone else's.
 */
const COUPONS = [
  {
    icon: PinIcon,
    label: 'Private Tours',
    info: 'A dedicated local guide, at your own pace.',
  },
  {
    icon: PeopleIcon,
    label: 'Group Tours',
    info: 'Scheduled day trips, shared with fellow travelers.',
  },
  {
    icon: TagIcon,
    label: 'Any Tour',
    info: 'Good on any tour booked in your first 30 days.',
  },
];

/*
 * The strip of trust signals and the new-user coupons, sitting right below
 * the hero — the same slot a big travel site fills with "we price match /
 * hotel booking guarantee" badges and a welcome-discount row before the
 * first real content.
 */
export default function PromoStrip() {
  return (
    <div className="promo-strip">
      <div className="container">
        <ul className="trust-badges">
          {TRUST_BADGES.map((badge) => (
            <li className="trust-badge" key={badge.title}>
              <badge.icon />
              <div>
                <strong>{badge.title}</strong>
                <span>{badge.detail}</span>
              </div>
            </li>
          ))}
        </ul>

        <h3 className="coupon-heading">New user exclusive</h3>
        <div className="coupon-row">
          <div className="coupon-intro">
            <p>New users get 10% more off every tour!</p>
            <a className="btn btn-primary" href="#tours">
              Browse tours
            </a>
          </div>

          {COUPONS.map((coupon) => (
            <div className="coupon-ticket" key={coupon.label}>
              <div className="coupon-ticket-info">
                <strong>10% off</strong>
                <span>
                  {coupon.label}
                  <span className="coupon-info" title={coupon.info}>
                    <InfoIcon />
                  </span>
                </span>
                <a className="btn btn-primary coupon-claim" href="#tours">
                  Claim
                </a>
              </div>
              <div className="coupon-ticket-icon">
                <coupon.icon width={20} height={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
