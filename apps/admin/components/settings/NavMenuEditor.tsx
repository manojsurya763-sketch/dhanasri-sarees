"use client";

import { useState } from "react";
import { updateSettings } from "@/lib/api";
import type { NavLink } from "@/lib/types";

export function NavMenuEditor({ initialLinks }: { initialLinks: NavLink[] | null }) {
  const [links, setLinks] = useState<NavLink[]>(initialLinks ?? []);
  const [label, setLabel] = useState("");
  const [href, setHref] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function addLink() {
    if (!label.trim() || !href.trim()) return;
    if (links.length >= 10) return;
    setLinks((l) => [...l, { label: label.trim(), href: href.trim() }]);
    setLabel("");
    setHref("");
  }

  function removeLink(index: number) {
    setLinks((l) => l.filter((_, i) => i !== index));
  }

  function moveLink(index: number, direction: -1 | 1) {
    setLinks((l) => {
      const next = [...l];
      const target = index + direction;
      if (target < 0 || target >= next.length) return l;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updateSettings({ navLinks: links });
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save nav menu");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-md border border-slate-200 bg-white p-5">
      <p className="mb-3 text-sm font-semibold text-slate-700">Navigation menu</p>
      <p className="mb-4 text-xs text-slate-500">
        Controls the links shown in the storefront header. Leave empty to use the site's default menu.
      </p>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      {saved && !saving && <p className="mb-3 text-sm text-green-700">Nav menu updated on the live site.</p>}

      <div className="mb-4 space-y-2">
        {links.length === 0 ? (
          <p className="text-xs text-slate-400">No custom links set — using the default menu.</p>
        ) : (
          links.map((link, index) => (
            <div key={index} className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm">
              <span className="flex-1 font-medium text-slate-900">{link.label}</span>
              <span className="flex-1 truncate text-slate-500">{link.href}</span>
              <button
                type="button"
                disabled={index === 0}
                onClick={() => moveLink(index, -1)}
                className="rounded border border-slate-300 px-1.5 text-xs text-slate-600 disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={index === links.length - 1}
                onClick={() => moveLink(index, 1)}
                className="rounded border border-slate-300 px-1.5 text-xs text-slate-600 disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => removeLink(index)}
                className="rounded border border-slate-300 px-1.5 text-xs text-red-600"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mb-4 flex gap-2">
        <input
          placeholder="Label (e.g. Wedding)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-1/2 rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        />
        <input
          placeholder="Link (e.g. /category/wedding)"
          value={href}
          onChange={(e) => setHref(e.target.value)}
          className="w-1/2 rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        />
        <button
          type="button"
          onClick={addLink}
          disabled={links.length >= 10}
          className="shrink-0 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-40"
        >
          Add
        </button>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save nav menu"}
      </button>
    </section>
  );
}
