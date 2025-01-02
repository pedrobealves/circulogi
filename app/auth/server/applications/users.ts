import { H3Event } from "h3";
import authMiddleware from "@/circuit/server/utils/auth";
import {
  serverSupabaseClient,
  serverSupabaseServiceRole,
} from "#supabase/server";

type User = {
  username: string;
  email: string;
};

export const deleteUser = async (event: H3Event): Promise<string> => {
  await authMiddleware(event);

  const userId = getRouterParam(event, "id") || "";

  const user = event.context.user;

  console.log("userId", userId);

  if (userId !== user.id) {
    throw createError({
      status: 401,
      message: "Você não tem permissão para deletar este usuário",
      statusMessage: "Erro de permissão",
      data: {
        message: "Permissão negada",
      },
    });
  }

  const client = serverSupabaseServiceRole(event);

  const { data, error } = await client.auth.admin.deleteUser(userId);

  if (error) {
    throw createError({
      status: 400,
      message: "Erro ao deletar usuário",
      statusMessage: "Erro ao deletar usuário",
      data: {
        message: error.message,
      },
    });
  }

  console.log("data", data);

  return "Usuário deletado com sucesso";
};

export const update = async (event: H3Event): Promise<string> => {
  await authMiddleware(event);

  const body = await readBody<User>(event);

  console.log("body", body);

  const client = await serverSupabaseClient(event);

  const { data, error } = await client.auth.updateUser({
    data: {
      name: body.username,
    },
  });

  if (error) {
    throw createError({
      status: 400,
      message: "Erro ao editar usuário",
      statusMessage: "Erro ao editar usuário",
      data: {
        message: error.message,
      },
    });
  }

  return "Usuário editado com sucesso";
};
