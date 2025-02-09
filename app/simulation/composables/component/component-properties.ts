import { useComponentLoader } from "./component-loader";
import { useComponentValidation } from "./component-validation";
import { getComponentHandler } from "./component-handlers";

export function useComponentProperties() {
  const { getComponent } = useComponentLoader();

  async function getPropertyValue(componentType: string, propertyName: string) {
    const component = await getComponent(componentType);
    return component?.properties.find((p) => p.name === propertyName)?.default;
  }

  async function getProprieties(componentType: string) {
    const component = await getComponent(componentType);
    return component?.properties;
  }

  async function updateProperty(
    componentType: string,
    propertyName: string,
    value: any
  ) {
    const { validateProperty } = useComponentValidation();
    const component = await getComponent(componentType);

    if (!component) return false;

    const property = component.properties.find((p) => p.name === propertyName);
    if (!property) return false;

    if (!validateProperty(property, value)) return false;

    const handler = getComponentHandler(propertyName);
    if (!handler) {
      console.warn(`No handler found for component type: ${propertyName}`);
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
