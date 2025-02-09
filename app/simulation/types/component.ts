export type ComponentType = "NUMBER" | "SELECT" | "TEXT";
export type ComponentCategory = "GATE" | "MEMORY" | "IO" | "TIMING";

export interface ComponentProperty {
  name: string;
  type: ComponentType;
  label: string;
  default: number | string;
  min?: number;
  max?: number;
  options?: string[];
}

export interface Component {
  type: string;
  category: ComponentCategory;
  description: string;
  properties: ComponentProperty[];
  maxInputs?: number;
  maxOutputs?: number;
}
