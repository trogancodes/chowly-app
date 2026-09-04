# Chowly

A digital dining platform: a customer opens the app at their table, browses the
menu, places an order, tracks the wait, can flag a delay and rate the order, and
pays — all without creating an account. A waiter opens the same app in "waiter view"
to see incoming orders, record who prepared them, and mark them served.

Built on the entity model in `CHOWLY ENTITY RELATIONSHIP MODEL.pdf`, with three
documented adaptations — see **Changes from the original model** below.

## Stack

- **Frontend:** React (Vite) + Tailwind CSS + Framer Motion — deployed to Render as a Static Site
- **Backend:** Node.js + Express + Prisma ORM — deployed to Render as a Web Service
- **Database:** PostgreSQL — a free Render PostgreSQL instance

## Project structure

```
chowly/
  backend/           Express API + Prisma schema + seed data
    prisma/
      schema.prisma  The data model (Restaurant, Customer, Visit, MenuItem, ...)
      seed.js        Loads the restaurant, menu and staff so the app has real data
    src/
      routes/        One file per resource (menu, orders, payments, feedback...)
      index.js       Server entry point
  frontend/          React app
    src/
      pages/         One file per screen (Landing, Menu, Cart, OrderStatus, Waiter...)
      illustrations/ Custom line-art SVGs in the app's visual style
      context/       Session state (table/visit), persisted to localStorage
      api.js         All calls to the backend live here
```

## Changes from the original model

The original ER model assumed a full customer/restaurant relationship. Three
changes were needed to satisfy "logins are not required, a simple switch is
enough" and to make a walk-in flow actually work:

1. **No login table.** A `Customer` row is still created (so Payment/Feedback can
   reference it, as in the original model) — but it's created just by typing a
   name, with no password or account.
2. **`Visit.tableNumber` was added.** The original model didn't need to know
   *where* in the restaurant a visit happened. A no-login, walk-in flow does —
   it's how the waiter knows which table an order belongs to.
3. **`Order.status` became a fixed enum** (`PENDING`, `PREPARING`, `SERVED`,
   `DELAYED`) instead of free text, so the API and UI can rely on one set of
   states.

Everything else — Restaurant, MenuCategory, MenuItem, Waiter, Chef, Bartender,
Order, OrderItem, Payment, Feedback, and all the foreign keys between them —
matches the original model exactly.

## How the AI was used

This build was done with Claude (Anthropic). Specifically:

- **Asked Claude to:** design the full-stack architecture from the approved ER
  model, generate the Prisma schema and Express API, build the React UI, and
  translate the "Monte" reference design into a reusable design system (colors,
  type, custom line-art illustrations, motion).
- **Accepted:** the schema and API as generated; the page-by-page UI structure;
  the illustration style.
- **Corrected/adjusted:** the three model changes above were called out
  explicitly rather than applied silently; the payment button was gated to
  appear only once an order is marked "Served," matching the brief's "just
  before the customer exits" behaviour, rather than being available immediately.
- You should describe here, in your own words, anything you changed by hand
  after generation, or any follow-up prompts you gave — this section is meant
  to be filled in honestly as part of your submission.

---

# Deploying Chowly (step by step)

You don't need to know how to code to do this — you're mostly clicking buttons
in GitHub Desktop and Render's dashboard. Follow these in order.

## Part 1 — Put the code on GitHub

1. **Create a GitHub account** at github.com if you don't have one.
2. **Download GitHub Desktop** from desktop.github.com and sign in with your
   GitHub account.
3. In GitHub Desktop: **File → New Repository**. Name it `chowly`, and set the
   "Local Path" to the folder *containing* the `chowly` folder you downloaded
   from this chat (so the repository root is the `chowly` folder itself —
   copy the contents of the folder I gave you into the new repository folder
   GitHub Desktop creates).
4. Click **Publish repository**. Untick "Keep this code private" only if you
   want your facilitators to access it without being added as a collaborator —
   otherwise keep it private and add your tutor as a collaborator under
   **GitHub → Settings → Collaborators**.
