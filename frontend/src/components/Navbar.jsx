import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaMoon, FaSun, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, userType, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  const dashboardPath =
    userType === "worker" ? "/worker/dashboard" : userType === "admin" ? "/admin" : "/";

  return (
    <header className="sticky top-0 z-50 glass-card rounded-none border-x-0 border-t-0">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl text-primary">
          <span className="bg-primary text-white rounded-lg w-8 h-8 flex items-center justify-center text-sm">WC</span>
          WorkerConnect
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/search" className="hover:text-primary transition">Find Workers</Link>
          <Link to="/register/worker" className="hover:text-primary transition">Join as Worker</Link>
          {!user && <Link to="/login" className="hover:text-primary transition">Login</Link>}
          {user && (
            <>
              <Link to={dashboardPath} className="flex items-center gap-1 hover:text-primary transition">
                <FaUserCircle /> {user.fullName?.split(" ")[0]}
              </Link>
              <button onClick={handleLogout} className="text-red-500 hover:text-red-600">Logout</button>
            </>
          )}
          <button onClick={toggleTheme} aria-label="Toggle dark mode" className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50">
            {dark ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        <button className="md:hidden text-2xl" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 text-sm font-medium">
          <Link to="/search" onClick={() => setOpen(false)}>Find Workers</Link>
          <Link to="/register/worker" onClick={() => setOpen(false)}>Join as Worker</Link>
          {!user && <Link to="/login" onClick={() => setOpen(false)}>Login</Link>}
          {user && (
            <>
              <Link to={dashboardPath} onClick={() => setOpen(false)}>Dashboard</Link>
              <button onClick={handleLogout} className="text-left text-red-500">Logout</button>
            </>
          )}
          <button onClick={toggleTheme} className="text-left flex items-center gap-2">
            {dark ? <FaSun /> : <FaMoon />} {dark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
