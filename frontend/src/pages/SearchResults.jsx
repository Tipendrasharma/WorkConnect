import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { FaCrosshairs } from "react-icons/fa";
import WorkerCard from "../components/WorkerCard";
import WorkerCardSkeleton from "../components/WorkerCardSkeleton";
import FilterPanel from "../components/FilterPanel";
import { searchWorkers } from "../services/workerService";
import { useGeolocation } from "../hooks/useGeolocation";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const { coords, requestLocation } = useGeolocation();

  const [filters, setFilters] = useState({
    sortBy: searchParams.get("sortBy") || "nearest",
    radius: Number(searchParams.get("radius")) || 10,
    minExperience: searchParams.get("minExperience") || "",
    verifiedOnly: searchParams.get("verifiedOnly") || "",
  });

  const category = searchParams.get("category") || "";
  const keyword = searchParams.get("keyword") || "";
  const lat = searchParams.get("lat") || coords?.lat;
  const lng = searchParams.get("lng") || coords?.lng;

  const fetchWorkers = useCallback(() => {
    setLoading(true);
    searchWorkers({
      category, keyword, lat, lng, page,
      radius: filters.radius,
      sortBy: filters.sortBy,
      minExperience: filters.minExperience || undefined,
      verifiedOnly: filters.verifiedOnly || undefined,
    })
      .then(({ data }) => {
        setWorkers(data.workers);
        setPages(data.pages || 1);
      })
      .catch(() => setWorkers([]))
      .finally(() => setLoading(false));
  }, [category, keyword, lat, lng, page, filters]);

  useEffect(() => { fetchWorkers(); }, [fetchWorkers]);
  useEffect(() => { setPage(1); }, [category, keyword, lat, lng, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">
          {category ? `${category}s` : "All Workers"} {keyword && `matching "${keyword}"`}
        </h1>
        {!lat && (
          <button onClick={requestLocation} className="btn-outline text-sm">
            <FaCrosshairs /> Use My Location for Nearest Results
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <FilterPanel filters={filters} setFilters={setFilters} />
        </div>

        <div className="md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <WorkerCardSkeleton key={i} />)
              : workers.length
              ? workers.map((w) => <WorkerCard key={w._id} worker={w} />)
              : (
                <div className="col-span-full text-center py-16 text-slate-500">
                  <p className="font-semibold mb-1">No workers found nearby.</p>
                  <p className="text-sm">Try increasing the search radius or a different category.</p>
                </div>
              )}
          </div>

          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-full text-sm font-semibold ${
                    page === i + 1 ? "bg-primary text-white" : "border border-slate-300 dark:border-slate-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
