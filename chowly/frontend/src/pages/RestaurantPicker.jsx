import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { StorefrontIllustration } from "../illustrations/index.jsx";
import { Loader, ErrorNote } from "../components/Misc.jsx";
import { useSession } from "../context/SessionContext.jsx";
import { api } from "../api.js";

function ForkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M6 2v8M9 2v8M6 10c0 2-1.5 3-1.5 5v7M9 10c0 2 1.5 3 1.5 5v7M6 2c0 2-1 2-1 4M9 2c0 2 1 2 1 4M17 2v9a3 3 0 003 3v8M17 2c-2 0-3 2-3 5s1 5 3 5" />
    </svg>
  );
}

export default function RestaurantPicker() {
  const navigate = useNavigate();
  const { setRestaurant } = useSession();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getRestaurants()
      .then(setRestaurants)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function choose(restaurant) {
    setRestaurant({ id: restaurant.id, name: restaurant.name, address: restaurant.address });
    navigate("/customer/start");
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="flex items-center justify-center gap-2 px-6 py-8 font-display italic text-2xl text-terracotta">
        <ForkIcon /> chowly
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-24 text-center">
        <h1 className="text-3xl text-ink md:text-4xl">Where are you dining tonight?</h1>
        <p className="mt-3 text-ink/70">Pick your restaurant to see its menu and place your order.</p>

        {loading && <Loader label="Finding restaurants..." />}
        <ErrorNote message={error} />

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {restaurants.map((r) => (
            <motion.button
              key={r.id}
              whileHover={{ y: -3 }}
              onClick={() => choose(r)}
              className="flex flex-col items-center rounded-chowly border border-clay bg-white/50 p-6 text-center"
            >
              <StorefrontIllustration className="h-16 w-16" />
              <h2 className="mt-3 font-display text-xl text-ink">{r.name}</h2>
              <p className="mt-1 text-sm text-ink/60">{r.address}</p>
              <p className="mt-1 text-xs text-ink/40">{r.openingHours}</p>
            </motion.button>
          ))}
        </div>

        {!loading && restaurants.length === 0 && !error && (
          <p className="mt-10 text-ink/60">No restaurants are set up yet.</p>
        )}
      </main>
    </div>
  );
}
