"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getSettings, updateSettings } from "@/lib/api";
import { NavMenuEditor } from "@/components/settings/NavMenuEditor";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState } from "@/components/ui/LoadingState";
import type { NavLink } from "@/lib/types";

export default function SettingsPage() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [navLinks, setNavLinks] = useState<NavLink[] | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings()
      .then((data) => {
        setLogoUrl(data.logoUrl);
        setUrlInput(data.logoUrl ?? "");
        setNavLinks(data.navLinks);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load settings"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    const url = urlInput.trim();
    if (!url) return;

    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await updateSettings({ logoUrl: url });
      setLogoUrl(updated.logoUrl);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update logo");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingState />;

  return (
    <div className="max-w-lg space-y-6">
      <PageHeader title="Settings" />

      <section className="rounded-md border border-slate-200 bg-white p-5">
        <p className="mb-3 text-sm font-semibold text-slate-700">Site logo</p>
        <p className="mb-4 text-xs text-slate-500">
          Paste a link to an image (hosted anywhere) and save — it updates immediately on the live storefront, no
          code change or redeploy needed.
        </p>

        <div className="mb-4 flex h-20 w-48 items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50">
          {logoUrl ? (
            <div className="relative h-full w-full">
              <Image src={logoUrl} alt="Current logo" fill sizes="192px" className="object-contain" />
            </div>
          ) : (
            <span className="text-xs text-slate-400">Using default logo file</span>
          )}
        </div>

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        {saved && !saving && <p className="mb-3 text-sm text-green-700">Logo updated on the live site.</p>}

        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://example.com/logo.png"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="shrink-0 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </section>

      <NavMenuEditor initialLinks={navLinks} />
    </div>
  );
}
