export default function Pre05Banner({ detail }: { detail?: string }) {
  return (
    <div className="mb-6 flex items-start gap-3 bg-amber-950/40 border border-amber-800/50 rounded-lg px-4 py-3 text-sm text-amber-300/80">
      <span className="text-amber-500 mt-0.5 shrink-0" aria-hidden>
        ⚠
      </span>
      <span>
        <strong className="text-amber-400">pre-0.5, unverified.</strong>{" "}
        {detail ??
          "This is a research-window skeleton. Unlock levels, prices, and kit opinions are TBD until 0.5 (Rogue Ops) is known cold. Do not treat placeholders as meta."}
      </span>
    </div>
  );
}
