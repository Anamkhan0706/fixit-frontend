import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarClock,
  MapPin,
  X,
  PackageSearch,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import StatusStepper from "../components/StatusStepper";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Dashboard() {
  const { cancelBooking } = useApp();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchBookings() {
    try {
      setLoading(true);
      setError("");

      const token = window.localStorage.getItem("fixit_token");

      if (!token) {
        throw new Error("Please log in to view your bookings.");
      }

      const response = await fetch(`${API_URL}/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load bookings."
        );
      }

      setBookings(data.bookings || []);
    } catch (err) {
      setError(
        err.message || "Unable to load your bookings."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  async function handleCancel(id) {
    try {
      await cancelBooking(id);
      await fetchBookings();
    } catch {
      // The AppContext stores the API error.
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-gray-500">
          Loading your bookings...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-red-500 font-medium">
          {error}
        </p>

        <button
          onClick={fetchBookings}
          className="mt-4 bg-brand-500 hover:bg-brand-600 text-white font-medium px-4 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900">
        My Bookings
      </h1>

      <p className="text-gray-500 mt-1">
        Track the status of every service you've requested.
      </p>

      {bookings.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <PackageSearch
            className="mx-auto text-gray-300"
            size={48}
          />

          <p className="mt-3 font-medium">
            No bookings yet
          </p>

          <Link
            to="/"
            className="text-brand-500 font-medium mt-1 inline-block"
          >
            Find a professional to get started
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {bookings.map((booking) => {
            const bookingId =
              booking._id || booking.id;

            const professionalName =
              booking.professional?.name ||
              "Professional";

            const service =
              booking.service || "Service";

            const status =
              booking.status || "requested";

            return (
              <div
                key={bookingId}
                className="border border-gray-200 rounded-xl p-5 bg-white"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-400">
                      Booking #
                      {String(bookingId)
                        .slice(-6)
                        .toUpperCase()}
                    </p>

                    <h2 className="font-semibold text-gray-900 mt-0.5">
                      {service} with {professionalName}
                    </h2>

                    <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                      <CalendarClock size={14} />
                      {booking.date || "—"} at{" "}
                      {booking.time || "—"}
                    </p>

                    {booking.address && (
                      <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                        <MapPin size={14} />
                        {booking.address}
                      </p>
                    )}
                  </div>

                  {status.toLowerCase() !== "completed" && (
                    <button
                      onClick={() =>
                        handleCancel(bookingId)
                      }
                      className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <X size={14} />
                      Cancel
                    </button>
                  )}
                </div>

                {booking.issue && (
                  <p className="text-sm text-gray-600 mt-3 bg-gray-50 rounded-lg p-3">
                    {booking.issue}
                  </p>
                )}

                <div className="mt-5">
                  <StatusStepper status={status} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}