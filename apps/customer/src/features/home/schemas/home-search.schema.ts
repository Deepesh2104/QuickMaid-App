import { z } from 'zod';

export const homeSearchSchema = z.object({
  query: z.string().max(60).transform((v) => v.trim()),
});

export type HomeSearchForm = z.infer<typeof homeSearchSchema>;
