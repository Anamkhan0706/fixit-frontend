import { Check } from "lucide-react";
import { BOOKING_STATUSES } from "../data/mockData";

const STATUS_MAP = {
  pending: "Requested",
  confirmed: "Accepted",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function StatusStepper({ status }) {
  const backendStatus = String(status || "").toLowerCase();
  const displayStatus =
    STATUS_MAP[backendStatus] || status;

  const normalizedStatus = String(displayStatus || "")
    .toLowerCase()
    .replace(/\s+/g, "");

  const currentIndex = BOOKING_STATUSES.findIndex(
    (step) =>
      step.toLowerCase().replace(/\s+/g, "") ===
      normalizedStatus
  );

  const isCancelled = backendStatus === "cancelled";

  return (
    <div
      className="flex items-center w-full"
      role="list"
      aria-label="Booking status"
    >
      {BOOKING_STATUSES.map((step, i) => {
        const done =
          !isCancelled &&
          currentIndex >= 0 &&
          i <= currentIndex;

        const isLast =
          i === BOOKING_STATUSES.length - 1;

        return (
          <div
            key={step}
            className="flex items-center flex-1 last:flex-none"
          >
            <div
              className="flex flex-col items-center gap-1"
              role="listitem"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  done
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {done ? (
                  <Check size={14} />
                ) : (
                  i + 1
                )}
              </div>

              <span
                className={`text-[11px] whitespace-nowrap ${
                  done
                    ? "text-gray-900 font-medium"
                    : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>

            {!isLast && (
              <div
                className={`h-0.5 flex-1 mx-1 mb-4 ${
                  done && i < currentIndex
                    ? "bg-emerald-500"
                    : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}