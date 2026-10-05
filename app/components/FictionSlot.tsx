import type { FictionSlot as FictionSlotData } from "@/lib/types/guides";

/** Kit-first fiction: optional hook above, ~200-word vignette below the kit. */
export default function FictionSlot({
  fiction,
  placement,
}: {
  fiction: FictionSlotData;
  placement: "hook" | "vignette";
}) {
  if (placement === "hook") {
    if (!fiction.hook) return null;
    return (
      <p className="text-sm italic text-amber-500/80 border-l-2 border-amber-700/50 pl-3 mb-4">
        {fiction.hook}
      </p>
    );
  }

  const isPlaceholder = fiction.vignette.status === "placeholder";

  return (
    <aside
      className={`mt-6 rounded-xl border px-5 py-4 ${
        isPlaceholder
          ? "border-dashed border-gray-700 bg-gray-900/40"
          : "border-gray-800 bg-gray-900"
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500">
          Field note · {fiction.vignette.author}
        </h4>
        <span className="text-[10px] font-mono uppercase text-gray-600">
          {fiction.vignette.status} · ~200 words
        </span>
      </div>
      <p
        className={`text-sm leading-relaxed whitespace-pre-wrap ${
          isPlaceholder ? "text-gray-500 italic" : "text-gray-300"
        }`}
      >
        {fiction.vignette.text}
      </p>
    </aside>
  );
}
