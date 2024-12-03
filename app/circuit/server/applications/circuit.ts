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

export const getById = async (event: H3Event): Promise<Circuit | string> => {
  await authMiddleware(event);

  const circuitId = getRouterParam(event, "id") || "";

  if (circuitId == "") {
    throw createError({
      status: 400,
      message: "Id do circuito inválido",
      statusMessage: "Erro Id",
      data: {
        message: "Circuito inválido",
      },
    });
  }

  const circuit = await circuitService.getById(circuitId);

  if (!circuit) {
    setResponseStatus(event, 404);
    return "Circuito não encontrado";
  }

  setResponseStatus(event, 200);
  return circuit;
};

export const update = async (event: H3Event): Promise<string> => {
  await authMiddleware(event);

  const circuitId = getRouterParam(event, "id") || "";
  const body = await readBody<Circuit>(event);

  if (circuitId == "") {
    throw createError({
      status: 400,
      message: "Id do circuito inválido",
      data: {
        message: "Circuito inválido",
      },
    });
  }

  const circuit = await circuitService.getById(circuitId);

  if (!circuit) {
    setResponseStatus(event, 404);
    return "Circuito não encontrado";
  }

  if (circuit.userId !== event.context.user.id) {
    setResponseStatus(event, 403);
    return "Usuário não tem permissão para editar este circuito";
  }

  const updated = await circuitService.update(body, circuitId);

  if (!updated) {
    setResponseStatus(event, 500);
    return "Erro ao editar o circuito.";
  }

  setResponseStatus(event, 200);
  return "Circuito editado com sucesso";
};
