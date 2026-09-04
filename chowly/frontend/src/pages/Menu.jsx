import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header.jsx";
import Button from "../components/Button.jsx";
import { Loader, ErrorNote } from "../components/Misc.jsx";
import { useSession } from "../context/SessionContext.jsx";
import { api } from "../api.js";

function formatNaira(amount) {
  return `₦${amount.toLocaleString()}`;
}

export default function Menu() {
  const navigate = useNavigate();
  const { session, cart, addToCart, updateQuantity } = useSession();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session) {
      navigate("/customer/start");
      return;
    }
    api
      .getMenu()
      .then(setCategories)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [session, navigate]);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.quantity * i.price, 0);

  function quantityFor(menuItemId) {
    return cart.find((i) => i.menuItemId === menuItemId)?.quantity || 0;
  }

  return (
    <div className="min-h-screen bg-cream pb-32">
      <Header roleLabel={`Table ${session?.tableNumber}`} onSwitchRole={() => navigate("/")} />
      <main className="mx-auto max-w-3xl px-6">
        <h1 className="text-3xl text-ink md:text-4xl">
          Hi {session?.fullName?.split(" ")[0]}, what looks good tonight?
        </h1>
        <p className="mt-2 text-ink/70">Tap an item to add it. You can change quantities any time before you order.</p>

        {loading && <Loader label="Bringing up the menu..." />}
        <ErrorNote message={error} />

        {categories.map((category) => (
          <section key={category.id} className="mt-10">
            <h2 className="text-2xl text-terracotta">{category.categoryName}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {category.menuItems.map((item) => {
                const qty = quantityFor(item.id);
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -2 }}
                    className="flex flex-col justify-between rounded-chowly border border-clay bg-white/50 p-5"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-lg text-ink">{item.itemName}</h3>
                        <span className="whitespace-nowrap font-semibold text-terracotta">
                          {formatNaira(item.price)}
                        </span>
                      </div>
                      {item.description && (
                        <p className="mt-1 text-sm text-ink/60">{item.description}</p>
                      )}
                      <p className="mt-1 text-xs text-ink/40">~{item.avgPreparationTimeMins} min to prepare</p>
                    </div>

                    <div className="mt-4">
                      {qty === 0 ? (
                        <Button variant="outline" onClick={() => addToCart(item)} className="w-full">
                          Add to order
                        </Button>
                      ) : (
                        <div className="flex items-center justify-between rounded-full border border-terracotta">
                          <button
                            onClick={() => updateQuantity(item.id, qty - 1)}
                            className="px-4 py-2 text-terracotta"
                            aria-label={`Remove one ${item.itemName}`}
                          >
                            –
                          </button>
                          <span className="font-semibold text-ink">{qty}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="px-4 py-2 text-terracotta"
                            aria-label={`Add one more ${item.itemName}`}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        ))}
      </main>

      {cartCount > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed inset-x-0 bottom-0 border-t border-clay bg-cream/95 backdrop-blur px-6 py-4"
        >
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <div>
              <p className="text-sm text-ink/60">{cartCount} item{cartCount > 1 ? "s" : ""}</p>
              <p className="font-display text-xl text-ink">{formatNaira(cartTotal)}</p>
            </div>
            <Button onClick={() => navigate("/customer/cart")}>Review order</Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
