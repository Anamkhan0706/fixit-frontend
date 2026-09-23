import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Wrench } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "My Bookings" },
  { to: "/login", label: "Log In" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-brand-500" onClick={() => setOpen(false)}>
          <span className="bg-brand-500 text-white rounded-lg w-8 h-8 flex items-center justify-center">
            <Wrench size={18} />
          </span>
          FixIt
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-brand-50 text-brand-600" : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg text-sm font-medium ${
                  isActive ? "bg-brand-50 text-brand-600" : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
