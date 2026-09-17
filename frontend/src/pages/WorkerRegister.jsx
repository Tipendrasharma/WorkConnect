import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaCrosshairs } from "react-icons/fa";
import { registerWorker } from "../services/authService";
import { OCCUPATIONS } from "../utils/constants";
import { useGeolocation } from "../hooks/useGeolocation";
import { useAuth } from "../context/AuthContext";

const WorkerRegister = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [photoFile, setPhotoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { coords, loading: geoLoading, requestLocation } = useGeolocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    if (!coords) {
      toast.error("Please share your location so customers can find you nearby");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, value));
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      if (photoFile) formData.append("profilePhoto", photoFile);

      const { data: res } = await registerWorker(formData);
      login(res.token, res.user, "worker");
      toast.success("Profile created! Welcome to WorkerConnect.");
      navigate("/worker/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="glass-card p-6 sm:p-8">
        <h1 className="text-2xl font-bold mb-1">Join as a Skilled Worker</h1>
        <p className="text-sm text-slate-500 mb-6">Create your free profile and start getting hired nearby.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" encType="multipart/form-data">
          <div>
            <label className="text-sm font-semibold">Profile Photo</label>
            <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} className="input-field text-sm mt-1" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold">Full Name *</label>
              <input {...register("fullName", { required: "Full name is required" })} className="input-field text-sm mt-1" />
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold">Mobile Number *</label>
              <input {...register("mobile", { required: "Mobile number is required" })} className="input-field text-sm mt-1" />
              {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile.message}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold">Email (Optional)</label>
              <input type="email" {...register("email")} className="input-field text-sm mt-1" />
            </div>
            <div>
              <label className="text-sm font-semibold">Password *</label>
              <input type="password" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })} className="input-field text-sm mt-1" />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold">Occupation *</label>
              <select {...register("occupation", { required: true })} className="input-field text-sm mt-1">
                {OCCUPATIONS.map((occ) => <option key={occ} value={occ}>{occ}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold">Experience (years) *</label>
              <input type="number" min="0" {...register("experience", { required: true })} className="input-field text-sm mt-1" />
            </div>
            <div>
              <label className="text-sm font-semibold">Daily Wage (₹) *</label>
              <input type="number" min="0" {...register("dailyWage", { required: true })} className="input-field text-sm mt-1" />
            </div>
            <div>
              <label className="text-sm font-semibold">Hourly Wage (₹)</label>
              <input type="number" min="0" {...register("hourlyWage")} className="input-field text-sm mt-1" />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">Address *</label>
            <input {...register("address", { required: true })} className="input-field text-sm mt-1" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold">District *</label>
              <input {...register("district", { required: true })} className="input-field text-sm mt-1" />
            </div>
            <div>
              <label className="text-sm font-semibold">State *</label>
              <input {...register("state", { required: true })} className="input-field text-sm mt-1" />
            </div>
            <div>
              <label className="text-sm font-semibold">Pincode *</label>
              <input {...register("pincode", { required: true })} className="input-field text-sm mt-1" />
            </div>
          </div>

          <div>
            <button type="button" onClick={requestLocation} className="btn-outline text-sm w-full">
              <FaCrosshairs /> {geoLoading ? "Detecting location..." : coords ? "Location Captured ✓" : "Detect My GPS Location *"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold">Availability</label>
              <select {...register("availability")} className="input-field text-sm mt-1">
                <option>Available Now</option>
                <option>Busy</option>
                <option>Offline</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold">Working Hours</label>
              <input {...register("workingHours")} placeholder="9:00 AM - 6:00 PM" className="input-field text-sm mt-1" />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">Languages Spoken (comma separated)</label>
            <input {...register("languagesSpoken")} placeholder="Hindi, English" className="input-field text-sm mt-1" />
          </div>

          <div>
            <label className="text-sm font-semibold">Skills (comma separated)</label>
            <input {...register("skills")} placeholder="Wiring, Fan Installation" className="input-field text-sm mt-1" />
          </div>

          <div>
            <label className="text-sm font-semibold">About You</label>
            <textarea {...register("description")} rows={3} className="input-field text-sm mt-1" />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Creating Profile..." : "Create My Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkerRegister;
