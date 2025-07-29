import { z } from 'zod';

export const projectSchema = z.object({
  title: z
    .string()
    .min(8, 'Title must be at least 8 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  topic: z
    .string()
    .min(1, 'Topic is required'),
  expertise_level: z
    .string()
    .min(1, 'Expertise level is required'),
  mandatory_skills: z
    .array(z.string())
    .optional(),
  budget_min: z
    .number()
    .min(0, 'Minimum budget must be positive')
    .optional(),
  budget_max: z
    .number()
    .min(0, 'Maximum budget must be positive')
    .optional(),
  people_count: z
    .number()
    .min(1, 'Number of people must be at least 1')
    .default(1),
}).refine((data) => {
  if (data.budget_min && data.budget_max) {
    return data.budget_min <= data.budget_max;
  }
  return true;
}, {
  message: 'Minimum budget must be less than or equal to maximum budget',
  path: ['budget_max'],
});

export type ProjectFormData = z.infer<typeof projectSchema>;