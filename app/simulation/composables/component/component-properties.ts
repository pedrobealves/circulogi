// useComponentProperties.ts
import { useComponentLoader } from "./component-loader";
import { useComponentValidation } from "./component-validation";
import { getComponentHandler } from "./component-handlers";
import { type Component } from "./component-schema";

export function useComponentProperties() {
  const { getComponent } = useComponentLoader();

  async function getPropertyValue(componentType: string, propertyName: string) {
    const component: Component | null = await getComponent(componentType);
    return component?.properties.find((p) => p.name === propertyName)?.default;
  }

  async function getProprieties(componentType: string) {
    const component: Component | null = await getComponent(componentType);
    return component?.properties;
  }

  async function updateProperty(
    componentType: string,
    propertyName: string,
    value: any
  ) {
    const { validateProperty } = useComponentValidation();
    const component: Component | null = await getComponent(componentType);

    if (!component) return false;

    const property = component.properties.find((p) => p.name === propertyName);
    if (!property) return false;

    if (!validateProperty(property, value)) return false;

    const handler = getComponentHandler(propertyName);
    if (!handler) {
      console.warn(
        `Nenhum handler encontrado para a propriedade: ${propertyName}`
      );
      return false;
    }

    return handler.handleUpdate(value);
  }

  return {
    getProprieties,
    getPropertyValue,
    updateProperty,
  };
}
