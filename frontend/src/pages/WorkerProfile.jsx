import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaPhoneAlt, FaWhatsapp, FaShareAlt, FaCheckCircle, FaStar,
  FaMapMarkerAlt, FaClock, FaLanguage, FaThumbsUp, FaFlag,
} from "react-icons/fa";
import { getWorkerById, logContact } from "../services/workerService";
import { getWorkerReviews, createReview, likeReview, reportReview } from "../services/reviewService";
import { formatCurrency, buildWhatsAppLink, buildCallLink } from "../utils/format";
import { AVAILABILITY_COLORS } from "../utils/constants";
import MapView from "../components/MapView";
import StarRating from "../components/StarRating";
import { useAuth } from "../context/AuthContext";

const WorkerProfile = () => {
  const { id } = useParams();
  const { user, userType } = useAuth();
  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRating, setNewRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = () => getWorkerReviews(id).then(({ data }) => setReviews(data.reviews));

  useEffect(() => {
    setLoading(true);
    Promise.all([getWorkerById(id), getWorkerReviews(id)])
      .then(([w, r]) => {
        setWorker(w.data.worker);
        setReviews(r.data.reviews);
      })
      .catch(() => toast.error("Worker not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: worker.fullName, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Profile link copied!");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (userType !== "customer") {
      toast.error("Please log in as a customer to leave a review");
      return;
    }
    if (!newRating) {
      toast.error("Please select a star rating");
      return;
    }
    setSubmitting(true);
    try {
      await createReview({ workerId: id, rating: newRating, comment });
      toast.success("Review submitted!");
      setNewRating(0);
      setComment("");
      loadReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (reviewId) => {
    if (!user) return toast.error("Log in to like a review");
    await likeReview(reviewId);
    loadReviews();
  };

  const handleReport = async (reviewId) => {
    if (!user) return toast.error("Log in to report a review");
    await reportReview(reviewId, "Reported by user");
    toast.success("Reported. Our team will review it.");
  };

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-16 text-center">Loading profile...</div>;
  if (!worker) return <div className="max-w-5xl mx-auto px-4 py-16 text-center">Worker not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="glass-card p-6 flex flex-col sm:flex-row gap-6">
        <img
          src={worker.profilePhoto || "https://api.dicebear.com/7.x/initials/svg?seed=" + encodeURIComponent(worker.fullName)}
          alt={worker.fullName}
          className="w-32 h-32 rounded-2xl object-cover mx-auto sm:mx-0"
        />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold">{worker.fullName}</h1>
            {worker.isVerified && <FaCheckCircle className="text-primary" title="Verified" />}
            <span className={`badge ${AVAILABILITY_COLORS[worker.availability]}`}>{worker.availability}</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400">{worker.occupation} · {worker.experience} years experience</p>
          <p className="flex items-center gap-1 text-sm text-slate-500 mt-1"><FaMapMarkerAlt /> {worker.address}, {worker.district}, {worker.state} - {worker.pincode}</p>
          <p className="flex items-center gap-1 text-sm text-slate-500 mt-1"><FaClock /> {worker.workingHours}</p>
          {worker.languagesSpoken?.length > 0 && (
            <p className="flex items-center gap-1 text-sm text-slate-500 mt-1"><FaLanguage /> {worker.languagesSpoken.join(", ")}</p>
          )}

          <div className="flex items-center gap-1 mt-2 text-amber-500 font-semibold">
            <FaStar /> {worker.rating || "New"} <span className="text-slate-400 font-normal">({worker.reviewCount} reviews)</span>
          </div>

          <div className="flex flex-wrap gap-3 mt-4 text-lg font-bold">
            <span>{formatCurrency(worker.dailyWage)}/day</span>
            {worker.hourlyWage ? <span className="text-slate-400 font-normal text-base">{formatCurrency(worker.hourlyWage)}/hr</span> : null}
          </div>

          <div className="flex flex-wrap gap-3 mt-5">
            <a href={buildCallLink(worker.mobile)} onClick={() => logContact(id, "call")} className="btn-primary text-sm"><FaPhoneAlt /> Call Now</a>
            <a href={buildWhatsAppLink(worker.mobile, worker.fullName)} target="_blank" rel="noopener noreferrer" onClick={() => logContact(id, "whatsapp")} className="btn-accent text-sm"><FaWhatsapp /> WhatsApp</a>
            <button onClick={handleShare} className="btn-outline text-sm"><FaShareAlt /> Share Profile</button>
          </div>
        </div>
      </div>

      {worker.skills?.length > 0 && (
        <div className="glass-card p-6 mt-6">
          <h2 className="font-bold mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {worker.skills.map((s) => (
              <span key={s} className="badge bg-primary/10 text-primary">{s}</span>
            ))}
          </div>
        </div>
      )}

      {worker.description && (
        <div className="glass-card p-6 mt-6">
          <h2 className="font-bold mb-3">About</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">{worker.description}</p>
        </div>
      )}

      <div className="glass-card p-6 mt-6">
        <h2 className="font-bold mb-3">Location</h2>
        <MapView coordinates={worker.location?.coordinates} label={worker.fullName} />
      </div>

      <div className="glass-card p-6 mt-6">
        <h2 className="font-bold mb-4">Customer Reviews ({reviews.length})</h2>

        {userType === "customer" && (
          <form onSubmit={handleSubmitReview} className="mb-6 border-b border-slate-200 dark:border-slate-700 pb-6">
            <p className="text-sm font-semibold mb-2">Leave a review</p>
            <StarRating value={newRating} onChange={setNewRating} />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="input-field text-sm mt-3"
              rows={3}
            />
            <button type="submit" disabled={submitting} className="btn-primary text-sm mt-3">
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}

        <div className="space-y-4">
          {reviews.length === 0 && <p className="text-sm text-slate-500">No reviews yet. Be the first to review!</p>}
          {reviews.map((r) => (
            <div key={r._id} className="border-b border-slate-100 dark:border-slate-700 pb-4 last:border-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">{r.customer?.fullName || "Anonymous"}</p>
                <StarRating value={r.rating} readOnly size="text-sm" />
              </div>
              {r.comment && <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{r.comment}</p>}
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                <button onClick={() => handleLike(r._id)} className="flex items-center gap-1 hover:text-primary"><FaThumbsUp /> {r.likes?.length || 0}</button>
                <button onClick={() => handleReport(r._id)} className="flex items-center gap-1 hover:text-red-500"><FaFlag /> Report</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
