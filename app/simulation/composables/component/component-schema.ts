import { z } from "zod";

export const componentSchema = z.object({
  type: z.string(),
  category: z.enum(["GATE", "MEMORY", "IO", "TIMING", "MISC"]),
  description: z.string(),
  properties: z.array(
    z.object({
      name: z.string(),
      type: z.enum(["NUMBER", "SELECT", "TEXT"]),
      label: z.string(),
      default: z.union([z.string(), z.number()]),
      min: z.number().optional(),
      max: z.number().optional(),
      options: z.array(z.string()).optional(),
    })
  ),
  maxInputs: z.number().optional(),
  maxOutputs: z.number().optional(),
});

// Esse tipo será inferido automaticamente a partir do schema
export type Component = z.infer<typeof componentSchema>;
