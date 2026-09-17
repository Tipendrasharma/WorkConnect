import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const [userType, setUserType] = useState("customer");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const { data: res } = await loginUser({ ...data, userType });
      login(res.token, res.user, res.userType);
      toast.success(`Welcome back, ${res.user.fullName.split(" ")[0]}!`);
      navigate(res.userType === "worker" ? "/worker/dashboard" : "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="glass-card p-8">
        <h1 className="text-2xl font-bold mb-1 text-center">Welcome Back</h1>
        <p className="text-sm text-slate-500 mb-6 text-center">Log in to WorkerConnect</p>

        <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          {["customer", "worker"].map((t) => (
            <button
              key={t}
              onClick={() => setUserType(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition ${
                userType === t ? "bg-white dark:bg-slate-700 shadow" : "text-slate-500"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-semibold">Mobile Number</label>
            <input {...register("mobile", { required: true })} className="input-field text-sm mt-1" />
          </div>
          <div>
            <label className="text-sm font-semibold">Password</label>
            <input type="password" {...register("password", { required: true })} className="input-field text-sm mt-1" />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500 mt-4">
          Forgot password? <span className="text-primary cursor-not-allowed" title="Requires SMS/email provider setup">Reset</span>
        </p>
        <p className="text-sm text-center mt-4">
          New here?{" "}
          {userType === "worker" ? (
            <Link to="/register/worker" className="text-primary font-semibold">Register as Worker</Link>
          ) : (
            <Link to="/register/customer" className="text-primary font-semibold">Create Customer Account</Link>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
