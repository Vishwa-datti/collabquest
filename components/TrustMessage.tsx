
import React, { useState, useEffect } from 'react';

const MESSAGES = [
  "Confidence scores are estimates based on profile alignment, not a guarantee of success.",
  "Our AI suggests possibilities; the human connection is what builds the project.",
  "Bias-checked: We ignore institutional prestige to focus exclusively on your skills.",
  "Matching is based on data provided by users. Results may vary as projects evolve.",
  "We prioritize skill gaps. A lower score doesn't mean a bad teammate, just a different fit.",
  "This is a recommendation engine. Final decisions always rest with you, the team lead."
];

export const TrustMessage: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Pick a random message on mount
    setIndex(Math.floor(Math.random() * MESSAGES.length));
  }, []);

  return (
    <div className="flex items-center gap-4 bg-[#f1f5f9]/60 backdrop-blur-sm border border-[#e2e8f0] rounded-full px-8 py-3.5 text-[#64748b] text-[13px] font-medium transition-all duration-700">
      <span className="flex h-2 w-2 rounded-full bg-[#818cf8] shadow-[0_0_8px_rgba(129,140,248,0.5)]"></span>
      <p>{MESSAGES[index]}</p>
    </div>
  );
};
