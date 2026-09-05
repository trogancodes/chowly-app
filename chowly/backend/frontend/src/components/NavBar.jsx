import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext.jsx";

function ForkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M6 2v8M9 2v8M6 10c0 2-1.5 3-1.5 5v7M9 10c0 2 1.5 3 1.5 5v7M6 2c0 2-1 2-1 4M9 2c0 2 1 2 1 4M17 2v9a3 3 0 003 3v8M17 2c-2 0-3 2-3 5s1 5 3 5" />
    </svg>
  );
}

export default function NavBar({ cartCount = 0, variant = "customer" }) {
  const navigate = useNavigate();
  const { restaurant, changeRestaurant } = useSession();

  return (
    <header className="sticky top-0 z-10 border-b border-clay bg-cream/95 px-6 py-4 backdrop-blur md:px-12">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 font-display italic text-xl text-terracotta">
            <ForkIcon /> chowly
          </Link>
          {restaurant && (
            <button
              onClick={() => {
                changeRestaurant();
                navigate("/");
              }}
              className="hidden text-xs text-ink/40 hover:text-terracotta sm:inline"
              title="Switch restaurant"
            >
              · {restaurant.name}
            </button>
          )}
        </div>

        <nav className="flex items-center gap-5 text-sm font-medium text-ink/70">
          {variant === "customer" && (
            <>
              <Link to="/customer/menu" className="hover:text-terracotta">Menu</Link>
              <Link to="/customer/cart" className="relative hover:text-terracotta">
                Cart
                {cartCount > 0 && (
                  <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-terracotta text-[10px] text-cream">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          )}
          <Link
            to="/waiter"
            className={variant === "waiter" ? "text-terracotta" : "hover:text-terracotta"}
          >
            Staff
          </Link>
        </nav>
      </div>
    </header>
  );
}
