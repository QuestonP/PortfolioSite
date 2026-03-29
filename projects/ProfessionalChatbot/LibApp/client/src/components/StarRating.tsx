import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating?: number;
  max?: number;
  onRate?: (rating: number) => void;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating = 0,
  max = 5,
  onRate,
  size = 14,
}) => {
  const [hover, setHover] = React.useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          disabled={!onRate}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => onRate && setHover(star)}
          onMouseLeave={() => onRate && setHover(0)}
          className={onRate ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
        >
          <Star
            size={size}
            className={star <= (hover || rating) ? 'star-fill fill-amber-400' : 'star-empty'}
          />
        </button>
      ))}
    </div>
  );
};
