import type {
  Component,
  ComponentProperty,
} from "@/simulation/types/component";
import { useComponentLoader } from "./component-loader";

export function useComponentValidation() {
  const { getComponent } = useComponentLoader();

  function validateProperty(property: ComponentProperty, value: any): boolean {
    if (property.type === "NUMBER") {
      const numValue = Number(value);
      if (isNaN(numValue)) return false;
      if (property.min !== undefined && numValue < property.min) return false;
      if (property.max !== undefined && numValue > property.max) return false;
      return true;
    }

    if (property.type === "SELECT") {
      return property.options?.includes(value) ?? false;
    }

    return false;
  }

  async function validateConfig(
    type: string,
    config: Record<string, any>
  ): Promise<boolean> {
    const component = await getComponent(type);
    if (!component) return false;

    return component.properties.every((prop) => {
      const value = config[prop.name];
      return validateProperty(prop, value);
    });
  }

  return {
    validateProperty,
    validateConfig,
  };
}
