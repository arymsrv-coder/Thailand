import { StarIcon } from './icons';

/**
 * The reference's hotel-tier row: five stars with the rating filled in, halves
 * included. The numeric value stays in the accessible name.
 */
export default function StarRating({ rating }: { rating: number }) {
  return (
    <span className="star-rating" role="img" aria-label={`${rating} out of 5`}>
      {[0, 1, 2, 3, 4].map((index) => {
        // How much of this star the rating covers: 1, 0.5, or 0.
        const fill = Math.max(0, Math.min(1, rating - index));
        return (
          <span key={index} className="star-rating-slot">
            <StarIcon />
            <span className="star-rating-fill" style={{ width: `${fill * 100}%` }}>
              <StarIcon />
            </span>
          </span>
        );
      })}
    </span>
  );
}
