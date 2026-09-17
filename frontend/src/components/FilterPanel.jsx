import React from "react";
import { RADIUS_OPTIONS } from "../utils/constants";

const FilterPanel = ({ filters, setFilters }) => {
  const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="glass-card p-4 space-y-5 sticky top-20">
      <div>
        <h4 className="font-semibold text-sm mb-2">Sort By</h4>
        <select value={filters.sortBy} onChange={(e) => update("sortBy", e.target.value)} className="input-field text-sm">
          <option value="nearest">Nearest First</option>
          <option value="rating">Highest Rated</option>
          <option value="wage_low">Lowest Wage</option>
          <option value="availability">Availability</option>
        </select>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-2">Distance</h4>
        <div className="flex flex-wrap gap-2">
          {RADIUS_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => update("radius", r)}
              className={`text-xs px-3 py-1.5 rounded-full border ${
                filters.radius === r ? "bg-primary text-white border-primary" : "border-slate-300 dark:border-slate-600"
              }`}
            >
              {r} km
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-2">Minimum Experience</h4>
        <input
          type="number"
          min="0"
          value={filters.minExperience || ""}
          onChange={(e) => update("minExperience", e.target.value)}
          placeholder="e.g. 2 years"
          className="input-field text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={filters.verifiedOnly === "true"}
          onChange={(e) => update("verifiedOnly", e.target.checked ? "true" : "")}
          className="w-4 h-4 accent-primary"
        />
        Verified Only
      </label>
    </div>
  );
};

export default FilterPanel;
