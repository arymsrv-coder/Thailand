'use client';

import Image from 'next/image';
import { carDiscountPercent, isCarGreatDeal, ratingLabel } from '@/lib/catalog';
import type { Car } from '@/lib/types';
import { CheckCircleIcon, GaugeIcon, GearIcon, GuestsIcon, HeartIcon, PinIcon } from './icons';
import type { InquiryItem } from './InquiryModal';

export default function CarCard({
  car,
  onSelect,
}: {
  car: Car;
  onSelect: (item: InquiryItem) => void;
}) {
  const discount = carDiscountPercent(car);

  function handleSelect() {
    onSelect({
      kind: 'car',
      id: car.id,
      label: car.model,
      subtitle: `${car.category} · ${car.transmission} · ${car.seats} seats · ${car.location}`,
      price: `${car.pricePerDay} / day`,
      image: car.image,
    });
  }

  return (
    <article className="car-row">
      <div className="car-row-photo">
        {/* `cover`, not `contain`: these are photographs rather than the
            transparent cutouts the reference layout uses, so letterboxing them
            left gaps at the frame's corners and the rounding never showed. */}
        <Image src={car.image} alt={car.imageAlt} fill sizes="180px" style={{ objectFit: 'cover' }} />
        {/* Decorative only — this site has no saved-cars feature to back a real toggle. */}
        <span className="car-row-heart">
          <HeartIcon width={16} height={16} />
        </span>
      </div>

      <div className="car-row-body">
        {(isCarGreatDeal(car) || car.wasPrice) && (
          <p className="car-row-badges">
            {isCarGreatDeal(car) && <span className="deal-badge">Great Deal</span>}
            {car.wasPrice && <span className="deal-badge deal-badge-sale">Sale</span>}
          </p>
        )}
        {car.fuel === 'Electric' && <p className="car-row-eyebrow">Fully electric</p>}
        {car.fuel === 'Hybrid' && <p className="car-row-eyebrow">Hybrid</p>}
        <h3>{car.category}</h3>
        <p className="car-row-model">{car.model}</p>
        <ul className="car-row-meta">
          <li>
            <GuestsIcon width={15} height={15} /> {car.seats}
          </li>
          <li>
            <GearIcon width={15} height={15} /> {car.transmission}
          </li>
        </ul>
        <p className="car-row-mileage">
          <GaugeIcon width={14} height={14} />{' '}
          {car.unlimitedMileage ? 'Unlimited mileage' : 'Limited mileage'}
        </p>
        <p className="car-row-location">
          <PinIcon width={14} height={14} />
          <span>
            {car.city}
            <br />
            {car.distanceMiles} mi from {car.city} city center
            <br />
            {car.address}
          </span>
        </p>
      </div>

      <div className="car-row-perks">
        {car.refundable && (
          <p className="car-row-perk-primary">
            <CheckCircleIcon width={15} height={15} /> Free cancellation
          </p>
        )}
        {car.onlineCheckIn && <p>Online check-in</p>}
        <p>{car.payNow ? 'Pay now and save' : 'Pay at pick-up'}</p>
        <div className="car-row-rating">
          <span className="car-row-rating-supplier">{car.supplier}</span>
          <span
            className={`car-row-rating-score${car.supplierRatingPercent < 70 ? ' is-muted' : ''}`}
          >
            {car.supplierRatingPercent}%
          </span>
          <span className="car-row-rating-words">
            <strong>{ratingLabel(car.supplierRatingPercent)}</strong>
            {car.supplierReviewCount} reviews
          </span>
        </div>
      </div>

      <div className="car-row-price">
        {discount !== null && <span className="car-row-price-off">{discount}% off</span>}
        <span className="car-row-price-value">{car.pricePerDay}</span>
        <span className="car-row-price-unit">per day</span>
        <span className="car-row-price-total">
          {car.wasPrice && <s>{car.wasPrice}</s>} {car.totalPrice} total
        </span>
        <button className="btn btn-primary" type="button" onClick={handleSelect}>
          Reserve
        </button>
      </div>
    </article>
  );
}
