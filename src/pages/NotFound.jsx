import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <h1 className="text-5xl font-bold text-brand-500">404</h1>
      <p className="text-gray-600 mt-3">We couldn't find that page.</p>
      <Link to="/" className="text-brand-500 font-medium mt-4 inline-block">
        Back to Home
      </Link>
    </div>
  );
}
