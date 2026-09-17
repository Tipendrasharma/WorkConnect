import React from "react";
import { FaStar } from "react-icons/fa";

const StarRating = ({ value = 0, onChange, size = "text-lg", readOnly = false }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className={`flex gap-1 ${size}`}>
      {stars.map((star) => (
        <FaStar
          key={star}
          onClick={() => !readOnly && onChange?.(star)}
          className={`${star <= value ? "text-amber-400" : "text-slate-300 dark:text-slate-600"} ${
            !readOnly ? "cursor-pointer" : ""
          }`}
        />
      ))}
    </div>
  );
};

export default StarRating;
