import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Button from "../components/Button.jsx";
import { ErrorNote } from "../components/Misc.jsx";
import { useSession } from "../context/SessionContext.jsx";
import { api } from "../api.js";

export default function CustomerStart() {
  const navigate = useNavigate();
  const { startSession } = useSession();
  const [fullName, setFullName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!fullName.trim() || !tableNumber) {
      setError("Please tell us your name and table number.");
      return;
    }
    setLoading(true);
    try {
      const { visit, customer } = await api.startVisit(fullName.trim(), tableNumber);
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

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="mx-auto flex max-w-md flex-col items-center px-6 pt-8 text-center md:pt-16">
        <h1 className="text-3xl text-ink md:text-4xl">Welcome. Who's joining us?</h1>
        <p className="mt-3 text-ink/70">
          Just your name and table number — no account needed. This lets us bring your order
          straight to you.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex w-full flex-col gap-4 text-left">
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
            <span className="text-sm font-medium text-ink/80">Table number</span>
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
            {loading ? "Setting your table..." : "View the menu"}
          </Button>
        </form>
      </main>
    </div>
  );
}
