import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaBan, FaUndo, FaTrash, FaSearch } from "react-icons/fa";
import api from "../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  const loadStats = () => api.get("/admin/dashboard").then(({ data }) => setStats(data.stats));
  const loadWorkers = (kw = "") =>
    api.get("/admin/workers", { params: { keyword: kw } }).then(({ data }) => setWorkers(data.workers));

  useEffect(() => {
    Promise.all([loadStats(), loadWorkers()]).finally(() => setLoading(false));
  }, []);

  const handleAction = async (action, id) => {
    try {
      if (action === "delete") {
        if (!window.confirm("Permanently delete this worker?")) return;
        await api.delete(`/admin/workers/${id}`);
      } else {
        await api.put(`/admin/workers/${id}/${action}`);
      }
      toast.success("Done");
      loadWorkers(keyword);
      loadStats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadWorkers(keyword);
  };

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-16 text-center">Loading admin panel...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Workers", value: stats?.totalWorkers },
          { label: "Categories", value: stats?.totalCategories },
          { label: "Suspended", value: stats?.suspendedWorkers },
          { label: "Most Searched", value: stats?.mostSearchedCategory },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className="text-xl font-bold truncate">{s.value ?? "-"}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search by name or mobile..."
          className="input-field text-sm flex-1"
        />
        <button type="submit" className="btn-primary text-sm"><FaSearch /> Search</button>
      </form>

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-slate-200 dark:border-slate-700">
              <th className="p-3">Name</th>
              <th className="p-3">Occupation</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((w) => (
              <tr key={w._id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="p-3 font-medium">{w.fullName}</td>
                <td className="p-3">{w.occupation}</td>
                <td className="p-3">{w.mobile}</td>
                <td className="p-3">
                  {w.isSuspended ? (
                    <span className="badge bg-red-100 text-red-600">Suspended</span>
                  ) : w.isVerified ? (
                    <span className="badge bg-accent/15 text-accent">Verified</span>
                  ) : (
                    <span className="badge bg-slate-100 text-slate-500">Unverified</span>
                  )}
                </td>
                <td className="p-3 flex gap-2 flex-wrap">
                  {!w.isVerified && (
                    <button onClick={() => handleAction("approve", w._id)} className="text-primary" title="Approve"><FaCheck /></button>
                  )}
                  {w.isSuspended ? (
                    <button onClick={() => handleAction("reinstate", w._id)} className="text-accent" title="Reinstate"><FaUndo /></button>
                  ) : (
                    <button onClick={() => handleAction("suspend", w._id)} className="text-amber-500" title="Suspend"><FaBan /></button>
                  )}
                  <button onClick={() => handleAction("delete", w._id)} className="text-red-500" title="Delete"><FaTrash /></button>
                </td>
              </tr>
            ))}
            {workers.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-slate-500">No workers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
