import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { registerCustomer } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const CustomerRegister = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const { data: res } = await registerCustomer(data);
      login(res.token, res.user, "customer");
      toast.success("Account created!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="glass-card p-8">
        <h1 className="text-2xl font-bold mb-1 text-center">Create Your Account</h1>
        <p className="text-sm text-slate-500 mb-6 text-center">Sign up to leave reviews and track your requests.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-semibold">Full Name</label>
            <input {...register("fullName", { required: "Required" })} className="input-field text-sm mt-1" />
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold">Mobile Number</label>
            <input {...register("mobile", { required: "Required" })} className="input-field text-sm mt-1" />
            {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile.message}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold">Email (Optional)</label>
            <input type="email" {...register("email")} className="input-field text-sm mt-1" />
          </div>
          <div>
            <label className="text-sm font-semibold">Password</label>
            <input type="password" {...register("password", { required: "Required", minLength: { value: 6, message: "Min 6 characters" } })} className="input-field text-sm mt-1" />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account? <Link to="/login" className="text-primary font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerRegister;
