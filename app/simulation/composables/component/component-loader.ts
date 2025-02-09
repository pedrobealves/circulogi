import type { Component } from "@/simulation/types/component";

export function useComponentLoader() {
  async function getComponent(type: string): Promise<Component> {
    const component = await queryCollection("components")
      .where("type", "=", type)
      .first();
    return component;
  }

  async function getComponentsByCategory(
    category: string
  ): Promise<Component[]> {
    const components = await queryCollection("components")
      .where("category", "=", category)
      .all();
    return components;
  }

  async function getDefaultConfig(type: string) {
    const component = await getComponent(type);
    if (!component) return null;

    return component.properties.reduce((acc, prop) => {
      acc[prop.name] = prop.default;
      return acc;
    }, {} as Record<string, any>);
  }

  return {
    getComponent,
    getComponentsByCategory,
    getDefaultConfig,
  };
}
