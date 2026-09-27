"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createProduct, listCategories, updateProduct } from "@/lib/api";
import type { Category, Product } from "@/lib/types";

interface ProductFormProps {
  product?: Product;
}

type FormState = {
  title: string;
  sku: string;
  slug: string;
  categoryId: string;
  occasionTag: string;
  mrp: string;
  price: string;
  discountPct: string;
  description: string;
  images: string[];
  stock: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  fabric: string;
  colour: string;
  origin: string;
  zari: string;
  loom: string;
  work: string;
  length: string;
  blouseTypes: string;
  internationalShipping: boolean;
};

function toFormState(product?: Product): FormState {
  return {
    title: product?.title ?? "",
    sku: product?.sku ?? "",
    slug: product?.slug ?? "",
    categoryId: product?.categoryId ?? "",
    occasionTag: product?.occasionTag ?? "",
    mrp: product?.mrp ?? "",
    price: product?.price ?? "",
    discountPct: String(product?.discountPct ?? 0),
    description: product?.description ?? "",
    images: product?.images ?? [],
    stock: String(product?.stock ?? 0),
    isFeatured: product?.isFeatured ?? false,
    isNewArrival: product?.isNewArrival ?? false,
    isActive: product?.isActive ?? true,
    fabric: product?.fabric ?? "",
    colour: product?.colour ?? "",
    origin: product?.origin ?? "",
    zari: product?.zari ?? "",
    loom: product?.loom ?? "",
    work: product?.work ?? "",
    length: product?.length ?? "",
    blouseTypes: product?.blouseTypes.join(", ") ?? "",
    internationalShipping: product?.internationalShipping ?? true,
  };
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(toFormState(product));
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");

  useEffect(() => {
    listCategories()
      .then((data) => setCategories(data.items))
      .catch(() => {});
  }, []);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addImageUrl() {
    const url = imageUrlInput.trim();
    if (!url) return;
    setForm((f) => ({ ...f, images: [...f.images, url] }));
    setImageUrlInput("");
  }

  function removeImage(index: number) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  }

  function moveImage(index: number, direction: -1 | 1) {
    setForm((f) => {
      const images = [...f.images];
      const target = index + direction;
      if (target < 0 || target >= images.length) return f;
      [images[index], images[target]] = [images[target], images[index]];
      return { ...f, images };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload = {
      title: form.title,
      sku: form.sku,
      slug: form.slug || undefined,
      categoryId: form.categoryId || null,
      occasionTag: form.occasionTag || null,
      mrp: Number(form.mrp),
      price: Number(form.price),
      discountPct: Number(form.discountPct),
      description: form.description || null,
      images: form.images,
      stock: Number(form.stock),
      isFeatured: form.isFeatured,
      isNewArrival: form.isNewArrival,
      isActive: form.isActive,
      fabric: form.fabric || null,
      colour: form.colour || null,
      origin: form.origin || null,
      zari: form.zari || null,
      loom: form.loom || null,
      work: form.work || null,
      length: form.length || null,
      blouseTypes: form.blouseTypes.split(",").map((s) => s.trim()).filter(Boolean),
      internationalShipping: form.internationalShipping,
    };

    try {
      if (product) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload);
      }
      router.push("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save product");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <section className="grid grid-cols-2 gap-4">
        <Field label="Title" required>
          <input required value={form.title} onChange={(e) => set("title", e.target.value)} className={inputClass} />
        </Field>
        <Field label="SKU" required>
          <input required value={form.sku} onChange={(e) => set("sku", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Slug" hint="Leave blank to auto-generate from title">
          <input value={form.slug} onChange={(e) => set("slug", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Category">
          <select value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} className={inputClass}>
            <option value="">— None —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Occasion tag">
          <input value={form.occasionTag} onChange={(e) => set("occasionTag", e.target.value)} className={inputClass} />
        </Field>
      </section>

      <section className="grid grid-cols-3 gap-4">
        <Field label="MRP" required>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={form.mrp}
            onChange={(e) => set("mrp", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Price" required>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Discount %">
          <input
            type="number"
            min="0"
            max="100"
            value={form.discountPct}
            onChange={(e) => set("discountPct", e.target.value)}
            className={inputClass}
          />
        </Field>
      </section>

      <Field label="Description">
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          className={inputClass}
        />
      </Field>

      <div>
        <label className="block text-sm font-medium text-slate-700">Images</label>
        <div className="mt-2 flex flex-wrap gap-3">
          {form.images.map((url, index) => (
            <div key={url} className="relative h-24 w-20 overflow-hidden rounded-md border border-slate-200">
              <Image src={url} alt="" fill sizes="80px" className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-0.5 top-0.5 rounded-full bg-black/60 px-1.5 text-xs text-white"
              >
                ×
              </button>
              <div className="absolute bottom-0.5 left-0.5 flex gap-0.5">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveImage(index, -1)}
                  className="rounded bg-black/60 px-1 text-xs text-white disabled:opacity-30"
                >
                  ←
                </button>
                <button
                  type="button"
                  disabled={index === form.images.length - 1}
                  onClick={() => moveImage(index, 1)}
                  className="rounded bg-black/60 px-1 text-xs text-white disabled:opacity-30"
                >
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            type="url"
            placeholder="https://example.com/photo.jpg"
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addImageUrl();
              }
            }}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={addImageUrl}
            className="shrink-0 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Add
          </button>
        </div>
      </div>

      <section className="grid grid-cols-3 gap-4">
        <Field label="Stock" required>
          <input
            required
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => set("stock", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Fabric">
          <input value={form.fabric} onChange={(e) => set("fabric", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Colour">
          <input value={form.colour} onChange={(e) => set("colour", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Origin">
          <input value={form.origin} onChange={(e) => set("origin", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Zari">
          <input value={form.zari} onChange={(e) => set("zari", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Loom">
          <input value={form.loom} onChange={(e) => set("loom", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Work">
          <input value={form.work} onChange={(e) => set("work", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Length">
          <input value={form.length} onChange={(e) => set("length", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Blouse types" hint="Comma-separated">
          <input value={form.blouseTypes} onChange={(e) => set("blouseTypes", e.target.value)} className={inputClass} />
        </Field>
      </section>

      <section className="flex flex-wrap gap-6">
        <Checkbox label="Featured" checked={form.isFeatured} onChange={(v) => set("isFeatured", v)} />
        <Checkbox label="New arrival" checked={form.isNewArrival} onChange={(v) => set("isNewArrival", v)} />
        <Checkbox label="Active" checked={form.isActive} onChange={(v) => set("isActive", v)} />
        <Checkbox
          label="International shipping"
          checked={form.internationalShipping}
          onChange={(v) => set("internationalShipping", v)}
        />
      </section>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {submitting ? "Saving…" : product ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}

const inputClass =
  "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none";

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      {required && <span className="text-red-500"> *</span>}
      {children}
      {hint && <span className="mt-1 block text-xs font-normal text-slate-400">{hint}</span>}
    </label>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-700">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}
