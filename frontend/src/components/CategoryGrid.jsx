import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { OCCUPATIONS, OCCUPATION_ICONS } from "../utils/constants";

const CategoryGrid = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
      {OCCUPATIONS.map((occ, i) => {
        const Icon = OCCUPATION_ICONS[occ];
        return (
          <motion.button
            key={occ}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: i * 0.03 }}
            onClick={() => navigate(`/search?category=${encodeURIComponent(occ)}`)}
            className="glass-card flex flex-col items-center justify-center gap-2 p-4 hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl">
              <Icon />
            </div>
            <span className="text-xs font-semibold text-center">{occ}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default CategoryGrid;
