import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wrench } from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));

    setApiError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const next = {};

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = "Enter a valid email address.";
    }

    if (form.password.length < 6) {
      next.password =
        "Password must be at least 6 characters.";
    }

    setErrors(next);

    if (Object.keys(next).length > 0) {
      return;
    }

    try {
      setLoading(true);
      setApiError("");

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed. Please try again."
        );
      }

      if (!data.token) {
        throw new Error(
          "Login succeeded, but no authentication token was returned."
        );
      }

      window.localStorage.setItem(
        "fixit_token",
        data.token
      );

      if (data.user) {
        window.localStorage.setItem(
          "fixit_user",
          JSON.stringify(data.user)
        );
      }

      navigate("/dashboard");
    } catch (err) {
      setApiError(
        err.message ||
          "Unable to log in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <div className="text-center mb-6">
        <span className="bg-brand-500 text-white rounded-xl w-12 h-12 flex items-center justify-center mx-auto">
          <Wrench size={22} />
        </span>

        <h1 className="text-2xl font-bold text-gray-900 mt-3">
          Welcome back
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Log in to manage your bookings.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white border border-gray-200 rounded-xl p-6"
      >
        {apiError && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600"
          >
            {apiError}
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) =>
              update("email", e.target.value)
            }
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${
              errors.email
                ? "border-red-400"
                : "border-gray-200"
            }`}
          />

          {errors.email && (
            <p className="text-xs text-red-500 mt-1">
              {errors.email}
            </p>
          )}
        </div>

        <div className="mb-5">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) =>
              update("password", e.target.value)
            }
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${
              errors.password
                ? "border-red-400"
                : "border-gray-200"
            }`}
          />

          {errors.password && (
            <p className="text-xs text-red-500 mt-1">
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          Your login is securely verified by the FixIt backend.
        </p>
      </form>
    </div>
  );
}