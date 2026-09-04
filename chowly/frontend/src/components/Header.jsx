import React from "react";
import { Link } from "react-router-dom";

export default function Header({ roleLabel, onSwitchRole }) {
  return (
    <header className="flex items-center justify-between px-6 py-5 md:px-12">
      <Link to="/" className="font-display italic text-2xl text-terracotta tracking-tight">
        chowly
      </Link>
      {roleLabel && (
        <button
          onClick={onSwitchRole}
          className="text-xs uppercase tracking-widest text-ink/60 hover:text-terracotta transition-colors"
        >
          {roleLabel} · switch view
        </button>
      )}
    </header>
  );
}