5. You'll see all the project files listed as changes. Write a commit summary
   like "Initial Chowly build: backend, frontend, and data model" and click
   **Commit to main**, then **Push origin**.

   📸 **Screenshot point 1:** GitHub Desktop showing your first commit pushed,
   or the GitHub website showing your repository with all the folders.

   *Tip:* since your facilitators want to see "the work as it was done," it's
   worth making 2-3 more small commits as you go through the steps below
   (e.g., after you set environment variables, after your first successful
   deploy) rather than one giant commit — each one just needs a short message.

## Part 2 — Create the database

1. Go to render.com and sign up / log in.
2. Click **New → PostgreSQL**.
3. Name it `chowly-db`, choose the **Free** plan, and click **Create Database**.
4. Once it's ready, scroll to **Connections** and copy the **Internal Database
   URL** (you'll paste this into the backend's environment variables next).

   📸 **Screenshot point 2:** the Render PostgreSQL dashboard page showing the
   database is "Available."

## Part 3 — Deploy the backend (API)

1. In Render: **New → Web Service**, and connect your `chowly` GitHub repo.
2. Set:
   - **Name:** `chowly-api`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
3. Under **Environment**, add a variable:
   - `DATABASE_URL` → paste the Internal Database URL from Part 2.
4. Click **Create Web Service**. Render will build and deploy — this takes a
   few minutes the first time.
5. Once live, open a terminal-free way to seed data: in Render, go to your
   `chowly-api` service → **Shell** tab (top right) and run:
   ```
   npx prisma migrate deploy
   node prisma/seed.js
   ```
   This loads the restaurant, menu and staff you saw in the original data
   model document.
6. Copy your backend's URL from the top of the Render page — it looks like
   `https://chowly-api.onrender.com`.

   📸 **Screenshot point 3:** the Render dashboard showing `chowly-api` with a
   green "Live" status.
   📸 **Screenshot point 4:** the Render Shell output after running the seed
   script.

## Part 4 — Deploy the frontend

1. In Render: **New → Static Site**, connect the same `chowly` repo.
2. Set:
   - **Name:** `chowly-app`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
3. Under **Environment**, add:
   - `VITE_API_URL` → `https://chowly-api.onrender.com/api` (use **your**
     backend URL from Part 3, and keep the `/api` at the end).
4. Click **Create Static Site**.
5. Once live, open the URL Render gives you (something like
   `https://chowly-app.onrender.com`) — this is your live link for
   deliverable #2.

   📸 **Screenshot point 5:** the Render dashboard showing `chowly-app` as
   "Live," with the URL visible.

## Part 5 — Try it end to end and take your walkthrough screenshots

Open your live link and go through the whole story, capturing a screenshot at
each of these moments for your document:

1. 📸 **Landing page** — the role switch between "I'm dining tonight" and
   "I'm working the floor."
2. 📸 **Name + table entry** screen (before menu browsing).
3. 📸 **Menu page** with a couple of items added (showing quantity steppers
   and the floating cart bar).
4. 📸 **Cart review** screen before placing the order.
5. 📸 **Order tracking page** right after placing an order — showing the
   status badge and estimated wait time.
6. Open the same link in a **second browser tab/window** (or your phone),
   switch to waiter view, and:
   📸 **Waiter dashboard** showing the order you just placed.
   📸 **Waiter order detail** with the chef/bartender dropdowns filled in and
   saved.
7. Back in the customer tab, refresh — 📸 the order now shows the assigned
   staff, and once you mark it served from the waiter tab, 📸 the **payment
   screen** appears.
8. 📸 Click **"This is taking longer than expected"** on a fresh order (before
   marking it served) to show the **complaint + rating form**, and submit one.
9. 📸 The final **"Payment recorded"** confirmation screen.
10. 📸 **Refresh the page** entirely (or close and reopen the browser) to prove
    data survives a refresh — show the order still there, or a fresh visit
    starting cleanly.

These ten screenshots map directly onto the "specific behaviour of the
application" and "how to use it" sections your document needs to cover.

## Local development (optional)

If at any point you want to preview changes on your own computer before
pushing them:

```
# Backend
cd backend
npm install
cp .env.example .env   # then paste a local or Render DATABASE_URL into it
npx prisma migrate dev --name init
node prisma/seed.js
npm run dev             # runs on http://localhost:4000

# Frontend (in a second terminal)
cd frontend
npm install
cp .env.example .env
npm run dev              # runs on http://localhost:5173
```
