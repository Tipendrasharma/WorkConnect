import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEye, FaStar, FaBell, FaTrash, FaCamera } from "react-icons/fa";
import {
  getWorkerDashboard, updateWorkerProfile, updateAvailability, deleteMyAccount,
} from "../services/workerService";
import { useAuth } from "../context/AuthContext";
import { OCCUPATIONS, AVAILABILITY_COLORS } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const WorkerDashboard = () => {
  const { user, setUser, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      fullName: user?.fullName, email: user?.email, occupation: user?.occupation,
      experience: user?.experience, dailyWage: user?.dailyWage, hourlyWage: user?.hourlyWage,
      description: user?.description,
    },
  });

  useEffect(() => {
    getWorkerDashboard()
      .then(({ data }) => { setStats(data.stats); setActivity(data.recentActivity); })
      .catch(() => {});
  }, []);

  const onAvailabilityChange = async (value) => {
    try {
      const { data } = await updateAvailability(value);
      setUser(data.worker);
      toast.success("Availability updated");
    } catch {
      toast.error("Failed to update availability");
    }
  };

  const onSaveProfile = async (formData) => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => v !== undefined && fd.append(k, v));
      if (photoFile) fd.append("profilePhoto", photoFile);
      const { data } = await updateWorkerProfile(fd);
      setUser(data.worker);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const onDeleteAccount = async () => {
    if (!window.confirm("This will permanently delete your profile. Continue?")) return;
    await deleteMyAccount();
    logout();
    toast.success("Account deleted");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Worker Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 flex items-center gap-3">
          <FaEye className="text-primary text-2xl" />
          <div><p className="text-xl font-bold">{stats?.profileViews ?? "-"}</p><p className="text-xs text-slate-500">Profile Views</p></div>
        </div>
        <div className="glass-card p-5 flex items-center gap-3">
          <FaStar className="text-amber-400 text-2xl" />
          <div><p className="text-xl font-bold">{stats?.rating ?? "-"} <span className="text-xs font-normal text-slate-400">({stats?.reviewCount ?? 0})</span></p><p className="text-xs text-slate-500">Rating</p></div>
        </div>
        <div className="glass-card p-5 flex items-center gap-3">
          <FaBell className="text-accent text-2xl" />
          <div><p className="text-xl font-bold">{stats?.unreadNotifications ?? "-"}</p><p className="text-xs text-slate-500">New Notifications</p></div>
        </div>
      </div>

      {/* Availability */}
      <div className="glass-card p-5">
        <h2 className="font-semibold mb-3">Availability Status</h2>
        <div className="flex gap-2">
          {["Available Now", "Busy", "Offline"].map((a) => (
            <button
              key={a}
              onClick={() => onAvailabilityChange(a)}
              className={`badge px-4 py-2 ${user.availability === a ? AVAILABILITY_COLORS[a] : "bg-slate-100 text-slate-500"}`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="glass-card p-5">
        <h2 className="font-semibold mb-3">Recent Activity</h2>
        {activity.length === 0 && <p className="text-sm text-slate-500">No activity yet.</p>}
        <ul className="space-y-2 text-sm">
          {activity.map((a) => (
            <li key={a._id} className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2 last:border-0">
              <span>
                {a.type === "view" && "Someone viewed your profile"}
                {a.type === "call" && "Someone called you"}
                {a.type === "whatsapp" && "Someone messaged you on WhatsApp"}
                {a.type === "rating" && "Someone rated your profile"}
              </span>
              <span className="text-slate-400">{new Date(a.createdAt).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Edit profile */}
      <div className="glass-card p-5">
        <h2 className="font-semibold mb-3">Edit Profile</h2>
        <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={user.profilePhoto || "https://api.dicebear.com/7.x/initials/svg?seed=" + encodeURIComponent(user.fullName)}
              className="w-16 h-16 rounded-full object-cover"
              alt="Profile"
            />
            <label className="btn-outline text-sm cursor-pointer">
              <FaCamera /> Change Photo
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setPhotoFile(e.target.files[0])} />
            </label>
            {photoFile && <span className="text-xs text-slate-500">{photoFile.name}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold">Full Name</label>
              <input {...register("fullName")} className="input-field text-sm mt-1" />
            </div>
            <div>
              <label className="text-sm font-semibold">Email</label>
              <input {...register("email")} className="input-field text-sm mt-1" />
            </div>
            <div>
              <label className="text-sm font-semibold">Occupation</label>
              <select {...register("occupation")} className="input-field text-sm mt-1">
                {OCCUPATIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold">Experience (years)</label>
              <input type="number" {...register("experience")} className="input-field text-sm mt-1" />
            </div>
            <div>
              <label className="text-sm font-semibold">Daily Wage (₹)</label>
              <input type="number" {...register("dailyWage")} className="input-field text-sm mt-1" />
            </div>
            <div>
              <label className="text-sm font-semibold">Hourly Wage (₹)</label>
              <input type="number" {...register("hourlyWage")} className="input-field text-sm mt-1" />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">About</label>
            <textarea {...register("description")} rows={3} className="input-field text-sm mt-1" />
          </div>

          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="glass-card p-5 border border-red-200">
        <h2 className="font-semibold mb-2 text-red-500">Danger Zone</h2>
        <p className="text-sm text-slate-500 mb-3">Deleting your account is permanent and cannot be undone.</p>
        <button onClick={onDeleteAccount} className="btn-outline text-sm text-red-500 border-red-300">
          <FaTrash /> Delete My Account
        </button>
      </div>
    </div>
  );
};

export default WorkerDashboard;
