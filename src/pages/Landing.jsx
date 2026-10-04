import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Wrench,
  Zap,
  Hammer,
  PaintRoller,
  Snowflake,
  Sparkles,
  BriefcaseBusiness,
  ArrowRight,
  RefreshCw,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/mockData";
import ProfessionalCard from "../components/ProfessionalCard";
import StatusStepper from "../components/StatusStepper";
import Navbar from "../components/Navbar";

const ICONS = {
  Wrench,
  Zap,
  Hammer,
  PaintRoller,
  Snowflake,
  Sparkles,
};

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

function mapProfessional(professional) {
  return {
    id: professional._id,
    name: professional.name,
    category: professional.service
      .toLowerCase()
      .replace(/\s+/g, "-"),
    categoryLabel: professional.service,
    rating: professional.rating ?? 0,
    reviewCount: 0,
    experience: professional.experience ?? 0,
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
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState(null);
  const [sortBy, setSortBy] = useState("rating");

  const [professionals, setProfessionals] =
    useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] =
    useState(false);
  const [bookingsError, setBookingsError] =
    useState("");
  const [refreshingBookings, setRefreshingBookings] =
    useState(false);

  // Review states
  const [reviewBookingId, setReviewBookingId] =
    useState(null);

  const [reviewRating, setReviewRating] =
    useState(0);

  const [reviewComment, setReviewComment] =
    useState("");

  const [reviewSubmitting, setReviewSubmitting] =
    useState(false);

  const [reviewError, setReviewError] =
    useState("");

  const [reviewSuccess, setReviewSuccess] =
    useState("");

  const [reviewedBookingIds, setReviewedBookingIds] =
    useState([]);

  const token = localStorage.getItem("fixit_token");

  const user = JSON.parse(
    localStorage.getItem("fixit_user") || "null"
  );

  function handleProfessionalButton() {
    if (
      token &&
      user?.role === "professional"
    ) {
      navigate("/professional-dashboard");
    } else {
      navigate("/login");
    }
  }

  useEffect(() => {
    async function fetchProfessionals() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/professionals`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch professionals."
          );
        }

        const backendProfessionals =
          data.professionals || [];

        setProfessionals(
          backendProfessionals.map(
            mapProfessional
          )
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

  async function fetchBookings(
    showLoading = true
  ) {
    if (
      !token ||
      user?.role !== "customer"
    ) {
      setBookings([]);
      return;
    }

    try {
      if (showLoading) {
        setBookingsLoading(true);
      }

      setBookingsError("");

      const response = await fetch(
        `${API_URL}/bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load your bookings."
        );
      }

      setBookings(data.bookings || []);
    } catch (err) {
      setBookingsError(
        err.message ||
          "Unable to load your bookings."
      );
    } finally {
      if (showLoading) {
        setBookingsLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchBookings();
  }, [token, user?.role]);

  useEffect(() => {
    function handleWindowFocus() {
      fetchBookings(false);
    }

    window.addEventListener(
      "focus",
      handleWindowFocus
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleWindowFocus
      );
    };
  }, [token, user?.role]);

  async function handleRefreshBookings() {
    try {
      setRefreshingBookings(true);
      setBookingsError("");

      await fetchBookings(false);
    } finally {
      setRefreshingBookings(false);
    }
  }

  /*
    Open review form
  */
  function openReviewForm(bookingId) {
    setReviewBookingId(bookingId);
    setReviewRating(0);
    setReviewComment("");
    setReviewError("");
    setReviewSuccess("");
  }

  /*
    Close review form
  */
  function closeReviewForm() {
    setReviewBookingId(null);
    setReviewRating(0);
    setReviewComment("");
    setReviewError("");
  }

  /*
    Submit review
  */
  async function handleSubmitReview(bookingId) {
    if (reviewRating === 0) {
      setReviewError(
        "Please select a rating from 1 to 5 stars."
      );
      return;
    }

    if (!reviewComment.trim()) {
      setReviewError(
        "Please write a comment before submitting your review."
      );
      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewError("");
      setReviewSuccess("");

      const response = await fetch(
        `${API_URL}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            booking: bookingId,
            rating: reviewRating,
            comment: reviewComment.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to submit review."
        );
      }

      setReviewedBookingIds((previous) => [
        ...previous,
        bookingId,
      ]);

      setReviewSuccess(
        "Your review has been submitted successfully!"
      );

      setReviewRating(0);
      setReviewComment("");

      // Refresh professionals so updated rating appears
      try {
        const professionalResponse =
          await fetch(
            `${API_URL}/professionals`
          );

        const professionalData =
          await professionalResponse.json();

        if (professionalResponse.ok) {
          setProfessionals(
            (
              professionalData.professionals ||
              []
            ).map(mapProfessional)
          );
        }
      } catch {
        // Review was already successfully submitted.
      }

      setTimeout(() => {
        setReviewBookingId(null);
        setReviewSuccess("");
      }, 2000);
    } catch (err) {
      setReviewError(
        err.message ||
          "Unable to submit review."
      );
    } finally {
      setReviewSubmitting(false);
    }
  }

  const filtered = useMemo(() => {
    let list = professionals.filter(
      (professional) => {
        const matchesCategory =
          !activeCategory ||
          professional.category ===
            activeCategory;

        const q = query
          .trim()
          .toLowerCase();

        const matchesQuery =
          !q ||
          professional.name
            .toLowerCase()
            .includes(q) ||
          professional.categoryLabel
            .toLowerCase()
            .includes(q) ||
          professional.serviceArea
            .toLowerCase()
            .includes(q);

        return (
          matchesCategory &&
          matchesQuery
        );
      }
    );

    list = [...list].sort((a, b) =>
      sortBy === "rating"
        ? b.rating - a.rating
        : a.hourlyRate - b.hourlyRate
    );

    return list;
  }, [
    professionals,
    query,
    activeCategory,
    sortBy,
  ]);

  function getStatusClasses(status) {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-700";

      case "completed":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  }

  function getStatusLabel(status) {
    switch (status) {
      case "pending":
        return "Requested";

      case "confirmed":
        return "Accepted";

      case "completed":
        return "Completed";

      case "cancelled":
        return "Cancelled";

      default:
        return status || "Unknown";
    }
  }

  return (
    <>
      <Navbar />

      <div>
        {/* Hero */}
        <section className="bg-gradient-to-b from-brand-500 to-brand-600 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
              Trusted help, right around the corner
            </h1>

            <p className="mt-4 text-brand-100 text-base sm:text-lg max-w-2xl mx-auto">
              Find and book verified plumbers,
              electricians, and other home
              service professionals in minutes.
            </p>

            <div className="mt-8 max-w-xl mx-auto">
              <label
                htmlFor="search"
                className="sr-only"
              >
                Search by service, name, or
                location
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
                  onChange={(e) =>
                    setQuery(e.target.value)
                  }
                  placeholder='Search "electrician", "Koramangala"...'
                  className="w-full rounded-xl border-0 pl-12 pr-4 py-3.5 text-gray-900 shadow-lg focus:outline-none focus:ring-4 focus:ring-brand-300"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Customer Bookings */}
        {token &&
          user?.role === "customer" && (
            <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      My Bookings
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      View and track the services
                      you have booked.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {bookings.length > 0 && (
                      <span className="inline-flex w-fit rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
                        {bookings.length} booking
                        {bookings.length !== 1
                          ? "s"
                          : ""}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={
                        handleRefreshBookings
                      }
                      disabled={
                        refreshingBookings
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <RefreshCw
                        size={16}
                        className={
                          refreshingBookings
                            ? "animate-spin"
                            : ""
                        }
                      />

                      {refreshingBookings
                        ? "Refreshing..."
                        : "Refresh"}
                    </button>
                  </div>
                </div>

                {bookingsLoading && (
                  <div className="rounded-lg bg-gray-50 p-6 text-center">
                    <p className="text-gray-500">
                      Loading your bookings...
                    </p>
                  </div>
                )}

                {!bookingsLoading &&
                  bookingsError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                      <p className="text-sm text-red-700">
                        {bookingsError}
                      </p>
                    </div>
                  )}

                {!bookingsLoading &&
                  !bookingsError &&
                  bookings.length === 0 && (
                    <div className="rounded-lg bg-gray-50 p-8 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                        <Wrench size={22} />
                      </div>

                      <h3 className="mt-4 font-semibold text-gray-900">
                        No bookings yet
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Choose a professional below
                        to book your first home
                        service.
                      </p>
                    </div>
                  )}

                {!bookingsLoading &&
                  !bookingsError &&
                  bookings.length > 0 && (
                    <div className="space-y-5">
                      {bookings.map(
                        (booking) => {
                          const hasReviewed =
                            reviewedBookingIds.includes(
                              booking._id
                            );

                          const isReviewOpen =
                            reviewBookingId ===
                            booking._id;

                          return (
                            <div
                              key={booking._id}
                              className="rounded-xl border border-gray-200 p-5"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {
                                      booking.service
                                    }
                                  </h3>

                                  {booking
                                    .professional
                                    ?.name && (
                                    <p className="mt-1 text-sm text-gray-500">
                                      Professional:{" "}
                                      {
                                        booking
                                          .professional
                                          .name
                                      }
                                    </p>
                                  )}

                                  <p className="mt-1 text-sm text-gray-600">
                                    {booking.date} at{" "}
                                    {booking.time}
                                  </p>

                                  <p className="mt-1 text-sm text-gray-600">
                                    {
                                      booking.address
                                    }
                                  </p>
                                </div>

                                <span
                                  className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                    booking.status
                                  )}`}
                                >
                                  {getStatusLabel(
                                    booking.status
                                  )}
                                </span>
                              </div>

                              {/* Order Tracking */}
                              <div className="mt-6 border-t border-gray-100 pt-6">
                                <p className="mb-4 text-sm font-semibold text-gray-800">
                                  Order Tracking
                                </p>

                                {booking.status ===
                                "cancelled" ? (
                                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                                    <p className="text-sm font-medium text-red-700">
                                      This booking has
                                      been cancelled.
                                    </p>
                                  </div>
                                ) : (
                                  <StatusStepper
                                    status={
                                      booking.status
                                    }
                                  />
                                )}
                              </div>

                              {booking.issue && (
                                <div className="mt-6 rounded-lg bg-gray-50 p-3">
                                  <p className="text-sm text-gray-700">
                                    <span className="font-semibold">
                                      Issue:
                                    </span>{" "}
                                    {booking.issue}
                                  </p>
                                </div>
                              )}

                              {/* Review Section */}
                              {booking.status ===
                                "completed" && (
                                <div className="mt-6 border-t border-gray-100 pt-6">
                                  {!hasReviewed &&
                                    !isReviewOpen && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          openReviewForm(
                                            booking._id
                                          )
                                        }
                                        className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
                                      >
                                        <Star
                                          size={17}
                                          fill="currentColor"
                                        />
                                        Leave a Review
                                      </button>
                                    )}

                                  {hasReviewed && (
                                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                      <p className="flex items-center gap-2 text-sm font-semibold text-green-700">
                                        <Star
                                          size={17}
                                          fill="currentColor"
                                        />
                                        Review submitted
                                      </p>
                                    </div>
                                  )}

                                  {isReviewOpen && (
                                    <div className="rounded-xl border border-brand-100 bg-brand-50 p-5">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <h4 className="text-lg font-semibold text-gray-900">
                                            Rate your experience
                                          </h4>

                                          <p className="mt-1 text-sm text-gray-500">
                                            How was your experience
                                            with{" "}
                                            {
                                              booking
                                                .professional
                                                ?.name
                                            }?
                                          </p>
                                        </div>
                                      </div>

                                      {/* Stars */}
                                      <div className="mt-5">
                                        <p className="mb-2 text-sm font-medium text-gray-700">
                                          Your Rating
                                        </p>

                                        <div className="flex items-center gap-2">
                                          {[1, 2, 3, 4, 5].map(
                                            (star) => (
                                              <button
                                                key={star}
                                                type="button"
                                                onClick={() =>
                                                  setReviewRating(
                                                    star
                                                  )
                                                }
                                                className="rounded-md p-1 transition-transform hover:scale-110 focus:outline-none"
                                                aria-label={`Rate ${star} out of 5`}
                                              >
                                                <Star
                                                  size={30}
                                                  className={
                                                    star <=
                                                    reviewRating
                                                      ? "text-yellow-500"
                                                      : "text-gray-300"
                                                  }
                                                  fill={
                                                    star <=
                                                    reviewRating
                                                      ? "currentColor"
                                                      : "none"
                                                  }
                                                />
                                              </button>
                                            )
                                          )}
                                        </div>

                                        {reviewRating >
                                          0 && (
                                          <p className="mt-2 text-sm text-gray-600">
                                            You selected{" "}
                                            <span className="font-semibold">
                                              {
                                                reviewRating
                                              }{" "}
                                              / 5
                                            </span>
                                          </p>
                                        )}
                                      </div>

                                      {/* Comment */}
                                      <div className="mt-5">
                                        <label
                                          htmlFor={`review-${booking._id}`}
                                          className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                          Your Review
                                        </label>

                                        <textarea
                                          id={`review-${booking._id}`}
                                          value={
                                            reviewComment
                                          }
                                          onChange={(
                                            e
                                          ) =>
                                            setReviewComment(
                                              e.target
                                                .value
                                            )
                                          }
                                          rows={4}
                                          maxLength={500}
                                          placeholder="Tell us about your experience..."
                                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                                        />

                                        <p className="mt-1 text-right text-xs text-gray-500">
                                          {
                                            reviewComment.length
                                          }{" "}
                                          / 500
                                        </p>
                                      </div>

                                      {/* Error */}
                                      {reviewError && (
                                        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
                                          <p className="text-sm text-red-700">
                                            {
                                              reviewError
                                            }
                                          </p>
                                        </div>
                                      )}

                                      {/* Success */}
                                      {reviewSuccess && (
                                        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3">
                                          <p className="text-sm text-green-700">
                                            {
                                              reviewSuccess
                                            }
                                          </p>
                                        </div>
                                      )}

                                      {/* Buttons */}
                                      <div className="mt-5 flex flex-col sm:flex-row gap-3">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleSubmitReview(
                                              booking._id
                                            )
                                          }
                                          disabled={
                                            reviewSubmitting
                                          }
                                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                          <Star
                                            size={17}
                                            fill="currentColor"
                                          />

                                          {reviewSubmitting
                                            ? "Submitting..."
                                            : "Submit Review"}
                                        </button>

                                        <button
                                          type="button"
                                          onClick={
                                            closeReviewForm
                                          }
                                          disabled={
                                            reviewSubmitting
                                          }
                                          className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
              </div>
            </section>
          )}

        {/* Professional CTA */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
          <div className="rounded-2xl border border-brand-100 bg-brand-50 p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 rounded-xl bg-brand-500 p-3 text-white">
                  <BriefcaseBusiness
                    size={24}
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Are you a service professional?
                  </h2>

                  <p className="mt-1 text-sm sm:text-base text-gray-600 max-w-2xl">
                    Join FixIt, create your
                    professional profile, receive
                    customer bookings, and manage
                    your service orders from one
                    dashboard.
                  </p>
                </div>
              </div>

              <button
                onClick={
                  handleProfessionalButton
                }
                className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-brand-500 px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-600"
              >
                {token &&
                user?.role ===
                  "professional"
                  ? "Go to Professional Dashboard"
                  : "Join as a Professional"}

                <ArrowRight size={18} />
              </button>
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
              onClick={() =>
                setActiveCategory(null)
              }
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
              const Icon =
                ICONS[category.icon];

              const active =
                activeCategory ===
                category.id;

              return (
                <button
                  key={category.id}
                  onClick={() =>
                    setActiveCategory(
                      active
                        ? null
                        : category.id
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
                onClick={() =>
                  window.location.reload()
                }
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
                  {filtered.length !== 1
                    ? "s"
                    : ""}{" "}
                  available
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
                    onChange={(e) =>
                      setSortBy(e.target.value)
                    }
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="rating">
                      Top rated
                    </option>

                    <option value="price">
                      Lowest price
                    </option>
                  </select>
                </div>
              </div>

              {filtered.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map(
                    (professional) => (
                      <ProfessionalCard
                        key={professional.id}
                        pro={professional}
                      />
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <p className="text-lg font-medium">
                    No professionals match your
                    search
                  </p>

                  <p className="text-sm mt-1">
                    Try a different category or
                    search term.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}