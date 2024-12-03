import { z } from "zod";

export const circuitSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  content: z.any(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const newCircuitSchema = circuitSchema.omit({
  id: true,
  content: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

const updateCircuitSchema = circuitSchema
  .omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type { Circuit } from "@prisma/client";
export type NewCircuit = z.infer<typeof newCircuitSchema>;
