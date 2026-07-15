# 🍔 Foodie-AD | 阿布扎比最毒舌美食指南

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.0-f0187e?logo=framer)](https://www.framer.com/motion/)
[![next-intl](https://img.shields.io/badge/i18n-next--intl-green)]()

> *English documentation is available in the second half of this file.*

**Foodie-AD** 是一个专为阿布扎比打造的**高质量、高颜值、毒舌且真实**的美食点评平台。从茅台级奢享到路边摊回魂汤，我们用最真实的评价带你发现阿布扎比的美食版图。

---

## ✨ 项目特性 (Features)

*   🌐 **深度国际化 (i18n)**：基于 `next-intl` 实现完美的的中英双语无缝切换，连打分吐槽的文案都地道入味。
*   🎨 **超一流视觉设计**：采用现代网页设计美学，告别古板的约束。全自适应宽度屏幕铺展、流光渐变文字、Glassmorphism 玻璃拟物态卡片。
*   🪄 **微交互与丝滑动画**：全面集成 `framer-motion`，从页面挂载时的弹性入场，到悬浮按钮（FAB）的物理碰撞感反馈，每一处交互都充满“呼吸感”。
*   🗺️ **赛博朋克美食地图**：内置基于 Mapbox 的交互式地图组件，支持“🌃赛博朋克”与“🌴度假风”双主题无缝切换，点击 Emoji 即可查看店铺弹窗。
*   🏷️ **“吃货状态”快速筛选 (Vibe Filters)**：打破传统的菜系分类，按“深夜回血专用”、“商务请客撑场面”等实际应用场景快速筛选美食。
*   📝 **UGC 爆料提交系统**：右下角常驻悬浮按钮，支持用户通过动画表单（包含图片拖拽上传、毒舌指数打分）在线提交新餐厅。

## 🛠️ 技术栈 (Tech Stack)

*   **框架**: [Next.js 16](https://nextjs.org/) (App Router) + React 19
*   **样式**: Vanilla CSS + [Tailwind CSS v4](https://tailwindcss.com/) + 精准内联样式（彻底解决响应式坍塌问题）
*   **动画**: [Framer Motion](https://www.framer.com/motion/)
*   **多语言**: [next-intl](https://next-intl-docs.vercel.app/)
*   **地图**: [Mapbox GL JS](https://www.mapbox.com/) + `react-map-gl`
*   **表单验证**: `react-hook-form` + `zod`

## 🚀 本地运行与部署 (Deployment)

### 1. 环境准备

确保你已经安装了 Node.js (推荐 v18+)。克隆项目到本地后，安装依赖：

```bash
git clone git@github.com:alongLFB/foodie-ad.git
cd foodie-ad
npm install
# 或者使用 yarn / pnpm
```

### 2. 配置环境变量

在项目根目录创建一个 `.env.local` 文件，并填入你的 Mapbox Token（如果不配置，地图区域将显示漂亮的占位符动画）：

```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_public_token_here
```

### 3. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可预览项目。

### 4. 生产环境构建

部署前可运行打包命令，项目已开启 Turbopack，静态页面生成极速：

```bash
npm run build
npm start
```

---
---

# 🍔 Foodie-AD | Abu Dhabi's Most Brutally Honest Food Guide

**Foodie-AD** is a premium, beautifully designed, and brutally honest food review platform tailored specifically for Abu Dhabi. From Michelin-star splurges to hidden shawarma gems, we provide real reviews from real foodies.

## ✨ Features

*   🌐 **Full Bilingual Support (i18n)**: Seamlessly switch between English and Chinese powered by `next-intl`. Every piece of text, from UI elements to funny roasting quotes, is properly localized.
*   🎨 **Premium Modern UI**: Breaking free from rigid layouts, the app utilizes full responsive canvas scaling, vibrant text gradients, and glassmorphism card designs for a truly premium feel.
*   🪄 **Smooth Micro-interactions**: Deeply integrated with `framer-motion` for spring-physics animations, satisfying hover states, and dynamic page mounting effects.
*   🗺️ **Interactive Food Map**: A Mapbox-powered interactive map featuring custom themes ("🌃 Cyberpunk" and "🌴 Resort"). Click on emoji map markers to reveal stunning popup cards.
*   🏷️ **Dynamic Vibe Filters**: Forget boring category filters. Find your next meal by your actual vibe: "Late Night Cravings", "Business Dinner", or "Wallet is crying but it's worth it".
*   📝 **UGC Submission Form**: A fun, animated floating action button opens a comprehensive submission form (with drag-and-drop image uploads and a "Funny Score" slider) for users to spill the tea on new spots.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router) + React 19
*   **Styling**: Vanilla CSS + [Tailwind CSS v4](https://tailwindcss.com/) + Robust inline-styles for perfect layout scaling
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Localization**: [next-intl](https://next-intl-docs.vercel.app/)
*   **Maps**: [Mapbox GL JS](https://www.mapbox.com/) + `react-map-gl`
*   **Forms**: `react-hook-form` + `zod`

## 🚀 Setup and Deployment

### 1. Installation

Ensure you have Node.js installed (v18+ recommended). Clone the repository and install dependencies:

```bash
git clone git@github.com:alongLFB/foodie-ad.git
cd foodie-ad
npm install
# or yarn / pnpm
```

### 2. Environment Variables

Create a `.env.local` file in the root directory to enable the interactive map feature. (If not provided, a beautiful placeholder will be rendered instead):

```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_public_token_here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Build for Production

```bash
npm run build
npm start
```
