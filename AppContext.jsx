import { createContext, useContext, useEffect, useState } from "react";
import { initialBookings } from "../data/mockData";

const AppContext = createContext(null);

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

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      // localStorage unavailable — app still works, just won't persist across reloads
    }
  }, [bookings]);

  function addBooking(newBooking) {
    setBookings((prev) => [
      { ...newBooking, id: `b${Date.now()}`, status: "Requested", createdAt: new Date().toISOString() },
      ...prev,
    ]);
  }

  function cancelBooking(id) {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <AppContext.Provider value={{ bookings, addBooking, cancelBooking }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within an AppProvider");
  return ctx;
}
