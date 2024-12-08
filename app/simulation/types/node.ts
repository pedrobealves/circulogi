import * as vNG from "v-network-graph";

import { NodeType } from "./nodeType"; // Importando NodeType
import { NodeRole } from "./nodeRole"; // Importando NodeRole

export interface Node extends vNG.Node {
  size: number;
  color: string;
  label?: string;
  id: string;
  name: string;
  type: NodeType; // IN, AND, OR, OUT, etc.
  role: NodeRole; // INPUT, OUTPUT, etc.
  inputs: string[]; // IDs dos nós de entrada
  outputs: string[]; // IDs dos nós de saída
  maxInputs?: number; // Número máximo de entradas permitidas
  maxOutputs?: number; // Número máximo de saídas permitidas
  value: number | null;
  note?: string;
  delay?: number;
  inverted?: boolean;
}
