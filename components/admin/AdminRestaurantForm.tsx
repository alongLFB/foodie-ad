"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Restaurant, CATEGORY_EMOJI, VIBE_OPTIONS, PRICE_OPTIONS, PARKING_OPTIONS } from "@/types";
import { AdminSubmissionSchema, adminSubmissionSchema } from "@/lib/validations";
import { useTranslations } from "next-intl";

interface AdminRestaurantFormProps {
  initialData?: Restaurant;
  secret: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdminRestaurantForm({ initialData, secret, onSuccess, onCancel }: AdminRestaurantFormProps) {
  const t = useTranslations("SubmitForm");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AdminSubmissionSchema>({
    resolver: zodResolver(adminSubmissionSchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      nameZh: initialData?.nameZh || "",
      category: initialData?.category || "chinese",
      area: initialData?.area || "Downtown Abu Dhabi",
      address: initialData?.address || "",
      rating: initialData?.rating || 0,
      lat: initialData?.lat || 24.4539,
      lng: initialData?.lng || 54.3773,
      funnyQuote: initialData?.funnyQuote || "",
      funnyQuoteZh: initialData?.funnyQuoteZh || "",
      description: initialData?.description || "",
      descriptionZh: initialData?.descriptionZh || "",
      funnyScore: initialData?.funnyScore || 3,
      priceLevel: initialData?.priceLevel || 2,
      priceRange: initialData?.priceRange || "medium",
      mustOrder: initialData?.mustOrder || "",
      parking: initialData?.parking || "easy",
      hours: initialData?.hours || "",
      phone: initialData?.phone || "",
      googleMapsUrl: initialData?.googleMapsUrl || "",
      coverImage: initialData?.coverImage || "",
      vibes: initialData?.vibes || [],
      submittedBy: initialData?.submittedBy || "Admin",
      status: initialData?.status || "approved",
    },
  });

  const onSubmit = async (data: AdminSubmissionSchema) => {
    setIsSubmitting(true);
    try {
      const url = initialData 
        ? `/api/admin/restaurants/${initialData.id}?secret=${secret}`
        : `/api/admin/restaurants?secret=${secret}`;
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to save");
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Failed to save data. Please check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { register, handleSubmit, formState: { errors }, watch, setValue } = form;
  const currentVibes = watch("vibes") || [];

  const toggleVibe = (vibeId: string) => {
    if (currentVibes.includes(vibeId)) {
      setValue("vibes", currentVibes.filter(v => v !== vibeId), { shouldValidate: true });
    } else {
      setValue("vibes", [...currentVibes, vibeId], { shouldValidate: true });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="font-bold text-[var(--color-saffron)] text-base border-b border-[var(--border-color)] pb-2">Basic Details</h3>
          
          <div>
            <label className="block mb-1 font-medium">Name (EN) *</label>
            <input {...register("name")} className="w-full p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]" />
            {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
          </div>
          <div>
            <label className="block mb-1 font-medium">Name (ZH)</label>
            <input {...register("nameZh")} className="w-full p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]" />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1 font-medium">Category *</label>
              <select {...register("category")} className="w-full p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                {Object.keys(CATEGORY_EMOJI).map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Area *</label>
              <input {...register("area")} className="w-full p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]" />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Address *</label>
            <input {...register("address")} className="w-full p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1 font-medium">Lat</label>
              <input type="number" step="any" {...register("lat")} className="w-full p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Lng</label>
              <input type="number" step="any" {...register("lng")} className="w-full p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]" />
            </div>
          </div>
        </div>

        {/* Quotes and Descriptions */}
        <div className="space-y-4">
          <h3 className="font-bold text-[var(--color-saffron)] text-base border-b border-[var(--border-color)] pb-2">Content</h3>
          
          <div>
            <label className="block mb-1 font-medium">Funny Quote (EN)</label>
            <textarea {...register("funnyQuote")} rows={2} className="w-full p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Funny Quote (ZH)</label>
            <textarea {...register("funnyQuoteZh")} rows={2} className="w-full p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description (EN)</label>
            <textarea {...register("description")} rows={3} className="w-full p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Description (ZH)</label>
            <textarea {...register("descriptionZh")} rows={3} className="w-full p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]" />
          </div>
        </div>

        {/* Meta & Ratings */}
        <div className="space-y-4">
          <h3 className="font-bold text-[var(--color-saffron)] text-base border-b border-[var(--border-color)] pb-2">Meta & Attributes</h3>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block mb-1 font-medium">Rating (0-5)</label>
              <input type="number" step="0.1" {...register("rating")} className="w-full p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Funny Score</label>
              <input type="number" step="0.1" {...register("funnyScore")} className="w-full p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Price Level</label>
              <input type="number" step="1" {...register("priceLevel")} className="w-full p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1 font-medium">Price Range</label>
              <select {...register("priceRange")} className="w-full p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                {PRICE_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.labelEn}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Parking</label>
              <select {...register("parking")} className="w-full p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                {PARKING_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.labelEn}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Must Order</label>
            <input {...register("mustOrder")} className="w-full p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]" />
          </div>
        </div>

        {/* Media & Extras */}
        <div className="space-y-4">
          <h3 className="font-bold text-[var(--color-saffron)] text-base border-b border-[var(--border-color)] pb-2">Media & Extra</h3>

          <div>
            <label className="block mb-1 font-medium">Cover Image URL</label>
            <input {...register("coverImage")} className="w-full p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Google Maps URL</label>
            <input {...register("googleMapsUrl")} className="w-full p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1 font-medium">Hours</label>
              <input {...register("hours")} className="w-full p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Phone</label>
              <input {...register("phone")} className="w-full p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]" />
            </div>
          </div>
        </div>

        {/* Vibes (Full width) */}
        <div className="md:col-span-2 space-y-2">
          <h3 className="font-bold text-[var(--color-saffron)] text-base border-b border-[var(--border-color)] pb-2">Vibes</h3>
          <div className="flex flex-wrap gap-2 pt-2">
            {VIBE_OPTIONS.map(v => (
              <button
                type="button"
                key={v.id}
                onClick={() => toggleVibe(v.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  currentVibes.includes(v.id) 
                    ? "bg-[#F5A623] text-white border-[#F5A623]" 
                    : "bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border-color)]"
                }`}
              >
                {v.emoji} {v.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border-color)]">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 rounded-xl text-white font-bold bg-[#F5A623] hover:bg-[#E0961E] disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Saving..." : "Save Restaurant"}
        </button>
      </div>
    </form>
  );
}
