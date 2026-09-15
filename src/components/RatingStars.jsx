import { useState } from "react";

const STAR_PATH =
  "M12 2l2.94 5.95 6.57.95-4.75 4.63 1.12 6.54L12 17.02 6.12 20.07l1.12-6.54L2.49 8.9l6.57-.95z";

function RatingStars({ value = 0, max = 10, onRate, size = 14 }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <div
      className="rating"
      onMouseLeave={() => setHover(0)}
      role="group"
      aria-label={`Rate ${max}`}
    >
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          className={"rating-star" + (n <= shown ? " on" : "")}
          style={{ width: size, height: size }}
          onMouseEnter={() => setHover(n)}
          onClick={() => onRate(n)}
          aria-label={`${n} of ${max}`}
          tabIndex={-1}
        >
          <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
            <path d={STAR_PATH} />
          </svg>
        </button>
      ))}
      {value > 0 && (
        <span className="rating-value">
          {value}
          <span className="rating-max">/{max}</span>
        </span>
      )}
    </div>
  );
}

export default RatingStars;
