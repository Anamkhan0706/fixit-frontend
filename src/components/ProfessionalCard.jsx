import { Link } from "react-router-dom";
import { MapPin, BadgeCheck } from "lucide-react";
import StarRating from "./StarRating";

export default function ProfessionalCard({ pro }) {
  return (
    <Link
      to={`/professionals/${pro.id}`}
      className="group bg-white rounded-xl border border-gray-200 p-4 flex gap-4 hover:border-brand-300 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-brand-500"
    >
      <div className="w-14 h-14 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-lg shrink-0">
        {pro.avatar}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <h3 className="font-semibold text-gray-900 truncate group-hover:text-brand-600">{pro.name}</h3>
          {pro.verified && <BadgeCheck size={16} className="text-brand-500 shrink-0" aria-label="Verified professional" />}
        </div>
        <p className="text-sm text-gray-500">{pro.categoryLabel} &bull; {pro.experience} yrs experience</p>
        <div className="flex items-center gap-3 mt-1.5 text-sm">
          <StarRating rating={pro.rating} count={pro.reviewCount} />
          <span className="text-gray-300">|</span>
          <span className="text-gray-600">{pro.priceRange}</span>
        </div>
        <p className="flex items-center gap-1 text-xs text-gray-400 mt-1.5">
          <MapPin size={12} /> {pro.serviceArea}
        </p>
      </div>
    </Link>
  );
}
