// Central place for all calls to the Chowly API.
// Set VITE_API_URL in a .env file (locally) or in Render's environment settings
// (in production) to point at your deployed backend, e.g.
// VITE_API_URL=https://chowly-api.onrender.com/api
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }
  return data;
}

export const api = {
  getRestaurant: () => request("/restaurant"),
  getMenu: () => request("/menu"),
  getStaff: () => request("/staff"),
  startVisit: (fullName, tableNumber) =>
    request("/visits", { method: "POST", body: JSON.stringify({ fullName, tableNumber }) }),
  placeOrder: (visitId, items) =>
    request("/orders", { method: "POST", body: JSON.stringify({ visitId, items }) }),
  getOrdersForVisit: (visitId) => request(`/orders/visit/${visitId}`),
  getOrder: (orderId) => request(`/orders/${orderId}`),
  getWaiterOrders: (statuses) => request(`/orders?status=${statuses.join(",")}`),
  assignOrder: (orderId, payload) =>
    request(`/orders/${orderId}/assign`, { method: "PATCH", body: JSON.stringify(payload) }),
  serveOrder: (orderId) => request(`/orders/${orderId}/serve`, { method: "PATCH" }),
  delayOrder: (orderId) => request(`/orders/${orderId}/delay`, { method: "PATCH" }),
  submitFeedback: (payload) => request("/feedback", { method: "POST", body: JSON.stringify(payload) }),
  submitPayment: (payload) => request("/payments", { method: "POST", body: JSON.stringify(payload) }),
};
