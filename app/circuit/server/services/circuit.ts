import { PrismaClient } from "@prisma/client";
import type { Circuit } from "../types/circuit";

const prisma = new PrismaClient();

export const create = async (
  circuit: Circuit
): Promise<Circuit | undefined> => {
  const circuitCreated = await prisma.circuit.create({
    data: circuit,
  });

  if (circuitCreated) {
    return circuitCreated;
  }

  return undefined;
};
