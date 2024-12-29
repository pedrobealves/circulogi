import type { Circuit } from "~/simulation/types/circuit";
import { useCircuitStore } from "@/circuit/store/circuit";
import generate from "project-name-generator";

export function useCircuit() {
  const { setCircuits, removeCircuit, getCircuitById, updateCircuit } =
    useCircuitStore();

  async function fetchCircuits() {
    const { data, pending, error } = await useFetch("/api/v1/circuits", {
      headers: useRequestHeaders(["cookie"]),
    });

    setCircuits(data.value);

    if (error.value) {
      throw new Error(error.value.message || "Erro ao buscar os circuitos");
    }

    return { data: data.value, pending };
  }

  async function createCircuit(name: string) {
    try {
      // Executa a chamada manualmente com `$fetch`
      const response = await $fetch("/api/v1/circuits", {
        method: "POST",
        body: {
          name: name,
          version: "1.0.0",
        },
      });
      navigateTo(`/circuit/${response.id}`);
    } catch (error) {
      console.error("Erro ao criar circuito:", error);
    }
  }

  async function renameCircuit(circuitId: string, name: string) {
    try {
      await $fetch(`/api/v1/circuits/${circuitId}`, {
        method: "PUT",
        body: {
          name: name,
        },
      });

      const circuit = getCircuitById(circuitId);

      if (circuit) {
        circuit.name = name;
        updateCircuit(circuitId, circuit);
      }

      // Executa a chamada manualmente com `$fetch`
    } catch (error) {
      // Lida com erros, se necessário
      console.error("Erro ao criar circuito:", error);
    }
  }

  async function deleteCircuitById(circuitId: string) {
    removeCircuit(circuitId);
    try {
      await $fetch(`/api/v1/circuits/${circuitId}`, {
        method: "DELETE",
      });
      console.log("Circuito excluído com sucesso");
    } catch (error) {
      console.error("Erro ao excluir circuito:", error);
    }
  }

  return {
    fetchCircuits,
    createCircuit,
    renameCircuit,
    deleteCircuitById,
  };
}
