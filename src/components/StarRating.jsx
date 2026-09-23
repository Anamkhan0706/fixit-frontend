import { Star } from "lucide-react";

export default function StarRating({ rating, size = 14, showNumber = true, count }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Rated ${rating} out of 5`}>
      <Star size={size} className="text-amber-400 fill-amber-400" />
      {showNumber && <span className="font-medium text-gray-700">{rating}</span>}
      {typeof count === "number" && <span className="text-gray-400">({count})</span>}
    </span>
  );
}
