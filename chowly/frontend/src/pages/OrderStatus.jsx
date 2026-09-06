import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "../components/NavBar.jsx";
import Button from "../components/Button.jsx";
import { Loader, ErrorNote, StatusBadge } from "../components/Misc.jsx";
import { ReceiptIllustration, StarRating } from "../illustrations/index.jsx";
import { useSession } from "../context/SessionContext.jsx";
import { api } from "../api.js";

function formatNaira(amount) {
  return `₦${amount.toLocaleString()}`;
}

// A small filled/outline circle used in the tracker timeline.
function StepDot({ done, current }) {
  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
        done
          ? "border-terracotta bg-terracotta text-cream"
          : current
          ? "border-terracotta text-terracotta"
          : "border-clay text-ink/30"
      }`}
    >
      {done ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : (
        <span className="h-2 w-2 rounded-full bg-current" />
      )}
    </div>
  );
}

function OrderTracker({ order }) {
  const hasFood = order.orderItems.some((i) => i.menuItem.category?.categoryName === "Food");
  const hasDrinks = order.orderItems.some((i) => i.menuItem.category?.categoryName === "Drinks");
  const notDelayed = order.status !== "DELAYED";

  const steps = [
    { key: "placed", label: "Order placed", detail: null, done: true },
    {
      key: "accepted",
      label: "Accepted by your waiter",
      detail: order.waiter ? order.waiter.fullName : null,
      done: notDelayed && !["PENDING"].includes(order.status),
    },
  ];
  if (hasFood) {
    steps.push({
      key: "chef",
      label: "Chef preparing your food",
      detail: order.chef ? `${order.chef.fullName} · ~${order.estimatedWaitTimeMins} min` : null,
      done: !!order.chefId,
    });
  }
  if (hasDrinks) {
    steps.push({
      key: "bartender",
      label: "Bartender preparing your drinks",
      detail: order.bartender ? order.bartender.fullName : null,
      done: !!order.bartenderId,
    });
  }
  steps.push({
    key: "served",
    label: "Served to your table",
    detail: null,
    done: notDelayed && ["SERVED", "COMPLETED"].includes(order.status),
  });
  steps.push({
    key: "paid",
    label: "Payment received",
    detail: order.payment ? `${formatNaira(order.payment.amount)} via ${order.payment.paymentMethod}` : null,
    done: !!order.payment,
  });

  const currentIndex = steps.findIndex((s) => !s.done);

  return (
    <div className="mt-6 rounded-chowly border border-clay bg-white/50 p-6">
      {steps.map((step, i) => (
        <div key={step.key} className="flex gap-4">
          <div className="flex flex-col items-center">
            <StepDot done={step.done} current={i === currentIndex} />
            {i < steps.length - 1 && (
              <div className={`w-0.5 flex-1 ${step.done ? "bg-terracotta" : "bg-clay"}`} style={{ minHeight: 28 }} />
            )}
          </div>
          <div className={`pb-6 ${step.done ? "text-ink" : "text-ink/40"}`}>
            <p className="font-medium">{step.label}</p>
            {step.detail && <p className="text-sm text-ink/60">{step.detail}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OrderStatus() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { session, endSession } = useSession();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [complaintText, setComplaintText] = useState("");
  const [rating, setRating] = useState(0);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [paid, setPaid] = useState(null);

  const fetchOrder = useCallback(async () => {
    try {
      const data = await api.getOrder(orderId);
      setOrder(data);
      if (data.payment) setPaid(data.payment);
      if (data.feedbacks?.length) setFeedbackSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [fetchOrder]);

  async function handleFlagDelay() {
    try {
      const updated = await api.delayOrder(orderId);
      setOrder(updated);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSubmitFeedback(e) {
    e.preventDefault();
    if (!complaintText.trim() || rating === 0) {
      setError("Please add a note and a rating.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await api.submitFeedback({
        orderId: order.id,
        customerId: session.customerId,
        complaintText: complaintText.trim(),
        rating,
      });
      setFeedbackSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePay() {
    setSubmitting(true);
    setError("");
    try {
      const payment = await api.submitPayment({
        orderId: order.id,
        customerId: session.customerId,
        paymentMethod,
      });
      setPaid(payment);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!session) {
    navigate("/customer/start");
    return null;
  }

  const total = order?.orderItems?.reduce((sum, i) => sum + i.subTotal, 0) || 0;
  const canFlagDelay = order && !["SERVED", "COMPLETED", "DELAYED"].includes(order.status);

  return (
    <div className="min-h-screen bg-cream">
      <NavBar variant="customer" />
      <main className="mx-auto max-w-2xl px-6 pb-24">
        {loading && <Loader label="Fetching your order..." />}
        <ErrorNote message={error} />

        {order && !paid && (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl text-ink md:text-4xl">Order #{order.id}</h1>
              <StatusBadge status={order.status} />
            </div>

            <OrderTracker order={order} />

            <div className="mt-6 divide-y divide-clay rounded-chowly border border-clay bg-white/50">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-4">
                  <span className="text-ink">
                    {item.quantity} × {item.menuItem.itemName}
                  </span>
                  <span className="font-semibold text-ink">{formatNaira(item.subTotal)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-5 py-4">
                <span className="font-semibold text-ink">Total</span>
                <span className="font-display text-xl text-terracotta">{formatNaira(total)}</span>
              </div>
            </div>

            {/* Delay + feedback */}
            {canFlagDelay && !feedbackSent && (
              <button
                onClick={handleFlagDelay}
                className="mt-6 text-sm text-terracotta underline decoration-terracotta/40 underline-offset-4"
              >
                This is taking longer than expected
              </button>
            )}

            <AnimatePresence>
              {order.status === "DELAYED" && !feedbackSent && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  onSubmit={handleSubmitFeedback}
                  className="mt-6 rounded-chowly border border-terracotta/30 bg-terracotta/5 p-5"
                >
                  <p className="font-display text-lg text-terracotta-dark">
                    Sorry about the wait. Tell us what happened.
                  </p>
                  <textarea
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                    placeholder="What went wrong?"
                    className="mt-3 w-full rounded-2xl border border-clay bg-white/70 px-4 py-3 outline-none focus:border-terracotta"
                    rows={3}
                  />
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-sm text-ink/70">Rate this order</span>
                    <StarRating value={rating} onChange={setRating} className="w-6 h-6" />
                  </div>
                  <Button type="submit" disabled={submitting} className="mt-4">
                    {submitting ? "Sending..." : "Submit feedback"}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>

            {feedbackSent && (
              <p className="mt-6 text-sm text-sage">Thanks — your feedback has been recorded.</p>
            )}

            {/* Payment */}
            {(order.status === "SERVED" || order.status === "COMPLETED") && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 rounded-chowly border border-clay bg-white/50 p-6"
              >
                <div className="flex items-center gap-4">
                  <ReceiptIllustration className="h-16 w-16 shrink-0" />
                  <div>
                    <h2 className="font-display text-xl text-ink">Ready to settle up?</h2>
                    <p className="text-sm text-ink/60">This is a pretend payment for the assignment demo.</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  {["Card", "Cash", "Transfer"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setPaymentMethod(m)}
                      className={`rounded-full border px-4 py-2 text-sm ${
                        paymentMethod === m
                          ? "border-terracotta bg-terracotta text-cream"
                          : "border-clay text-ink/70"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <Button onClick={handlePay} disabled={submitting} className="mt-5 w-full">
                  {submitting ? "Processing (pretend)..." : `Pay ${formatNaira(total)} (pretend)`}
                </Button>
              </motion.div>
            )}
          </>
        )}

        {paid && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 flex flex-col items-center text-center"
          >
            <ReceiptIllustration className="h-24 w-24" />
            <h1 className="mt-2 text-3xl text-ink">Payment recorded — pretend, of course</h1>
            <p className="mt-2 text-ink/70">
              {formatNaira(paid.amount)} via {paid.paymentMethod}. Your waiter has been notified and will
              wrap up your table shortly. Thanks for dining with us tonight.
            </p>
            <Button
              className="mt-8"
              onClick={() => {
                endSession();
                navigate("/");
              }}
            >
              Start a new visit
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
