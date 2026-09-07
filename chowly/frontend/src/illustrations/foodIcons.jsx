import React from "react";

// A small set of hand-drawn-style line icons, each on its own colored tile —
// a muted, warm take on "give every menu item a little picture" rather than
// stock photography (which we can't license) or a neon palette (which would
// clash with the rest of the app).

const TILE_COLORS = {
  riceBowl: "#FF9030",
  skewer: "#FB7185",
  soup: "#FBBF24",
  fish: "#38BDF8",
  pizza: "#FF9030",
  pasta: "#FACC15",
  salad: "#4ADE80",
  dessert: "#F472B6",
  cocktail: "#A78BFA",
  tea: "#F87171",
  juice: "#FDE047",
  espresso: "#D97706",
  spritz: "#FB923C",
  genericFood: "#FBBF24",
  genericDrink: "#38BDF8",
};

function IconShell({ color, children, size }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-2xl"
      style={{ backgroundColor: color, width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="h-2/3 w-2/3" style={{ stroke: "#111827", fill: "none", strokeWidth: 4, strokeLinecap: "round", strokeLinejoin: "round" }}>
        {children}
      </svg>
    </div>
  );
}

const ICONS = {
  riceBowl: (p) => <IconShell {...p}><path d="M20 50a30 15 0 0060 0" /><path d="M18 50h64" /><path d="M50 20c-8 0-14 8-14 18h28c0-10-6-18-14-18Z" /></IconShell>,
  skewer: (p) => <IconShell {...p}><path d="M20 80L80 20" /><circle cx="34" cy="66" r="7" /><circle cx="50" cy="50" r="7" /><circle cx="66" cy="34" r="7" /></IconShell>,
  soup: (p) => <IconShell {...p}><path d="M18 48a32 16 0 0064 0" /><path d="M16 48h68" /><path d="M30 48c0-4 4-6 4-12M50 48c0-4 4-6 4-12M70 48c0-4-4-6-4-12" /><path d="M34 64h32" /></IconShell>,
  fish: (p) => <IconShell {...p}><path d="M15 50c10-16 45-22 65-4-20 18-55 12-65-4Z" /><path d="M78 46l10-8-2 12 2 12-10-8" /><circle cx="30" cy="46" r="2.5" fill="#111827" /></IconShell>,
  pizza: (p) => <IconShell {...p}><path d="M50 18L85 78H15Z" /><circle cx="45" cy="55" r="3" fill="#111827" /><circle cx="58" cy="62" r="3" fill="#111827" /><circle cx="50" cy="42" r="3" fill="#111827" /></IconShell>,
  pasta: (p) => <IconShell {...p}><path d="M22 30c6 14-6 20 4 34M40 28c6 14-6 22 4 36M58 28c6 14-6 22 4 36M76 30c6 14-6 20 4 34" /></IconShell>,
  salad: (p) => <IconShell {...p}><path d="M16 55a34 20 0 0068 0Z" /><path d="M30 55c2-10 8-18 8-26M50 55c0-10 2-20-2-30M70 55c-2-10-8-18-8-26" /></IconShell>,
  dessert: (p) => <IconShell {...p}><rect x="26" y="34" width="48" height="40" rx="4" /><path d="M26 50h48M26 62h48" /><path d="M40 34v-8M60 34v-8" /></IconShell>,
  cocktail: (p) => <IconShell {...p}><path d="M22 24h56L50 56Z" /><path d="M50 56v22M36 78h28" /></IconShell>,
  tea: (p) => <IconShell {...p}><path d="M22 40h44v14a22 22 0 01-44 0Z" /><path d="M66 44h6a10 10 0 010 20h-6" /><path d="M34 26c2 4-2 6 0 10M46 26c2 4-2 6 0 10" /></IconShell>,
  juice: (p) => <IconShell {...p}><path d="M32 22h36l-4 56a4 4 0 01-4 4H40a4 4 0 01-4-4Z" /><path d="M30 38h40" /></IconShell>,
  espresso: (p) => <IconShell {...p}><path d="M26 44h38v14a19 19 0 01-38 0Z" /><path d="M64 48h8a9 9 0 010 18h-8" /><path d="M30 36c2-4-2-6 0-10M42 36c2-4-2-6 0-10" /></IconShell>,
  spritz: (p) => <IconShell {...p}><path d="M32 20h36l-6 30v24a4 4 0 01-4 4H42a4 4 0 01-4-4V50Z" /><path d="M50 50v-8" /></IconShell>,
  genericFood: (p) => <IconShell {...p}><circle cx="50" cy="50" r="28" /><circle cx="50" cy="50" r="14" /></IconShell>,
  genericDrink: (p) => <IconShell {...p}><path d="M34 22h32l-5 50a5 5 0 01-5 5H44a5 5 0 01-5-5Z" /></IconShell>,
};

// Order matters: first matching keyword wins.
const KEYWORD_MAP = [
  [/jollof|rice/i, "riceBowl"],
  [/suya|skewer|kebab/i, "skewer"],
  [/soup|egusi/i, "soup"],
  [/tilapia|fish/i, "fish"],
  [/pizza/i, "pizza"],
  [/spaghetti|pasta|carbonara/i, "pasta"],
  [/salad|caprese/i, "salad"],
  [/tiramisu|cake|dessert/i, "dessert"],
  [/chapman|cocktail/i, "cocktail"],
  [/zobo|tea|hibiscus/i, "tea"],
  [/juice/i, "juice"],
  [/espresso|coffee/i, "espresso"],
  [/spritz|aperol/i, "spritz"],
];

function resolveIconKey(itemName, categoryName) {
  const match = KEYWORD_MAP.find(([regex]) => regex.test(itemName));
  if (match) return match[1];
  return categoryName === "Drinks" ? "genericDrink" : "genericFood";
}

export function FoodIcon({ itemName, categoryName, size = 56 }) {
  const key = resolveIconKey(itemName || "", categoryName || "");
  const color = TILE_COLORS[key];
  const render = ICONS[key];
  return render({ color, size });
}

// Renders a specific icon by its key directly (bypassing the itemName keyword match) —
// used by the waiting-room game, which needs a fixed, known set of icons to pair up.
export function FoodIconByKey({ iconKey, size = 56 }) {
  const color = TILE_COLORS[iconKey];
  const render = ICONS[iconKey];
  return render({ color, size });
}
