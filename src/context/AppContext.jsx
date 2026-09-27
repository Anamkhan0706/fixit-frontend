import { createContext, useContext, useEffect, useState } from "react";
import { initialBookings } from "../data/mockData";

const AppContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const STORAGE_KEY = "fixit_bookings_v1";

export function AppProvider({ children }) {
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialBookings;
    } catch {
      return initialBookings;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      // localStorage unavailable
    }
  }, [bookings]);

  async function addBooking(newBooking) {
    setLoading(true);
    setError("");

    try {
      const token = window.localStorage.getItem("fixit_token");

      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newBooking),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking.");
      }

      const booking = data.booking || data;

      setBookings((prev) => [booking, ...prev]);

      return booking;
    } catch (err) {
      const message = err.message || "Something went wrong while creating the booking.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function cancelBooking(id) {
    setLoading(true);
    setError("");

    try {
      const token = window.localStorage.getItem("fixit_token");

      const response = await fetch(`${API_URL}/bookings/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel booking.");
      }

      setBookings((prev) => prev.filter((booking) => booking.id !== id && booking._id !== id));
    } catch (err) {
      const message = err.message || "Something went wrong while cancelling the booking.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function clearError() {
    setError("");
  }

  return (
    <AppContext.Provider
      value={{
        bookings,
        addBooking,
        cancelBooking,
        loading,
        error,
        clearError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error("useApp must be used within an AppProvider");
  }

  return ctx;
}