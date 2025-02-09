import { nanoid } from "nanoid";
import type { Node } from "~/simulation/types/node";
import { NodeType } from "~/simulation/types/nodeType";
import { NodeRole } from "~/simulation/types/nodeRole";

// Types and interfaces
interface NodeConfig {
  type: NodeType;
  role: NodeRole;
  size?: number;
  maxInputs?: number;
  maxOutputs?: number;
  inverted?: boolean;
  alias?: string;
}

interface NodeDefaults {
  size: number;
  maxInputs: number;
  maxOutputs: number;
  inverted: boolean;
  color: string;
  value: number;
  delay: number;
}

export function useNodeFactory() {
  // Default configuration for nodes
  const NODE_DEFAULTS: NodeDefaults = {
    size: 12,
    maxInputs: 1,
    maxOutputs: 1,
    inverted: false,
    color: "#363636",
    value: -1,
    delay: 0,
  } as const;

  /**
   * Creates a new node with the specified configuration
   * @param config - Configuration object for the node
   * @returns Node instance
   */
  function createNode(config: NodeConfig): Node {
    const {
      type,
      role,
      size = NODE_DEFAULTS.size,
      inverted = NODE_DEFAULTS.inverted,
    } = config;

    return {
      id: generateNodeId(),
      name: formatNodeName(type),
      type,
      role,
      inputs: [],
      outputs: [],
      delay: NODE_DEFAULTS.delay,
      value: NODE_DEFAULTS.value,
      size,
      color: NODE_DEFAULTS.color,
      configurations: {},
      inverted,
    };
  }

  /**
   * Generates a unique ID for the node
   */
  const generateNodeId = (): string => {
    return nanoid();
  };

  /**
   * Formats the node name based on its type
   */
  const formatNodeName = (type: NodeType): string => {
    return type.toLowerCase();
  };

  // Optional: Add validation functions if needed
  const validateNodeConfig = (config: NodeConfig): void => {
    if (config.maxInputs && config.maxInputs < 0) {
      throw new Error("maxInputs must be non-negative");
    }
    if (config.maxOutputs && config.maxOutputs < 0) {
      throw new Error("maxOutputs must be non-negative");
    }
    if (config.size && config.size <= 0) {
      throw new Error("size must be positive");
    }
  };

  /**
   * Creates a node with validation
   */
  function createValidatedNode(config: NodeConfig): Node {
    validateNodeConfig(config);
    return createNode(config);
  }

  return {
    createNode,
    createValidatedNode,
    // Expose defaults if needed
    NODE_DEFAULTS,
  };
}
