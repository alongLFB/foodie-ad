// ============================================================
// Foodie-AD — TypeScript 类型定义
// ============================================================

export type RestaurantStatus = 'pending' | 'approved';

export type VibeTag =
  | 'weekend-gaming'
  | 'reem-island'
  | 'broke-but-tasty'
  | 'midnight-fuel'
  | 'quick-bite'
  | 'health-freak'
  | 'business-flex'
  | 'spicy-challenge'
  | 'date-night'
  | 'brunch-vibes'
  | 'sweet-tooth'
  | 'karak-time'
  | 'alone-time'
  | 'gym-rat';

export type FoodCategory =
  | 'chinese'
  | 'arabic'
  | 'indian'
  | 'western'
  | 'japanese'
  | 'seafood'
  | 'cafe'
  | 'dessert'
  | 'fast-food';

export interface Restaurant {
  id: string;
  name: string;
  nameZh?: string;
  description: string;
  descriptionZh?: string;
  address: string;
  area: string;
  category: FoodCategory;
  vibes: VibeTag[];
  lat: number;
  lng: number;
  rating: number; // 1-5
  funnyScore: number; // 毒舌评分 1-5
  coverImage: string;
  images: string[];
  funnyQuote: string; // 幽默点评
  funnyQuoteZh?: string;
  priceLevel: 1 | 2 | 3 | 4; // 💰 to 💰💰💰💰
  hours?: string;
  phone?: string;
  googleMapsUrl?: string;
  status: RestaurantStatus;
  submittedBy?: string;
  createdAt: string;
}

export interface VibeFilterOption {
  id: VibeTag;
  emoji: string;
  labelEn: string;
  labelZh: string;
}

export interface UGCSubmission {
  name: string;
  nameZh?: string;
  description: string;
  address: string;
  area: string;
  category: FoodCategory;
  vibes: VibeTag[];
  funnyScore: number;
  submitterName?: string;
  image?: File;
}

export interface MapMarkerData {
  id: string;
  lat: number;
  lng: number;
  category: FoodCategory;
  name: string;
  rating: number;
  funnyScore: number;
  coverImage: string;
  funnyQuote: string;
}

export const CATEGORY_EMOJI: Record<FoodCategory, string> = {
  chinese: '🍜',
  arabic: '🫕',
  indian: '🍛',
  western: '🍔',
  japanese: '🍣',
  seafood: '🦞',
  cafe: '☕',
  dessert: '🧁',
  'fast-food': '🌮',
};

export const VIBE_OPTIONS: VibeFilterOption[] = [
  { id: 'weekend-gaming', emoji: '🎮', labelEn: 'Post-Gaming Feast', labelZh: '周末开黑结束吃啥' },
  { id: 'reem-island', emoji: '🏠', labelEn: 'Reem Island Locals', labelZh: 'Reem Island 下楼即达' },
  { id: 'broke-but-tasty', emoji: '💸', labelEn: 'Broke But Bougie', labelZh: '钱包在滴血但好吃' },
  { id: 'midnight-fuel', emoji: '🌙', labelEn: 'Midnight Fuel', labelZh: '深夜回血专用' },
  { id: 'quick-bite', emoji: '🏃', labelEn: '10-Min Dash', labelZh: '快餐10分钟搞定' },
  { id: 'health-freak', emoji: '🌿', labelEn: 'Salad Therapy', labelZh: '吃草减肥系列' },
  { id: 'business-flex', emoji: '💼', labelEn: 'Business Flex', labelZh: '商务请客撑场面' },
  { id: 'spicy-challenge', emoji: '🔥', labelEn: 'Spicy Challenge', labelZh: '辣到飞起挑战赛' },
  { id: 'date-night', emoji: '🥂', labelEn: 'Date Night Flex', labelZh: '约会装杯首选' },
  { id: 'brunch-vibes', emoji: '🍳', labelEn: 'Lazy Weekend Brunch', labelZh: '周末慵懒早午餐' },
  { id: 'sweet-tooth', emoji: '🍰', labelEn: 'Sweet Tooth Heaven', labelZh: '甜品脑袋狂喜' },
  { id: 'karak-time', emoji: '🫖', labelEn: 'Karak & Vibes', labelZh: 'Karak奶茶配大饼' },
  { id: 'alone-time', emoji: '🎧', labelEn: 'Solo Dining Friendly', labelZh: '社恐一人食不尴尬' },
  { id: 'gym-rat', emoji: '💪', labelEn: 'Post-Workout Protein', labelZh: '撸铁后高蛋白狂揽' },
];
