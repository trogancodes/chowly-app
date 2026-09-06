import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import Button from "../components/Button.jsx";
import { ErrorNote } from "../components/Misc.jsx";
import { useSession } from "../context/SessionContext.jsx";
import { api } from "../api.js";

function PlateIcon() {
  return (
    <svg viewBox="0 0 100 100" className="h-10 w-10" fill="none" stroke="#F7EFE1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="50" r="30" />
      <circle cx="50" cy="50" r="16" />
    </svg>
  );
}

export default function CustomerStart() {
  const navigate = useNavigate();
  const { restaurant, startSession } = useSession();
  const [fullName, setFullName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!restaurant) navigate("/");
  }, [restaurant, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!fullName.trim() || !tableNumber) {
      setError("Please tell us your name and seat number.");
      return;
    }
    setLoading(true);
    try {
      const { visit, customer } = await api.startVisit(fullName.trim(), tableNumber, restaurant.id);
      startSession({
        visitId: visit.id,
        customerId: customer.id,
        tableNumber: visit.tableNumber,
        fullName: customer.fullName,
      });
      navigate("/customer/menu");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!restaurant) return null;

  return (
    <div className="min-h-screen bg-cream">
      <NavBar variant="start" />
      <main className="mx-auto flex max-w-md flex-col items-center px-6 pt-12 text-center">
        <p className="text-sm text-ink/60">
          Browse the menu, place your order, track it live, and pay — no app download, no account required.
        </p>

        <div className="mt-8 w-full rounded-chowly border border-clay bg-white/60 p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-terracotta">
            <PlateIcon />
          </div>
          <h1 className="mt-4 text-2xl text-ink">Welcome to Chowly</h1>
          <p className="mt-2 text-sm text-ink/60">
            Enter your name and seat number to start ordering — no account needed.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 text-left">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-ink/80">Your name</span>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ada Obi"
                className="rounded-2xl border border-clay bg-white/60 px-4 py-3 outline-none focus:border-terracotta"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-ink/80">Seat number</span>
              <input
                type="number"
                min="1"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="e.g. 12"
                className="rounded-2xl border border-clay bg-white/60 px-4 py-3 outline-none focus:border-terracotta"
              />
            </label>

            <ErrorNote message={error} />

            <Button type="submit" disabled={loading} className="mt-2 w-full">
              {loading ? "Setting your table..." : "View Menu"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-xs text-ink/40">
          {restaurant.name} · {restaurant.address}
        </p>
      </main>
    </div>
  );
}
