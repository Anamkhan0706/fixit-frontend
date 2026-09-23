import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wrench } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    // This is a UI-only mock — Week 3 will wire this to POST /api/auth/login
    // from the backend described in the Week 1 report.
    if (Object.keys(next).length === 0) navigate("/dashboard");
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <div className="text-center mb-6">
        <span className="bg-brand-500 text-white rounded-xl w-12 h-12 flex items-center justify-center mx-auto">
          <Wrench size={22} />
        </span>
        <h1 className="text-2xl font-bold text-gray-900 mt-3">Welcome back</h1>
        <p className="text-gray-500 text-sm mt-1">Log in to manage your bookings.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.email ? "border-red-400" : "border-gray-200"}`}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            placeholder={"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"}
            aria-invalid={!!errors.password}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.password ? "border-red-400" : "border-gray-200"}`}
          />
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          Log In
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          Demo only — any valid-looking email &amp; a 6+ character password will work.
        </p>
      </form>
    </div>
  );
}
