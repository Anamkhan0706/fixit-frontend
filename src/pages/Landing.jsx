import { useMemo, useState } from "react";
import { Search, Wrench, Zap, Hammer, PaintRoller, Snowflake, Sparkles } from "lucide-react";
import { categories, professionals } from "../data/mockData";
import ProfessionalCard from "../components/ProfessionalCard";

const ICONS = { Wrench, Zap, Hammer, PaintRoller, Snowflake, Sparkles };

export default function Landing() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [sortBy, setSortBy] = useState("rating");

  const filtered = useMemo(() => {
    let list = professionals.filter((p) => {
      const matchesCategory = !activeCategory || p.category === activeCategory;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.serviceArea.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
    list = [...list].sort((a, b) =>
      sortBy === "rating" ? b.rating - a.rating : a.hourlyRate - b.hourlyRate
    );
    return list;
  }, [query, activeCategory, sortBy]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-500 to-brand-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Trusted help, right around the corner
          </h1>
          <p className="mt-4 text-brand-100 text-base sm:text-lg max-w-2xl mx-auto">
            Find and book verified plumbers, electricians, and other home service
            professionals in minutes.
          </p>

          <div className="mt-8 max-w-xl mx-auto">
            <label htmlFor="search" className="sr-only">Search by service, name, or location</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search &quot;electrician&quot;, &quot;Koramangala&quot;..."
                className="w-full rounded-xl border-0 pl-12 pr-4 py-3.5 text-gray-900 shadow-lg focus:outline-none focus:ring-4 focus:ring-brand-300"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center mb-10" role="group" aria-label="Filter by category">
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
          {categories.map((c) => {
            const Icon = ICONS[c.icon];
            const active = activeCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCategory(active ? null : c.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  active
                    ? "bg-brand-500 text-white border-brand-500"
                    : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"
                }`}
                aria-pressed={active}
              >
                <Icon size={15} />
                {c.name}
              </button>
            );
          })}
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {filtered.length} professional{filtered.length !== 1 ? "s" : ""} available
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="sort" className="text-gray-500">Sort by</label>
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

        {/* Results grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((pro) => (
              <ProfessionalCard key={pro.id} pro={pro} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg font-medium">No professionals match your search</p>
            <p className="text-sm mt-1">Try a different category or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
