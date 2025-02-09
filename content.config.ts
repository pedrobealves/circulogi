import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    components: defineCollection({
      type: "data",
      source: "components/**.json",
      schema: z.object({
        type: z.string(),
        category: z.enum(["GATE", "MEMORY", "IO", "TIMING"]),
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
      }),
    }),
  },
});
