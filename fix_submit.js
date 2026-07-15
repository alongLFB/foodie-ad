const fs = require('fs');

const file = './components/ugc/SubmitForm.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/const lang = locale === "zh" \? "zh" : "en";/, 'const t = useTranslations("SubmitForm");\n  const lang = locale === "zh" ? "zh" : "en";');
code = code.replace(/\{lang === "zh" \? "提交成功！" : "Submitted! 🍽️"\}/g, '{t("successTitle")}');
code = code.replace(/\{lang === "zh"\s*\?\s*"🔍 管理员正在饿着肚子快马加鞭审核中，通过后即可展示！"\s*:\s*"🔍 Our admin is frantically reviewing on an empty stomach — it'll show up once approved!"\}/g, '{t("successDesc1")}');
code = code.replace(/\{lang === "zh"\s*\?\s*"（请不要投喂管理员，审核会更快）"\s*:\s*"\(We cannot guarantee reviews go faster with bribery... but it probably helps\)"\}/g, '{t("successDesc2")}');
code = code.replace(/\{lang === "zh" \? "关闭" : "Close"\}/g, '{t("close")}');
code = code.replace(/\{lang === "zh" \? "我要爆料！" : "Submit a Spot!"\}/g, '{t("mainTitle")}');
code = code.replace(/\{lang === "zh"\s*\?\s*"爆料好店 \/ 踩雷避坑，都欢迎！"\s*:\s*"Share the gems AND the disasters — we want both!"\}/g, '{t("mainDesc")}');
code = code.replace(/\{lang === "zh" \? "🏪 餐厅名称 \*" : "🏪 Restaurant Name \*"\}/g, '{t("nameLabel")}');
code = code.replace(/lang === "zh" \? "餐厅叫啥名？" : "What's this place called\?"/g, 't("namePlaceholder")');
code = code.replace(/\{lang === "zh" \? "📣 你的评价 \*" : "📣 Your Hot Take \*"\}/g, '{t("reviewLabel")}');
code = code.replace(/lang === "zh"\s*\?\s*"别写小作文，夸到点子上！（或者把踩雷经历分享出来）"\s*:\s*"Don't write an essay — keep it punchy! \(Or roast it mercilessly\)"/g, 't("reviewPlaceholder")');
code = code.replace(/\{lang === "zh" \? "📍 地址 \*" : "📍 Address \*"\}/g, '{t("addressLabel")}');
code = code.replace(/lang === "zh" \? "大概在哪儿？" : "Rough address"/g, 't("addressPlaceholder")');
code = code.replace(/\{lang === "zh" \? "🗺️ 区域 \*" : "🗺️ Area \*"\}/g, '{t("areaLabel")}');
code = code.replace(/\{lang === "zh" \? "选择区域" : "Select area"\}/g, '{t("areaSelect")}');
code = code.replace(/\{lang === "zh" \? "🍽️ 餐厅类型 \*" : "🍽️ Category \*"\}/g, '{t("categoryLabel")}');
code = code.replace(/\{lang === "zh" \? "选择类型" : "Select category"\}/g, '{t("categorySelect")}');
code = code.replace(/\{lang === "zh" \? "🧭 适合场景 \*（可多选）" : "🧭 Best Vibes \* \(multi-select\)"\}/g, '{t("vibeLabel")}');
code = code.replace(/\{vibe.emoji\} \{lang === "zh" \? vibe.labelZh : vibe.labelEn\}/g, '{vibe.emoji} {locale === "zh" ? vibe.labelZh : vibe.labelEn}');
code = code.replace(/\{lang === "zh"\s*\?\s*`😂 毒舌评分 \* — \$\{\["", "根本不好吃！", "就那样吧", "还不错", "很推荐！", "人间绝品！"\]\[funnyScore\]\}`\s*:\s*`😂 Funny Score \* — \$\{\["", "Total disaster!", "Meh...", "Pretty good!", "Highly recommended!", "Life-changing!"\]\[funnyScore\]\}`\}/g, '{t("funnyScoreLabel")} {t(`funnyScoreDesc${funnyScore}` as any)}');
code = code.replace(/\{lang === "zh" \? "📸 上传图片（可选）" : "📸 Upload Photo \(optional\)"\}/g, '{t("uploadLabel")}');
code = code.replace(/lang === "zh" \? "放开！" : "Drop it!"/g, 't("uploadDrop")');
code = code.replace(/lang === "zh"\s*\?\s*"拖拽或点击上传（最大5MB）"\s*:\s*"Drag & drop or click \(max 5MB\)"/g, 't("uploadHint")');
code = code.replace(/\{lang === "zh" \? "👤 你的昵称（可选）" : "👤 Your nickname \(optional\)"\}/g, '{t("nicknameLabel")}');
code = code.replace(/lang === "zh" \? "匿名吃货也没关系" : "Anonymous foodie is fine too"/g, 't("nicknamePlaceholder")');
code = code.replace(/\{lang === "zh" \? "取消" : "Cancel"\}/g, '{t("cancel")}');
code = code.replace(/\{lang === "zh" \? "提交中..." : "Submitting..."\}/g, '{t("submitting")}');
code = code.replace(/\{lang === "zh" \? "提交爆料！" : "Submit Spot!"\}/g, '{t("submitBtn")}');
code = code.replace(/\{lang === "zh" \? "❌ 提交失败，请再试一次" : "❌ Submission failed, please try again"\}/g, '{t("errorMsg")}');

if (code.indexOf('useTranslations') === -1) {
  code = code.replace(/import \{ useLocale \} from "next-intl";/, 'import { useLocale, useTranslations } from "next-intl";');
}

fs.writeFileSync(file, code);

console.log("Done");
