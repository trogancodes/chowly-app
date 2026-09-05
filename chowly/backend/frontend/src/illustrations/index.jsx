// Hand-drawn, single-line illustrations in the spirit of the Monte reference —
// warm, loose linework in terracotta, no fill, no photographic imagery.
// Each is a self-contained SVG so it can be dropped anywhere and resized freely.

export function DinerIllustration({ className = "w-40 h-40" }) {
  return (
    <svg viewBox="0 0 200 200" className={className}>
      <g className="line-illustration">
        {/* head */}
        <circle cx="100" cy="55" r="22" />
        {/* body leaning over a plate */}
        <path d="M78 74c-6 10-10 22-8 34" />
        <path d="M122 74c6 10 10 22 8 34" />
        <path d="M70 108c10 8 50 8 60 0" />
        {/* arm holding fork to mouth */}
        <path d="M92 60c-14 4-24 16-26 30" />
        <path d="M66 90c-4 4-6 8-4 12" />
        {/* plate */}
        <ellipse cx="100" cy="150" rx="46" ry="10" />
        <ellipse cx="100" cy="147" rx="34" ry="6" />
        {/* steam */}
        <path d="M86 118c-3 6 3 8 0 14" />
        <path d="M100 114c-3 6 3 8 0 14" />
        <path d="M114 118c-3 6 3 8 0 14" />
      </g>
    </svg>
  );
}

export function ChefIllustration({ className = "w-40 h-40" }) {
  return (
    <svg viewBox="0 0 200 200" className={className}>
      <g className="line-illustration">
        {/* chef hat */}
        <path d="M78 62c-4-16 10-26 22-26s26 10 22 26" />
        <path d="M74 62h52c4 0 4 14 0 14H74c-4 0-4-14 0-14Z" />
        {/* face */}
        <circle cx="100" cy="100" r="24" />
        {/* body */}
        <path d="M70 168c2-24 14-38 30-38s28 14 30 38" />
        {/* spoon in hand */}
        <path d="M60 150c-8-6-14-4-16 4" />
        <circle cx="42" cy="158" r="6" />
      </g>
    </svg>
  );
}

export function WaiterIllustration({ className = "w-40 h-40" }) {
  return (
    <svg viewBox="0 0 200 200" className={className}>
      <g className="line-illustration">
        <circle cx="100" cy="52" r="20" />
        <path d="M100 72v50" />
        <path d="M76 168c2-30 12-46 24-46s22 16 24 46" />
        {/* tray arm */}
        <path d="M124 92c14 2 24 12 26 24" />
        <ellipse cx="156" cy="120" rx="26" ry="6" />
        <path d="M150 116v-14M162 116v-14" />
        {/* other arm */}
        <path d="M78 92c-10 4-16 12-18 22" />
      </g>
    </svg>
  );
}

export function BartenderIllustration({ className = "w-40 h-40" }) {
  return (
    <svg viewBox="0 0 200 200" className={className}>
      <g className="line-illustration">
        <circle cx="100" cy="55" r="20" />
        <path d="M76 168c2-28 12-42 24-42s22 14 24 42" />
        {/* shaker */}
        <path d="M60 100l14-24h16l14 24Z" />
        <path d="M76 76v-10" />
        <path d="M56 100c-6 6-6 14 0 20" />
      </g>
    </svg>
  );
}

export function ReceiptIllustration({ className = "w-40 h-40" }) {
  return (
    <svg viewBox="0 0 200 200" className={className}>
      <g className="line-illustration">
        <path d="M64 40h72v128l-12-10-12 10-12-10-12 10-12-10-12 10Z" />
        <path d="M78 66h44M78 84h44M78 102h30" />
        <path d="M132 150c14 2 22-8 20-20" strokeDasharray="0" />
      </g>
    </svg>
  );
}

export function ClockIllustration({ className = "w-24 h-24" }) {
  return (
    <svg viewBox="0 0 200 200" className={className}>
      <g className="line-illustration">
        <circle cx="100" cy="100" r="60" />
        <path d="M100 66v36l24 16" />
        <path d="M100 30v10M100 160v10M30 100h10M160 100h10" />
      </g>
    </svg>
  );
}

export function DrinkIllustration({ className = "w-24 h-24" }) {
  return (
    <svg viewBox="0 0 200 200" className={className}>
      <g className="line-illustration">
        <path d="M64 56h72l-10 100c0 8-52 8-52 0Z" />
        <path d="M64 56c0-10 72-10 72 0" />
        <path d="M84 76c8 6 24 6 32 0" />
        <path d="M136 60l18-14" />
      </g>
    </svg>
  );
}

export function StorefrontIllustration({ className = "w-16 h-16" }) {
  return (
    <svg viewBox="0 0 200 200" className={className}>
      <g className="line-illustration">
        <path d="M40 90v66h120V90" />
        <path d="M30 90l14-34h112l14 34Z" />
        <path d="M30 90c0 10 10 18 20 18s20-8 20-18M70 90c0 10 10 18 20 18s20-8 20-18M110 90c0 10 10 18 20 18s20-8 20-18M150 90c0 10 8 18 20 18" />
        <path d="M84 156v-40h32v40" />
      </g>
    </svg>
  );
}

export function StarRating({ value, onChange, className = "w-8 h-8" }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110"
        >
          <svg viewBox="0 0 24 24" className={className}>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"
              fill={n <= value ? "#C1502E" : "none"}
              stroke="#C1502E"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}
