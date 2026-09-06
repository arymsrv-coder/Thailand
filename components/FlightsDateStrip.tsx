'use client';

import { useRouter } from 'next/navigation';

type RawQuery = Record<string, string | string[] | undefined>;

function formatDay(iso: string): { weekday: string; day: string } {
  const date = new Date(`${iso}T00:00:00Z`);
  return {
    weekday: date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
    day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
  };
}

/** The nearby-dates fare strip above the results — see flightDateStrip for
 *  where the (deterministic, not live) per-day prices come from. */
export default function FlightsDateStrip({
  days,
  selectedDate,
  query,
}: {
  days: { date: string; price: number }[];
  selectedDate: string;
  query: RawQuery;
}) {
  const router = useRouter();

  function selectDate(date: string) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'depart') continue;
      if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
      else if (value) params.set(key, value);
    }
    params.set('depart', date);
    router.push(`/flights?${params.toString()}`);
  }

  if (days.length === 0) return null;

  return (
    <div className="flights-date-strip">
      {days.map(({ date, price }) => {
        const { weekday, day } = formatDay(date);
        const isSelected = date === selectedDate;
        return (
          <button
            key={date}
            type="button"
            className={`flights-date-pill${isSelected ? ' is-selected' : ''}`}
            onClick={() => selectDate(date)}
            aria-pressed={isSelected}
          >
            <span className="flights-date-pill-day">
              {weekday}, {day}
            </span>
            <span className="flights-date-pill-price">${price}</span>
          </button>
        );
      })}
    </div>
  );
}
