import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUserPlus, FaSearchLocation, FaHandshake } from "react-icons/fa";
import SearchBar from "../components/SearchBar";
import CategoryGrid from "../components/CategoryGrid";
import WorkerCard from "../components/WorkerCard";
import WorkerCardSkeleton from "../components/WorkerCardSkeleton";
import { getFeaturedWorkers } from "../services/workerService";

const HOW_IT_WORKS = [
  { icon: FaSearchLocation, title: "Search Nearby", desc: "Tell us what you need and your location. We find the closest skilled workers instantly." },
  { icon: FaHandshake, title: "Compare & Connect", desc: "Compare ratings, wages, and availability, then call or WhatsApp the worker directly." },
  { icon: FaUserPlus, title: "Get the Job Done", desc: "Hire with confidence and leave a review to help the next customer." },
];

const FAQS = [
  { q: "Is it free to search for workers?", a: "Yes, searching and contacting workers is completely free for customers." },
  { q: "How are workers verified?", a: "Workers can submit an ID for review, and our admin team manually approves verified badges." },
  { q: "How is distance calculated?", a: "We use your device's GPS location and the Haversine formula to find workers within your chosen radius." },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedWorkers()
      .then(({ data }) => setFeatured(data.workers))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 dark:from-primary/5 dark:via-slate-900 dark:to-accent/5 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl font-extrabold text-secondary dark:text-white mb-4"
          >
            Find Trusted Skilled Workers <span className="text-primary">Near You</span>
          </motion.h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Painters, electricians, plumbers, mechanics, and more — verified local professionals, ready to help today.
          </p>
        </div>
        <SearchBar />
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
        <CategoryGrid />
      </section>

      {/* Featured workers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="text-2xl font-bold mb-6">Top Rated Workers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <WorkerCardSkeleton key={i} />)
            : featured.length
            ? featured.map((w) => <WorkerCard key={w._id} worker={w} />)
            : <p className="text-slate-500 col-span-full">No featured workers yet — be the first to register!</p>}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white/60 dark:bg-slate-800/40 py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold mb-10 text-center">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl mb-4">
                  <Icon />
                </div>
                <h3 className="font-bold mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="text-2xl font-bold mb-8 text-center">What Customers Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { name: "Anjali S.", text: "Found a great electrician within 10 minutes, showed up same day." },
            { name: "Ramesh K.", text: "Booking a plumber has never been this easy. Loved the WhatsApp option." },
            { name: "Priya M.", text: "The distance-based search saved me so much time searching locally." },
          ].map((t) => (
            <div key={t.name} className="glass-card p-5">
              <p className="text-sm italic text-slate-600 dark:text-slate-300 mb-3">"{t.text}"</p>
              <p className="font-semibold text-sm">— {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((f) => (
            <details key={f.q} className="glass-card p-4 group">
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                {f.q}
                <span className="text-primary group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
