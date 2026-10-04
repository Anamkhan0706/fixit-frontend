import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  Bell,
  CheckCircle,
  Clock,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

function ProfessionalDashboard() {
  const token = localStorage.getItem("fixit_token");

  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [lastKnownBookingIds, setLastKnownBookingIds] =
    useState([]);

  const lastKnownBookingIdsRef =
    useRef([]);

  const [showNotification, setShowNotification] =
    useState(false);

  const [notificationCount, setNotificationCount] =
    useState(0);

  const [notificationInitialized, setNotificationInitialized] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    service: "",
    experience: "",
    description: "",
    location: "",
    price: "",
    availability: true,
  });

  const loadBookings = async (
    checkForNewOrders = false
  ) => {
    if (!token) return;

    try {
      setBookingsLoading(true);

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
          data.message || "Failed to load bookings"
        );
      }

      const currentBookings =
        data.bookings || [];

      const currentBookingIds =
        currentBookings.map(
          (booking) => booking._id
        );

      if (!notificationInitialized) {
        setLastKnownBookingIds(
          currentBookingIds
        );

        lastKnownBookingIdsRef.current =
          currentBookingIds;

        setNotificationInitialized(true);
      } else if (checkForNewOrders) {
        const newPendingBookings =
          currentBookings.filter(
            (booking) =>
              booking.status === "pending" &&
              !lastKnownBookingIdsRef.current.includes(
                booking._id
              )
          );

        if (newPendingBookings.length > 0) {
          setNotificationCount(
            (previousCount) =>
              previousCount +
              newPendingBookings.length
          );

          setShowNotification(true);
        }

        setLastKnownBookingIds(
          currentBookingIds
        );

        lastKnownBookingIdsRef.current =
          currentBookingIds;
      }

      setBookings(currentBookings);
    } catch (err) {
      console.error(
        "Load bookings error:",
        err
      );

      setError(err.message);
    } finally {
      setBookingsLoading(false);
    }
  };

  const loadProfessionalData =
    async () => {
      if (!token) {
        setError(
          "You must be logged in as a professional."
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const profileResponse =
          await fetch(
            `${API_URL}/professionals`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const profileData =
          await profileResponse.json();

        if (!profileResponse.ok) {
          throw new Error(
            profileData.message ||
              "Failed to load professional profile"
          );
        }

        const professionals =
          profileData.professionals || [];

        const userData = JSON.parse(
          localStorage.getItem(
            "fixit_user"
          ) || "null"
        );

        const currentProfessional =
          professionals.find(
            (professional) =>
              professional.user?._id ===
                userData?.id ||
              professional.user ===
                userData?.id
          );

        if (currentProfessional) {
          setProfile(
            currentProfessional
          );

          setFormData({
            name:
              currentProfessional.name ||
              "",
            service:
              currentProfessional.service ||
              "",
            experience:
              currentProfessional.experience ??
              "",
            description:
              currentProfessional.description ||
              "",
            location:
              currentProfessional.location ||
              "",
            price:
              currentProfessional.price ??
              "",
            availability:
              currentProfessional.availability ??
              true,
          });
        }

        await loadBookings(false);
      } catch (err) {
        console.error(
          "Load professional data error:",
          err
        );

        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadProfessionalData();
  }, []);

  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      loadBookings(true);
    }, 10000);

    return () =>
      clearInterval(interval);
  }, [token]);

  const handleInputChange = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleUpdateProfile =
    async (event) => {
      event.preventDefault();

      if (!profile?._id) {
        setError(
          "Professional profile not found."
        );
        return;
      }

      try {
        setError("");
        setSuccess("");

        const response =
          await fetch(
            `${API_URL}/professionals/${profile._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                name: formData.name,
                service:
                  formData.service,
                experience: Number(
                  formData.experience
                ),
                description:
                  formData.description,
                location:
                  formData.location,
                price: Number(
                  formData.price
                ),
                availability:
                  formData.availability,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to update profile"
          );
        }

        setProfile(
          data.professional
        );

        setFormData({
          name:
            data.professional.name ||
            "",
          service:
            data.professional.service ||
            "",
          experience:
            data.professional.experience ??
            "",
          description:
            data.professional.description ||
            "",
          location:
            data.professional.location ||
            "",
          price:
            data.professional.price ??
            "",
          availability:
            data.professional.availability ??
            true,
        });

        setSuccess(
          "Profile updated successfully."
        );
      } catch (err) {
        console.error(
          "Update profile error:",
          err
        );

        setError(err.message);
      }
    };

  const updateBookingStatus =
    async (
      bookingId,
      status
    ) => {
      try {
        setError("");
        setSuccess("");

        const response =
          await fetch(
            `${API_URL}/bookings/${bookingId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                status,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to update booking"
          );
        }

        setBookings((previous) =>
          previous.map(
            (booking) =>
              booking._id ===
              bookingId
                ? {
                    ...booking,
                    status:
                      data.booking?.status ||
                      status,
                  }
                : booking
          )
        );

        if (
          status ===
          "confirmed"
        ) {
          setSuccess(
            "Order accepted successfully."
          );
        }

        if (
          status ===
          "completed"
        ) {
          setSuccess(
            "Order marked as completed."
          );
        }

        if (
          status ===
            "confirmed" &&
          notificationCount > 0
        ) {
          setNotificationCount(
            (previousCount) =>
              Math.max(
                previousCount - 1,
                0
              )
          );
        }
      } catch (err) {
        console.error(
          "Update booking status error:",
          err
        );

        setError(err.message);
      }
    };

  const viewOrders = () => {
    setShowNotification(false);

    const ordersSection =
      document.getElementById(
        "customer-orders"
      );

    if (ordersSection) {
      ordersSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const pendingBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
        "pending"
    );

  const completedBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
        "completed"
    );

  const totalEarnings =
    completedBookings.reduce(
      (total, booking) =>
        total +
        Number(
          booking.amount || 0
        ),
      0
    );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">
          Loading professional dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Professional Dashboard
            </h1>

            <p className="text-slate-600 mt-1">
              Manage your FixIt
              profile and customer
              orders.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
            <Bell
              size={20}
              className="text-blue-600"
            />

            <span className="font-semibold text-slate-800">
              Notifications
            </span>

            {notificationCount >
              0 && (
              <span className="min-w-6 h-6 px-2 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                {
                  notificationCount
                }
              </span>
            )}
          </div>
        </div>

        {/* Notification */}
        {showNotification &&
          notificationCount >
            0 && (
            <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Bell
                    size={22}
                    className="text-blue-600 mt-1"
                  />

                  <div>
                    <h2 className="font-bold text-blue-900">
                      New customer order
                    </h2>

                    <p className="text-sm text-blue-800 mt-1">
                      You have a new
                      booking waiting
                      for your response.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={
                      viewOrders
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                  >
                    View Orders
                    <ArrowDown
                      size={16}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setShowNotification(
                        false
                      )
                    }
                    className="px-4 py-2 rounded-lg bg-white border border-blue-200 text-blue-700 font-semibold hover:bg-blue-100"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            {success}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Earnings
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-2">
                  ₹
                  {totalEarnings.toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <span className="text-2xl">
                  ₹
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-500 mt-3">
              From completed
              orders
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Completed Jobs
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {
                    completedBookings.length
                  }
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle
                  size={26}
                  className="text-green-600"
                />
              </div>
            </div>

            <p className="text-sm text-slate-500 mt-3">
              Successfully
              completed
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Pending Orders
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {
                    pendingBookings.length
                  }
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Clock
                  size={26}
                  className="text-yellow-600"
                />
              </div>
            </div>

            <p className="text-sm text-slate-500 mt-3">
              Waiting for your
              response
            </p>
          </div>
        </div>

        {/* Earnings History */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Earnings History
              </h2>

              <p className="text-slate-600 mt-1">
                Earnings from your
                completed customer
                orders.
              </p>
            </div>

            <div className="text-left md:text-right">
              <p className="text-sm text-slate-500">
                Total earned
              </p>

              <p className="text-2xl font-bold text-green-600">
                ₹
                {totalEarnings.toLocaleString(
                  "en-IN"
                )}
              </p>
            </div>
          </div>

          {completedBookings.length ===
          0 ? (
            <div className="text-center py-8 border border-dashed border-slate-300 rounded-xl">
              <p className="text-slate-500">
                No completed jobs yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedBookings.map(
                (booking) => (
                  <div
                    key={booking._id}
                    className="border border-slate-200 rounded-xl p-5"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          {
                            booking.service
                          }
                        </h3>

                        <p className="text-sm text-slate-600 mt-1">
                          <strong>
                            Customer:
                          </strong>{" "}
                          {booking.user
                            ?.name ||
                            "Unknown customer"}
                        </p>

                        <p className="text-sm text-slate-600 mt-1">
                          <strong>
                            Date:
                          </strong>{" "}
                          {booking.date}
                        </p>

                        <p className="text-sm text-slate-600 mt-1">
                          <strong>
                            Time:
                          </strong>{" "}
                          {booking.time}
                        </p>
                      </div>

                      <div className="text-left md:text-right">
                        <p className="text-xl font-bold text-green-600">
                          ₹
                          {Number(
                            booking.amount ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                        <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                          <CheckCircle
                            size={14}
                          />
                          Completed
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900">
            Orders waiting for your
            response
          </h2>

          <p className="text-slate-600 mt-1">
            You currently have{" "}
            <strong>
              {
                pendingBookings.length
              }
            </strong>{" "}
            pending customer{" "}
            {pendingBookings.length ===
            1
              ? "order"
              : "orders"}
            .
          </p>
        </div>

        {/* Profile */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Edit Your Profile
          </h2>

          <form
            onSubmit={
              handleUpdateProfile
            }
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Professional Name
              </label>

              <input
                type="text"
                name="name"
                value={
                  formData.name
                }
                onChange={
                  handleInputChange
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Service
              </label>

              <input
                type="text"
                name="service"
                value={
                  formData.service
                }
                onChange={
                  handleInputChange
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Years of Experience
              </label>

              <input
                type="number"
                name="experience"
                min="0"
                value={
                  formData.experience
                }
                onChange={
                  handleInputChange
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <p className="text-xs text-slate-500 mt-1">
                Enter the number
                of years you
                have worked
                professionally
                in this service.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={
                  formData.location
                }
                onChange={
                  handleInputChange
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Price per hour
              </label>

              <input
                type="number"
                name="price"
                min="0"
                value={
                  formData.price
                }
                onChange={
                  handleInputChange
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center gap-3 pt-8">
              <input
                type="checkbox"
                name="availability"
                checked={
                  formData.availability
                }
                onChange={
                  handleInputChange
                }
                className="w-5 h-5"
              />

              <label className="text-sm font-semibold text-slate-700">
                I am currently
                available for
                bookings
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={
                  formData.description
                }
                onChange={
                  handleInputChange
                }
                rows="4"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>

        {/* Customer Orders */}
        <div
          id="customer-orders"
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 scroll-mt-24"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Customer Orders
              </h2>

              <p className="text-slate-600 mt-1">
                Manage bookings from
                your customers.
              </p>
            </div>

            {bookingsLoading && (
              <span className="text-sm text-slate-500">
                Refreshing...
              </span>
            )}
          </div>

          {bookings.length ===
          0 ? (
            <div className="text-center py-10">
              <p className="text-slate-500">
                No customer orders
                yet.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {bookings.map(
                (booking) => (
                  <div
                    key={
                      booking._id
                    }
                    className="border border-slate-200 rounded-xl p-5"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {
                            booking.service
                          }
                        </h3>

                        <p className="text-slate-700 mt-2">
                          <strong>
                            Customer:
                          </strong>{" "}
                          {booking.user
                            ?.name ||
                            "Unknown customer"}
                        </p>

                        {booking.user
                          ?.email && (
                          <p className="text-sm text-slate-500 mt-1">
                            {
                              booking
                                .user
                                .email
                            }
                          </p>
                        )}

                        <p className="text-sm text-slate-600 mt-3">
                          <strong>
                            Date:
                          </strong>{" "}
                          {
                            booking.date
                          }
                        </p>

                        <p className="text-sm text-slate-600 mt-1">
                          <strong>
                            Time:
                          </strong>{" "}
                          {
                            booking.time
                          }
                        </p>

                        <p className="text-sm text-slate-600 mt-1">
                          <strong>
                            Amount:
                          </strong>{" "}
                          ₹
                          {Number(
                            booking.amount ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>

                      <div>
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                            booking.status ===
                            "completed"
                              ? "bg-green-100 text-green-700"
                              : booking.status ===
                                "confirmed"
                              ? "bg-blue-100 text-blue-700"
                              : booking.status ===
                                "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {
                            booking.status
                          }
                        </span>
                      </div>
                    </div>

                    {booking.status ===
                      "pending" && (
                      <div className="mt-5">
                        <button
                          type="button"
                          onClick={() =>
                            updateBookingStatus(
                              booking._id,
                              "confirmed"
                            )
                          }
                          className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                        >
                          Accept Order
                        </button>
                      </div>
                    )}

                    {booking.status ===
                      "confirmed" && (
                      <div className="mt-5">
                        <button
                          type="button"
                          onClick={() =>
                            updateBookingStatus(
                              booking._id,
                              "completed"
                            )
                          }
                          className="px-5 py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700"
                        >
                          Mark as Completed
                        </button>
                      </div>
                    )}

                    {booking.status ===
                      "completed" && (
                      <div className="mt-4 flex items-center gap-2 text-green-700 font-semibold">
                        <CheckCircle
                          size={18}
                        />
                        This order has
                        been completed.
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfessionalDashboard;