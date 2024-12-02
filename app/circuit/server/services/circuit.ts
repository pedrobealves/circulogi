import { PrismaClient } from "@prisma/client";
import type { NewCircuit, Circuit } from "../types/circuit";

const config = useRuntimeConfig();
const client = new PrismaClient({
  datasources: {
    db: {
      url: config.bdUrl as string,
    },
  },
});

export const create = async (
  circuit: NewCircuit,
  userId: string
): Promise<Circuit | undefined> => {
  const circuitCreated = await client.circuit.create({
    data: { ...circuit, userId: userId },
  });

  if (circuitCreated) {
    return circuitCreated;
  }

  return undefined;
};
