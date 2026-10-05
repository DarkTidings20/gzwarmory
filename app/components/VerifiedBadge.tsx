export default function VerifiedBadge({ verified }: { verified: boolean }) {
  if (verified) {
    return (
      <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wide bg-emerald-950 text-emerald-400 border border-emerald-800/60">
        verified
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wide bg-gray-800 text-gray-400 border border-gray-700">
      unverified
    </span>
  );
}
