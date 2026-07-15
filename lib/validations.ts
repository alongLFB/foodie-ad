import { z } from 'zod';

export const ugcSubmissionSchema = z.object({
  name: z
    .string()
    .min(2, '餐厅名至少2个字，别让我猜 / Restaurant name must be at least 2 characters')
    .max(100),
  nameZh: z.string().max(100).optional(),
  description: z
    .string()
    .min(10, '至少写10个字，别敷衍我 / Min 10 characters please')
    .max(300, '别写小作文，夸到点子上！最多300字 / Keep it punchy, max 300 chars!'),
  address: z
    .string()
    .min(5, '地址至少5个字 / Address too short')
    .max(200),
  area: z.string().min(1, '请选择区域 / Please select an area'),
  category: z.enum(
    ['chinese', 'arabic', 'indian', 'western', 'japanese', 'seafood', 'cafe', 'dessert', 'fast-food'] as const,
    { message: '请选择餐厅类型 / Select a category' }
  ),
  vibes: z.array(z.string()).min(1, '至少选一个场景标签 / Pick at least one vibe'),
  funnyScore: z
    .number()
    .min(1, '评分至少1分')
    .max(5, '最高5分'),
  submitterName: z.string().max(50).optional(),
});

export type UGCSubmissionSchema = z.infer<typeof ugcSubmissionSchema>;
