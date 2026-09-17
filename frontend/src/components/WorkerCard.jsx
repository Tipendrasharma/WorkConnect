import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaWhatsapp, FaPhoneAlt, FaStar, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import { formatCurrency, formatDistance, buildWhatsAppLink, buildCallLink } from "../utils/format";
import { AVAILABILITY_COLORS } from "../utils/constants";
import { logContact } from "../services/workerService";

const WorkerCard = ({ worker }) => {
  const {
    _id, profilePhoto, fullName, occupation, experience, distanceKm,
    availability, dailyWage, hourlyWage, mobile, rating, reviewCount, isVerified,
  } = worker;

  const handleContact = (type) => logContact(_id, type).catch(() => {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card p-4 flex flex-col gap-3 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center gap-3">
        <img
          src={profilePhoto || "https://api.dicebear.com/7.x/initials/svg?seed=" + encodeURIComponent(fullName)}
          alt={fullName}
          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <h3 className="font-bold truncate">{fullName}</h3>
            {isVerified && <FaCheckCircle className="text-primary text-sm flex-shrink-0" title="Verified" />}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{occupation} · {experience} yrs exp</p>
          {distanceKm != null && (
            <p className="text-xs text-slate-400 flex items-center gap-1"><FaMapMarkerAlt /> {formatDistance(distanceKm)}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className={`badge ${AVAILABILITY_COLORS[availability]}`}>{availability}</span>
        <span className="flex items-center gap-1 text-amber-500 font-semibold">
          <FaStar /> {rating || "New"} {reviewCount > 0 && <span className="text-slate-400 font-normal">({reviewCount})</span>}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm font-semibold">
        <span>{formatCurrency(dailyWage)}/day</span>
        {hourlyWage ? <span className="text-slate-400 font-normal">{formatCurrency(hourlyWage)}/hr</span> : null}
      </div>

      <div className="flex gap-2 mt-1">
        <a
          href={buildCallLink(mobile)}
          onClick={() => handleContact("call")}
          className="flex-1 btn-primary py-2 text-sm"
        >
          <FaPhoneAlt /> Call
        </a>
        <a
          href={buildWhatsAppLink(mobile, fullName)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleContact("whatsapp")}
          className="flex-1 btn-accent py-2 text-sm"
        >
          <FaWhatsapp /> WhatsApp
        </a>
      </div>

      <Link to={`/worker/${_id}`} className="btn-outline w-full py-2 text-sm">View Profile</Link>
    </motion.div>
  );
};

export default WorkerCard;
