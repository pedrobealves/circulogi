import { PrismaClient } from "@prisma/client";
import type { Circuit } from "../types/circuit";

const config = useRuntimeConfig();
const client = new PrismaClient({
  datasources: {
    db: {
      url: config.bdDirectUrl as string,
    },
  },
});

export const create = async (
  circuit: Circuit
): Promise<Circuit | undefined> => {
  const circuitCreated = await client.circuit.create({
    data: circuit,
  });

  console.log("Circuit created", circuitCreated);

  if (circuitCreated) {
    return circuitCreated;
  }

  return undefined;
};
