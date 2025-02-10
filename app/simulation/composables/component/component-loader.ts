import { componentSchema, type Component } from "./component-schema";

export function useComponentLoader() {
  // Importa todos os JSONs da pasta de componentes de forma eager.
  // Ajuste o caminho conforme a estrutura do seu projeto.
  const modules = import.meta.glob("../../../../content/components/*.json", {
    eager: true,
  }) as Record<string, any>;

  // Mapa para armazenar os componentes validados, indexados pelo seu 'type'
  const components: Record<string, Component> = {};

  for (const path in modules) {
    const mod = modules[path];
    // Dependendo da forma como o JSON é exportado, use 'default' ou o próprio módulo.
    const rawComponent = mod.default ?? mod;
    try {
      // Valida o objeto com o schema do Zod.
      const component = componentSchema.parse(rawComponent);
      components[component.type] = component;
    } catch (error) {
      console.error(`Erro ao validar o componente em ${path}:`, error);
      // Você pode optar por lançar o erro ou ignorar esse componente
    }
  }

  async function getComponent(
    componentType: string
  ): Promise<Component | null> {
    return components[componentType] || null;
  }

  return { getComponent };
}
