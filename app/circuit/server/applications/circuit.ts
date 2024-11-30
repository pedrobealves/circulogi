import { H3Event } from "h3";
import * as circuitService from "../services/circuit";
import type { Circuit } from "@prisma/client";

export const create = async (event: H3Event): Promise<Circuit | string> => {
  const body = await readBody<Circuit>(event);

  console.log("Creating circuit", body);

  const newCircuit = await circuitService.create(body);

  console.log("Created circuit", newCircuit);

  if (!newCircuit) {
    setResponseStatus(event, 500);
    return "Erro ao cadastrar circuit";
  }

  setResponseStatus(event, 200);
  return newCircuit;
};
