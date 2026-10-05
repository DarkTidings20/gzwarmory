"use client";

import { useState } from "react";

const QUOTES = [
  "The dead don't optimize. You should.",
  "Every gram you carry is a decision. Make it count.",
  "Information is the only armor that doesn't slow you down.",
  "They came prepared. They left anyway.",
  "The Raven doesn't rush. The Raven doesn't miss.",
  "Preparation is violence you commit before the fight.",
  "Your enemy has a plan. Build a better one.",
  "In Gray Zone, the margin between alive and extracted is measured in grams.",
];

export default function RavenQuote() {
  // Pick once on mount (client). Avoid setState-in-effect lint failure.
  const [quote] = useState(
    () => QUOTES[Math.floor(Math.random() * QUOTES.length)] ?? QUOTES[4],
  );

  return (
    <p className="text-gray-500 text-sm italic mt-4 mb-2" suppressHydrationWarning>
      &ldquo;{quote}&rdquo;
    </p>
  );
}
