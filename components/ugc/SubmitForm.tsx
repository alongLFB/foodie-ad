"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ugcSubmissionSchema, UGCSubmissionSchema } from "@/lib/validations";
import { VIBE_OPTIONS, CATEGORY_EMOJI, FoodCategory } from "@/types";
import { useDropzone } from "react-dropzone";

interface SubmitFormProps {
  onClose: () => void;
  lang?: "en" | "zh";
}

const AREAS = [
  "Downtown Abu Dhabi", "Corniche", "Tourist Club Area",
  "Reem Island", "Al Maryah Island", "Khalidiyah",
  "Al Zahiyah", "Yas Island", "Saadiyat Island",
  "Khalifa City", "Mohammed Bin Zayed City", "Other",
];

const CATEGORIES: { value: FoodCategory; label: string }[] = [
  { value: "chinese", label: `${CATEGORY_EMOJI.chinese} Chinese` },
  { value: "arabic", label: `${CATEGORY_EMOJI.arabic} Arabic/Middle Eastern` },
  { value: "indian", label: `${CATEGORY_EMOJI.indian} Indian` },
  { value: "western", label: `${CATEGORY_EMOJI.western} Western/American` },
  { value: "japanese", label: `${CATEGORY_EMOJI.japanese} Japanese` },
  { value: "seafood", label: `${CATEGORY_EMOJI.seafood} Seafood` },
  { value: "cafe", label: `${CATEGORY_EMOJI.cafe} Café/Brunch` },
  { value: "dessert", label: `${CATEGORY_EMOJI.dessert} Desserts` },
  { value: "fast-food", label: `${CATEGORY_EMOJI["fast-food"]} Fast Food` },
];

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export default function SubmitForm({ onClose, lang = "en" }: SubmitFormProps) {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [funnyScore, setFunnyScore] = useState(3);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<UGCSubmissionSchema>({
    resolver: zodResolver(ugcSubmissionSchema),
    defaultValues: {
      vibes: [],
      funnyScore: 3,
      category: undefined,
    },
  });

  const descriptionValue = watch("description") || "";

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const onSubmit = async (data: UGCSubmissionSchema) => {
    setStatus("submitting");
    try {
      // Simulate API call — replace with actual Supabase call
      await new Promise((res) => setTimeout(res, 1800));

      // In production: POST to /api/submit with FormData
      // const formData = new FormData();
      // Object.entries(data).forEach(([k, v]) => formData.append(k, JSON.stringify(v)));
      // if (imageFile) formData.append('image', imageFile);
      // await fetch('/api/submit', { method: 'POST', body: formData });

      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  // Success screen
  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-8 gap-6 text-center"
      >
        <motion.div
          animate={{ rotate: [0, 15, -15, 10, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-6xl"
        >
          🎉
        </motion.div>
        <div>
          <h3
            className="text-2xl font-black mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            {lang === "zh" ? "提交成功！" : "Submitted! 🍽️"}
          </h3>
          <p
            className="text-base leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {lang === "zh"
              ? "🔍 管理员正在饿着肚子快马加鞭审核中，通过后即可展示！"
              : "🔍 Our admin is frantically reviewing on an empty stomach — it'll show up once approved!"}
          </p>
          <p
            className="text-sm mt-2 italic"
            style={{ color: "var(--text-muted)" }}
          >
            {lang === "zh"
              ? "（请不要投喂管理员，审核会更快）"
              : "(We cannot guarantee reviews go faster with bribery... but it probably helps)"}
          </p>
        </div>
        <motion.button
          onClick={onClose}
          className="px-8 py-3 rounded-full font-bold text-white"
          style={{
            background: "linear-gradient(135deg, #F5A623, #FF6B6B)",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {lang === "zh" ? "关闭" : "Close"}
        </motion.button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="text-center mb-2">
        <span className="text-4xl">📝</span>
        <h2
          className="text-2xl font-black mt-2"
          style={{ color: "var(--text-primary)" }}
        >
          {lang === "zh" ? "我要爆料！" : "Submit a Spot!"}
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          {lang === "zh"
            ? "爆料好店 / 踩雷避坑，都欢迎！"
            : "Share the gems AND the disasters — we want both!"}
        </p>
      </div>

      {/* Restaurant Name */}
      <div>
        <label className="form-label">
          {lang === "zh" ? "🏪 餐厅名称 *" : "🏪 Restaurant Name *"}
        </label>
        <input
          {...register("name")}
          className={`form-input ${errors.name ? "error" : ""}`}
          placeholder={lang === "zh" ? "餐厅叫啥名？" : "What's this place called?"}
        />
        {errors.name && (
          <p className="form-error">{errors.name.message}</p>
        )}
      </div>

      {/* Description / Funny Review */}
      <div>
        <label className="form-label">
          {lang === "zh" ? "📣 你的评价 *" : "📣 Your Hot Take *"}
        </label>
        <textarea
          {...register("description")}
          className={`form-input ${errors.description ? "error" : ""}`}
          rows={3}
          placeholder={
            lang === "zh"
              ? "别写小作文，夸到点子上！（或者把踩雷经历分享出来）"
              : "Don't write an essay — keep it punchy! (Or roast it mercilessly)"
          }
          style={{ resize: "vertical" }}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.description ? (
            <p className="form-error">{errors.description.message}</p>
          ) : (
            <span />
          )}
          <span
            className="text-xs"
            style={{
              color:
                descriptionValue.length > 280
                  ? "var(--color-coral)"
                  : "var(--text-muted)",
            }}
          >
            {descriptionValue.length}/300
          </span>
        </div>
      </div>

      {/* Address + Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">
            {lang === "zh" ? "📍 地址 *" : "📍 Address *"}
          </label>
          <input
            {...register("address")}
            className={`form-input ${errors.address ? "error" : ""}`}
            placeholder={lang === "zh" ? "大概在哪儿？" : "Rough address"}
          />
          {errors.address && (
            <p className="form-error">{errors.address.message}</p>
          )}
        </div>
        <div>
          <label className="form-label">
            {lang === "zh" ? "🗺️ 区域 *" : "🗺️ Area *"}
          </label>
          <select
            {...register("area")}
            className={`form-input ${errors.area ? "error" : ""}`}
          >
            <option value="">{lang === "zh" ? "选择区域" : "Select area"}</option>
            {AREAS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          {errors.area && <p className="form-error">{errors.area.message}</p>}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="form-label">
          {lang === "zh" ? "🍽️ 餐厅类型 *" : "🍽️ Category *"}
        </label>
        <select
          {...register("category")}
          className={`form-input ${errors.category ? "error" : ""}`}
        >
          <option value="">{lang === "zh" ? "选择类型" : "Select category"}</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        {errors.category && <p className="form-error">{errors.category.message}</p>}
      </div>

      {/* Vibe Tags */}
      <div>
        <label className="form-label">
          {lang === "zh" ? "🧭 适合场景 *（可多选）" : "🧭 Best Vibes * (multi-select)"}
        </label>
        <Controller
          name="vibes"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2 mt-1">
              {VIBE_OPTIONS.map((vibe) => {
                const isSelected = (field.value || []).includes(vibe.id);
                return (
                  <motion.button
                    key={vibe.id}
                    type="button"
                    className={`vibe-chip text-xs ${isSelected ? "active" : ""}`}
                    style={{ padding: "6px 12px" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const current = field.value || [];
                      field.onChange(
                        isSelected
                          ? current.filter((v: string) => v !== vibe.id)
                          : [...current, vibe.id]
                      );
                    }}
                  >
                    {vibe.emoji} {lang === "zh" ? vibe.labelZh : vibe.labelEn}
                  </motion.button>
                );
              })}
            </div>
          )}
        />
        {errors.vibes && (
          <p className="form-error">{errors.vibes.message as string}</p>
        )}
      </div>

      {/* Funny Score */}
      <div>
        <label className="form-label">
          {lang === "zh"
            ? `😂 毒舌评分 * — ${["", "根本不好吃！", "就那样吧", "还不错", "很推荐！", "人间绝品！"][funnyScore]}`
            : `😂 Funny Score * — ${["", "Total disaster!", "Meh...", "Pretty good!", "Highly recommended!", "Life-changing!"][funnyScore]}`}
        </label>
        <div className="flex gap-2 mt-2">
          {[1, 2, 3, 4, 5].map((score) => (
            <motion.button
              key={score}
              type="button"
              onClick={() => {
                setFunnyScore(score);
              }}
              className="text-2xl"
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              style={{
                opacity: score <= funnyScore ? 1 : 0.3,
                filter: score <= funnyScore ? "none" : "grayscale(1)",
              }}
            >
              😂
            </motion.button>
          ))}
        </div>
        <input type="hidden" {...register("funnyScore", { valueAsNumber: true })} value={funnyScore} />
      </div>

      {/* Image Upload */}
      <div>
        <label className="form-label">
          {lang === "zh" ? "📸 上传图片（可选）" : "📸 Upload Photo (optional)"}
        </label>
        <div
          {...getRootProps()}
          className="mt-1 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all"
          style={{
            borderColor: isDragActive ? "var(--color-saffron)" : "var(--border-color)",
            background: isDragActive ? "rgba(245,166,35,0.05)" : "var(--bg-secondary)",
          }}
        >
          <input {...getInputProps()} />
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setImageFile(null);
                  setImagePreview(null);
                }}
                className="absolute top-2 right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.7)", color: "white" }}
              >
                ✕
              </button>
            </div>
          ) : (
            <div>
              <span className="text-3xl">📷</span>
              <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
                {isDragActive
                  ? (lang === "zh" ? "放开！" : "Drop it!")
                  : lang === "zh"
                  ? "拖拽或点击上传（最大5MB）"
                  : "Drag & drop or click (max 5MB)"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Submitter Name (optional) */}
      <div>
        <label className="form-label">
          {lang === "zh" ? "👤 你的昵称（可选）" : "👤 Your nickname (optional)"}
        </label>
        <input
          {...register("submitterName")}
          className="form-input"
          placeholder={lang === "zh" ? "匿名吃货也没关系" : "Anonymous foodie is fine too"}
        />
      </div>

      {/* Submit button */}
      <div className="flex gap-3 pt-2">
        <motion.button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 rounded-xl font-semibold border-2 transition-all"
          style={{
            borderColor: "var(--border-color)",
            color: "var(--text-secondary)",
            background: "transparent",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {lang === "zh" ? "取消" : "Cancel"}
        </motion.button>
        <motion.button
          type="submit"
          disabled={status === "submitting"}
          className="flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"
          style={{
            background: status === "submitting"
              ? "var(--border-color)"
              : "linear-gradient(135deg, #F5A623, #FF6B6B)",
            cursor: status === "submitting" ? "not-allowed" : "pointer",
          }}
          whileHover={status !== "submitting" ? { scale: 1.02 } : {}}
          whileTap={status !== "submitting" ? { scale: 0.98 } : {}}
        >
          {status === "submitting" ? (
            <>
              <span className="fun-loader-chopsticks text-lg">🥢</span>
              {lang === "zh" ? "提交中..." : "Submitting..."}
            </>
          ) : (
            <>
              🚀 {lang === "zh" ? "提交爆料！" : "Submit Spot!"}
            </>
          )}
        </motion.button>
      </div>

      {status === "error" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm"
          style={{ color: "var(--color-coral)" }}
        >
          {lang === "zh" ? "❌ 提交失败，请再试一次" : "❌ Submission failed, please try again"}
        </motion.p>
      )}
    </form>
  );
}
