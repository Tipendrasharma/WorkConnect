import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaCrosshairs } from "react-icons/fa";
import toast from "react-hot-toast";
import { OCCUPATIONS } from "../utils/constants";
import { useGeolocation } from "../hooks/useGeolocation";

const SearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const navigate = useNavigate();
  const { coords, loading, requestLocation } = useGeolocation();

  const handleUseLocation = () => {
    requestLocation();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (category) params.set("category", category);

    if (coords) {
      params.set("lat", coords.lat);
      params.set("lng", coords.lng);
    } else if (city) {
      params.set("city", city);
    } else {
      toast("Tip: use your location or enter a city for nearest results", { icon: "📍" });
    }
    navigate(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="glass-card p-4 sm:p-6 w-full max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white/80 dark:bg-slate-900/50 rounded-xl px-3 border border-slate-200 dark:border-slate-700">
          <FaSearch className="text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search: Painter, Electrician, Plumber..."
            className="w-full py-2.5 bg-transparent outline-none text-sm"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field sm:w-48 text-sm"
        >
          <option value="">All Categories</option>
          {OCCUPATIONS.map((occ) => (
            <option key={occ} value={occ}>{occ}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-3">
        <div className="flex-1 flex items-center gap-2 bg-white/80 dark:bg-slate-900/50 rounded-xl px-3 border border-slate-200 dark:border-slate-700">
          <FaMapMarkerAlt className="text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={coords ? "Using your current location" : city}
            onChange={(e) => setCity(e.target.value)}
            disabled={!!coords}
            placeholder="Enter city or area"
            className="w-full py-2.5 bg-transparent outline-none text-sm disabled:text-accent"
          />
        </div>
        <button
          type="button"
          onClick={handleUseLocation}
          disabled={loading}
          className="btn-outline text-sm whitespace-nowrap"
        >
          <FaCrosshairs /> {loading ? "Locating..." : "Use My Location"}
        </button>
        <button type="submit" className="btn-primary text-sm whitespace-nowrap px-8">Search</button>
      </div>
    </form>
  );
};

export default SearchBar;
