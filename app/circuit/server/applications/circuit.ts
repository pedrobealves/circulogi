import { H3Event } from "h3";
import * as circuitService from "../services/circuit";
import type { Circuit } from "../types/circuit";
import { newCircuitSchema } from "../types/circuit";
import { serverSupabaseUser } from "#supabase/server";
import authMiddleware from "../utils/auth";

export const create = async (event: H3Event): Promise<Circuit | string> => {
  await authMiddleware(event);

  const body = await readValidatedBody(event, newCircuitSchema.parse);

  const user = event.context.user;

  const newCircuit = await circuitService.create(body, user.id);

  if (!newCircuit) {
    setResponseStatus(event, 500);
    return "Erro ao cadastrar circuit";
  }

  setResponseStatus(event, 200);
  return newCircuit;
};

// buscaTodos
export const getAllCircuits = async (
  event: H3Event
): Promise<Circuit[] | string> => {
  await authMiddleware(event);

  const user = event.context.user;

  const circuits = await circuitService.getAll(user.id);

  if (!circuits.length) {
    setResponseStatus(event, 404);
    return "Não há circuitos cadastrados";
  }

  setResponseStatus(event, 200);

  return circuits;
};
