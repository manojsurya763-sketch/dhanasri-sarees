"use client";

import { useEffect, useState } from "react";

const THUMB_CLASS =
  "pointer-events-auto absolute h-full w-full appearance-none bg-transparent " +
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 " +
  "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 " +
  "[&::-webkit-slider-thumb]:border-maroon-500 [&::-webkit-slider-thumb]:bg-cream-50 [&::-webkit-slider-thumb]:shadow " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 " +
  "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 " +
  "[&::-moz-range-thumb]:border-maroon-500 [&::-moz-range-thumb]:bg-cream-50";

function PriceBubble({ percent, amount }: { percent: number; amount: number }) {
  return (
    <div
      className="pointer-events-none absolute bottom-full mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-maroon-500 px-2 py-1 text-xs font-medium text-cream-50 shadow"
      style={{ left: `${percent}%` }}
    >
      ₹{amount.toLocaleString("en-IN")}
    </div>
  );
}

export function PriceRangeSlider({
  min,
  max,
  value,
  onCommit,
}: {
  min: number;
  max: number;
  value: [number, number];
  onCommit: (range: [number, number]) => void;
}) {
  const [local, setLocal] = useState<[number, number]>(value);
  const [activeThumb, setActiveThumb] = useState<"min" | "max" | null>(null);

  useEffect(() => setLocal(value), [value]);

  const bounded: [number, number] = [Math.max(min, local[0]), Math.min(max, local[1])];
  const span = Math.max(1, max - min);
  const leftPct = ((bounded[0] - min) / span) * 100;
  const rightPct = ((bounded[1] - min) / span) * 100;

  function commit(next: [number, number]) {
    setLocal(next);
    onCommit(next);
  }

  function endDrag() {
    commit(local);
    setActiveThumb(null);
  }

  return (
    <div>
      <div className="relative h-4">
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-maroon-500/15" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-maroon-500"
          style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }}
        />
        {activeThumb === "min" && <PriceBubble percent={leftPct} amount={bounded[0]} />}
        {activeThumb === "max" && <PriceBubble percent={rightPct} amount={bounded[1]} />}
        <input
          type="range"
          aria-label="Minimum price"
          min={min}
          max={max}
          value={bounded[0]}
          onChange={(e) => setLocal([Math.min(Number(e.target.value), bounded[1]), bounded[1]])}
          onMouseDown={() => setActiveThumb("min")}
          onTouchStart={() => setActiveThumb("min")}
          onFocus={() => setActiveThumb("min")}
          onMouseUp={endDrag}
          onTouchEnd={endDrag}
          onKeyUp={endDrag}
          onBlur={endDrag}
          className={THUMB_CLASS}
        />
        <input
          type="range"
          aria-label="Maximum price"
          min={min}
          max={max}
          value={bounded[1]}
          onChange={(e) => setLocal([bounded[0], Math.max(Number(e.target.value), bounded[0])])}
          onMouseDown={() => setActiveThumb("max")}
          onTouchStart={() => setActiveThumb("max")}
          onFocus={() => setActiveThumb("max")}
          onMouseUp={endDrag}
          onTouchEnd={endDrag}
          onKeyUp={endDrag}
          onBlur={endDrag}
          className={THUMB_CLASS}
        />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          type="number"
          value={bounded[0]}
          onChange={(e) => commit([Number(e.target.value), bounded[1]])}
          className="w-full rounded-lg border border-maroon-500/20 bg-cream-50 px-2 py-1.5 text-sm text-maroon-900"
        />
        <input
          type="number"
          value={bounded[1]}
          onChange={(e) => commit([bounded[0], Number(e.target.value)])}
          className="w-full rounded-lg border border-maroon-500/20 bg-cream-50 px-2 py-1.5 text-sm text-maroon-900"
        />
      </div>
    </div>
  );
}
