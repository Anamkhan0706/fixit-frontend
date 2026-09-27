import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Wrench } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = Boolean(
    window.localStorage.getItem("fixit_token")
  );

  function closeMenu() {
    setOpen(false);
  }

  function handleLogout() {
    window.localStorage.removeItem("fixit_token");
    window.localStorage.removeItem("fixit_user");

    closeMenu();
    navigate("/login");
  }

  const links = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "My Bookings" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl text-brand-500"
          onClick={closeMenu}
        >
          <span className="bg-brand-500 text-white rounded-lg w-8 h-8 flex items-center justify-center">
            <Wrench size={18} />
          </span>
          FixIt
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Log Out
            </button>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              Log In
            </NavLink>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={closeMenu}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-brand-50 text-brand-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Log Out
            </button>
          ) : (
            <NavLink
              to="/login"
              onClick={closeMenu}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-brand-50 text-brand-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              Log In
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
}