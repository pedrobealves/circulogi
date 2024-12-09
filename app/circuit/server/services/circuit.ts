import { Prisma, PrismaClient } from "@prisma/client";
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

export const getAll = async (userId: string): Promise<Circuit[]> => {
  return await client.circuit.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
  });
};

export const getById = async (id: string): Promise<Circuit | null> => {
  return await client.circuit.findFirst({
    where: { id: id },
  });
};

export const update = async (
  circuit: Circuit,
  id: string
): Promise<boolean> => {
  const circuitUpdated = await client.circuit.update({
    where: { id: id },
    data: {
      name: circuit.name,
      version: circuit.version,
      content: circuit.content ?? undefined,
      updatedAt: new Date(),
    },
  });

  return !!circuitUpdated;
};

export const deleteCircuit = async (id: string): Promise<boolean> => {
  const deletedCircuit = await client.circuit.delete({
    where: { id: id },
  });

  return deletedCircuit !== null;
};
