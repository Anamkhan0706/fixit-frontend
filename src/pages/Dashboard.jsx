import { Link } from "react-router-dom";
import { CalendarClock, MapPin, X, PackageSearch } from "lucide-react";
import { professionals } from "../data/mockData";
import { useApp } from "../context/AppContext";
import StatusStepper from "../components/StatusStepper";

export default function Dashboard() {
  const { bookings, cancelBooking } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
      <p className="text-gray-500 mt-1">Track the status of every service you've requested.</p>

      {bookings.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <PackageSearch className="mx-auto text-gray-300" size={48} />
          <p className="mt-3 font-medium">No bookings yet</p>
          <Link to="/" className="text-brand-500 font-medium mt-1 inline-block">
            Find a professional to get started
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {bookings.map((b) => {
            const pro = professionals.find((p) => p.id === b.professionalId);
            return (
              <div key={b.id} className="border border-gray-200 rounded-xl p-5 bg-white">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-400">Booking #{b.id.slice(-6).toUpperCase()}</p>
                    <h2 className="font-semibold text-gray-900 mt-0.5">
                      {b.category} {pro ? `with ${pro.name}` : ""}
                    </h2>
                    <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                      <CalendarClock size={14} /> {b.date || "\u2014"} at {b.time || "\u2014"}
                    </p>
                    <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                      <MapPin size={14} /> {b.address}
                    </p>
                  </div>

                  {b.status !== "Completed" && (
                    <button
                      onClick={() => cancelBooking(b.id)}
                      className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <X size={14} /> Cancel
                    </button>
                  )}
                </div>

                {b.issue && (
                  <p className="text-sm text-gray-600 mt-3 bg-gray-50 rounded-lg p-3">{b.issue}</p>
                )}

                <div className="mt-5">
                  <StatusStepper status={b.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
