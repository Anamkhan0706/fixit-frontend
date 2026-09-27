import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Wrench,
  Zap,
  Hammer,
  PaintRoller,
  Snowflake,
  Sparkles,
} from "lucide-react";
import { categories } from "../data/mockData";
import ProfessionalCard from "../components/ProfessionalCard";

const ICONS = {
  Wrench,
  Zap,
  Hammer,
  PaintRoller,
  Snowflake,
  Sparkles,
};

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function mapProfessional(professional) {
  return {
    id: professional._id,
    name: professional.name,
    category: professional.service.toLowerCase().replace(/\s+/g, "-"),
    categoryLabel: professional.service,
    rating: professional.rating ?? 0,
    reviewCount: 0,
    experience: 0,
    priceRange: "$",
    hourlyRate: professional.price,
    serviceArea: professional.location,
    verified: true,
    bio: professional.description,
    avatar: professional.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    reviews: [],
    availability: professional.availability,
  };
}

export default function Landing() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [sortBy, setSortBy] = useState("rating");

  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfessionals() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/professionals`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch professionals."
          );
        }

        const backendProfessionals = data.professionals || [];

        setProfessionals(
          backendProfessionals.map(mapProfessional)
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to load professionals. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProfessionals();
  }, []);

  const filtered = useMemo(() => {
    let list = professionals.filter((professional) => {
      const matchesCategory =
        !activeCategory ||
        professional.category === activeCategory;

      const q = query.trim().toLowerCase();

      const matchesQuery =
        !q ||
        professional.name.toLowerCase().includes(q) ||
        professional.categoryLabel.toLowerCase().includes(q) ||
        professional.serviceArea.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });

    list = [...list].sort((a, b) =>
      sortBy === "rating"
        ? b.rating - a.rating
        : a.hourlyRate - b.hourlyRate
    );

    return list;
  }, [professionals, query, activeCategory, sortBy]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-500 to-brand-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Trusted help, right around the corner
          </h1>

          <p className="mt-4 text-brand-100 text-base sm:text-lg max-w-2xl mx-auto">
            Find and book verified plumbers, electricians, and other home
            service professionals in minutes.
          </p>

          <div className="mt-8 max-w-xl mx-auto">
            <label
              htmlFor="search"
              className="sr-only"
            >
              Search by service, name, or location
            </label>

            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />

              <input
                id="search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search "electrician", "Koramangala"...'
                className="w-full rounded-xl border-0 pl-12 pr-4 py-3.5 text-gray-900 shadow-lg focus:outline-none focus:ring-4 focus:ring-brand-300"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Categories */}
        <div
          className="flex flex-wrap gap-2 justify-center mb-10"
          role="group"
          aria-label="Filter by category"
        >
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              !activeCategory
                ? "bg-brand-500 text-white border-brand-500"
                : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"
            }`}
            aria-pressed={!activeCategory}
          >
            All Services
          </button>

          {categories.map((category) => {
            const Icon = ICONS[category.icon];
            const active = activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() =>
                  setActiveCategory(
                    active ? null : category.id
                  )
                }
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  active
                    ? "bg-brand-500 text-white border-brand-500"
                    : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"
                }`}
                aria-pressed={active}
              >
                <Icon size={15} />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-16">
            <p className="text-gray-500">
              Loading professionals...
            </p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="text-center py-16">
            <p className="text-lg font-medium text-red-600">
              Unable to load professionals
            </p>

            <p className="text-sm text-gray-500 mt-2">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-brand-500 hover:bg-brand-600 text-white font-medium px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {filtered.length} professional
                {filtered.length !== 1 ? "s" : ""} available
              </h2>

              <div className="flex items-center gap-2 text-sm">
                <label
                  htmlFor="sort"
                  className="text-gray-500"
                >
                  Sort by
                </label>

                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="rating">Top rated</option>
                  <option value="price">Lowest price</option>
                </select>
              </div>
            </div>

            {filtered.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((professional) => (
                  <ProfessionalCard
                    key={professional.id}
                    pro={professional}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <p className="text-lg font-medium">
                  No professionals match your search
                </p>

                <p className="text-sm mt-1">
                  Try a different category or search term.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}