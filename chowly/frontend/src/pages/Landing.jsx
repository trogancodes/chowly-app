import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header.jsx";
import Button from "../components/Button.jsx";
import { DinerIllustration } from "../illustrations/index.jsx";
import { api } from "../api.js";

export default function Landing() {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    api.getRestaurant().then(setRestaurant).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="mx-auto flex max-w-4xl flex-col items-center px-6 pb-24 pt-8 text-center md:pt-16">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm text-ink/60"
        >
          {restaurant ? `${restaurant.name} · ${restaurant.address}` : "Loading your restaurant..."}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 text-4xl leading-tight text-ink md:text-6xl"
        >
          Order, track, and pay —<br className="hidden md:block" /> all from the table.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6"
        >
          <DinerIllustration className="mx-auto h-40 w-40" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-2 max-w-md text-ink/70"
        >
          No app to download, no account to create. Tell us who you are for tonight, and we'll take it from there.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row"
        >
          <Button onClick={() => navigate("/customer/start")} className="w-full sm:w-auto">
            I'm dining tonight
          </Button>
          <Button variant="outline" onClick={() => navigate("/waiter")} className="w-full sm:w-auto">
            I'm working the floor
          </Button>
        </motion.div>

        <p className="mt-6 text-xs text-ink/40">
          Switch between these two views any time from the top of the screen.
        </p>
      </main>
    </div>
  );
}
