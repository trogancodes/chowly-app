import React, { useState } from "react";
import { motion } from "framer-motion";
import { FoodIconByKey } from "../illustrations/foodIcons.jsx";
import Button from "./Button.jsx";

// A small food-themed memory-match game shown on the order tracking page —
// something to do while the kitchen works, in the same visual language as the
// rest of the app (same tiles/icons used on the menu).
const GAME_ICONS = ["riceBowl", "fish", "pizza", "cocktail", "dessert", "espresso"];

function shuffledDeck() {
  const pairs = [...GAME_ICONS, ...GAME_ICONS].map((key) => ({ key }));
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs.map((c, id) => ({ ...c, id }));
}

function Card({ card, faceUp, matched, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative aspect-square w-full"
      style={{ perspective: 600 }}
      aria-label={matched ? "Matched card" : "Face-down card"}
    >
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: faceUp || matched ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl bg-terracotta font-display text-lg text-cream"
          style={{ backfaceVisibility: "hidden" }}
        >
          ?
        </div>
        <div
          className={`absolute inset-0 flex items-center justify-center rounded-xl bg-cream-dark ${
            matched ? "ring-2 ring-sage" : ""
          }`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <FoodIconByKey iconKey={card.key} size={36} />
        </div>
      </motion.div>
    </button>
  );
}

export default function MemoryGame() {
  const [deck, setDeck] = useState(shuffledDeck);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);

  const won = matched.length === deck.length;

  function handleFlip(id) {
    if (busy || flipped.includes(id) || matched.includes(id) || flipped.length === 2) return;
    const next = [...flipped, id];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      setBusy(true);
      const [a, b] = next;
      const same = deck.find((c) => c.id === a).key === deck.find((c) => c.id === b).key;
      setTimeout(
        () => {
          if (same) setMatched((m) => [...m, a, b]);
          setFlipped([]);
          setBusy(false);
        },
        same ? 400 : 700
      );
    }
  }

  function newGame() {
    setDeck(shuffledDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setBusy(false);
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        {deck.map((card) => (
          <Card
            key={card.id}
            card={card}
            faceUp={flipped.includes(card.id)}
            matched={matched.includes(card.id)}
            onClick={() => handleFlip(card.id)}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-ink/60">
        <span>{moves} move{moves !== 1 ? "s" : ""}</span>
        {!won && (
          <button onClick={newGame} className="text-terracotta underline underline-offset-4">
            Shuffle
          </button>
        )}
      </div>
      {won && (
        <>
          <p className="mt-3 text-center font-medium text-sage">🎉 All matched — nice work.</p>
          <Button variant="outline" className="mt-3 w-full" onClick={newGame}>
            Play again
          </Button>
        </>
      )}
    </div>
  );
}
