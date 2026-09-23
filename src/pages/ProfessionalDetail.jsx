import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MapPin, BadgeCheck, ArrowLeft, CheckCircle2 } from "lucide-react";
import { professionals } from "../data/mockData";
import { useApp } from "../context/AppContext";
import StarRating from "../components/StarRating";

export default function ProfessionalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addBooking } = useApp();
  const pro = professionals.find((p) => p.id === id);

  const [form, setForm] = useState({ date: "", time: "", address: "", issue: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!pro) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-lg font-medium text-gray-900">Professional not found</p>
        <Link to="/" className="text-brand-500 font-medium mt-2 inline-block">Back to search</Link>
      </div>
    );
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const next = {};
    if (!form.date) next.date = "Please select a date.";
    if (!form.time) next.time = "Please select a time slot.";
    if (!form.address.trim()) next.address = "Service address is required.";
    if (!form.issue.trim()) next.issue = "Please briefly describe the issue.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    addBooking({ professionalId: pro.id, category: pro.categoryLabel, ...form });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto text-emerald-500" size={56} />
        <h1 className="text-2xl font-bold text-gray-900 mt-4">Booking request sent!</h1>
        <p className="text-gray-500 mt-2">
          {pro.name} will be notified and can accept your request. You can track its
          status from your dashboard.
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-brand-500 hover:bg-brand-600 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            View My Bookings
          </button>
          <Link
            to="/"
            className="border border-gray-200 hover:border-brand-300 text-gray-700 font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Profile column */}
        <div className="md:col-span-3">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xl shrink-0">
              {pro.avatar}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-2xl font-bold text-gray-900">{pro.name}</h1>
                {pro.verified && <BadgeCheck size={20} className="text-brand-500" aria-label="Verified professional" />}
              </div>
              <p className="text-gray-500">{pro.categoryLabel} &bull; {pro.experience} years experience</p>
              <div className="flex items-center gap-3 mt-2 text-sm">
                <StarRating rating={pro.rating} count={pro.reviewCount} />
                <span className="text-gray-300">|</span>
                <span className="text-gray-600">{pro.priceRange} &bull; ~${pro.hourlyRate}/hr</span>
              </div>
              <p className="flex items-center gap-1 text-sm text-gray-400 mt-1">
                <MapPin size={13} /> {pro.serviceArea}
              </p>
            </div>
          </div>

          <p className="text-gray-600 mt-6 leading-relaxed">{pro.bio}</p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
            Reviews ({pro.reviews.length})
          </h2>
          <div className="space-y-3">
            {pro.reviews.map((r) => (
              <div key={r.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 text-sm">{r.author}</span>
                  <StarRating rating={r.rating} showNumber={false} />
                </div>
                <p className="text-sm text-gray-600 mt-1.5">{r.comment}</p>
                <p className="text-xs text-gray-400 mt-1">{r.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Booking form column */}
        <div className="md:col-span-2">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="border border-gray-200 rounded-xl p-5 sticky top-20 bg-white"
          >
            <h2 className="font-semibold text-gray-900 mb-4">Book {pro.name}</h2>

            <div className="mb-3">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                aria-invalid={!!errors.date}
                aria-describedby={errors.date ? "date-error" : undefined}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.date ? "border-red-400" : "border-gray-200"}`}
              />
              {errors.date && <p id="date-error" className="text-xs text-red-500 mt-1">{errors.date}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time slot</label>
              <select
                id="time"
                value={form.time}
                onChange={(e) => update("time", e.target.value)}
                aria-invalid={!!errors.time}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.time ? "border-red-400" : "border-gray-200"}`}
              >
                <option value="">Select a time</option>
                {["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Service address</label>
              <input
                id="address"
                type="text"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="Flat, street, area"
                aria-invalid={!!errors.address}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.address ? "border-red-400" : "border-gray-200"}`}
              />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="issue" className="block text-sm font-medium text-gray-700 mb-1">Describe the issue</label>
              <textarea
                id="issue"
                rows={3}
                value={form.issue}
                onChange={(e) => update("issue", e.target.value)}
                placeholder="What needs fixing?"
                aria-invalid={!!errors.issue}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none ${errors.issue ? "border-red-400" : "border-gray-200"}`}
              />
              {errors.issue && <p className="text-xs text-red-500 mt-1">{errors.issue}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              Submit Booking Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
