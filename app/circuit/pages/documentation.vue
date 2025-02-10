<script setup lang="ts">
/**
 * Define as meta-informações da página para que o Nuxt utilize o layout "main-layout".
 */
definePageMeta({
  layout: "main-layout",
});

// Importa os componentes de navegação e controle da interface
import { Breadcrumb, BreadcrumbList } from "@/common/components/ui/breadcrumb";
import { Separator } from "@/common/components/ui/separator";
import { SidebarTrigger } from "@/common/components/ui/sidebar";

/**
 * Dados simulados da biblioteca de componentes disponíveis no simulador.
 */
const components = [
  {
    id: 1,
    name: "Portas Lógicas Básicas",
    description: "AND, OR, NOT, NAND, NOR, XOR",
  },
  {
    id: 2,
    name: "Flip-flops e Registradores",
    description: "Componentes para circuitos sequenciais",
  },
  {
    id: 3,
    name: "Entradas/Saídas",
    description: "Componentes customizáveis de I/O",
  },
];
</script>

<template>
  <header
    class="flex px-8 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
  >
    <div class="flex items-center gap-2 px-4 w-full">
      <SidebarTrigger class="-ml-1" />
      <Separator orientation="vertical" class="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <slot name="breadcrumb"></slot>
        </BreadcrumbList>
      </Breadcrumb>
      <slot name="button"></slot>
    </div>
  </header>

  <div class="documentation">
    <header class="header">
      <h1>Interface do Circulogi</h1>
      <p class="subtitle">
        Guia completo da interface do simulador de circuitos digitais
      </p>
    </header>

    <img src="/img/sim-1.jpeg" class="w-full" />

    <div class="content">
      <section class="main-interface">
        <h2>Área Principal</h2>
        <p>
          A interface do Circulogi apresenta uma área de trabalho com um espaço
          em branco central onde os componentes do circuito podem ser livremente
          posicionados e conectados.
        </p>

        <div class="features-grid">
          <div class="feature-card">
            <h3>Menu de Ações (Esquerda)</h3>
            <ul>
              <li>
                <strong>Seleção (1):</strong> Permite selecionar e manipular
                componentes
              </li>
              <li>
                <strong>Exclusão (2):</strong> Remove componentes selecionados
                do circuito
              </li>
            </ul>
          </div>

          <div class="feature-card">
            <h3>Barra Superior</h3>
            <ul>
              <li>
                <strong>Nome do Circuito (3):</strong> Exibe e permite editar o
                nome do projeto
              </li>
              <li>
                <strong>Salvar (4):</strong> Botão para salvamento manual do
                circuito
              </li>
              <li>
                <strong>Exportar Imagem (5):</strong> Gera uma imagem do
                circuito para armazenamento local
              </li>
              <li>
                <strong>Compartilhar (6):</strong> Gera um link compartilhável
                do circuito
              </li>
            </ul>
          </div>

          <div class="feature-card">
            <h3>Menu Inferior</h3>
            <p>Componentes disponíveis organizados em três categorias:</p>
            <ul>
              <li><strong>Entrada/Saída (8):</strong> Componentes de I/O</li>
              <li>
                <strong>Componentes Lógicos (9):</strong> Portas e elementos
                lógicos
              </li>
              <li>
                <strong>Notas (10):</strong> Adiciona anotações ao circuito
              </li>
            </ul>
          </div>

          <div class="feature-card">
            <h3>Recursos Adicionais</h3>
            <ul>
              <li>
                <strong>Menu de Ajuda (7):</strong> Localizado no canto inferior
                direito, fornece suporte e documentação
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section class="usage">
        <h2>Utilizando a Interface</h2>

        <div class="usage-steps">
          <div class="step">
            <h3>Adicionando Componentes</h3>
            <ol>
              <li>
                Passe o mouse sobre o menu inferior para exibir as categorias
              </li>
              <li>
                Selecione a categoria desejada (E/S, Componentes ou Notas)
              </li>
              <li>Clique no componente desejado</li>
              <li>O componente será automaticamente adicionado ao circuito</li>
            </ol>
          </div>

          <div class="step">
            <h3>Gerenciando o Circuito</h3>
            <ul>
              <li>
                Use a ferramenta de seleção para mover e conectar componentes
              </li>
              <li>Utilize a ferramenta de exclusão para remover elementos</li>
              <li>
                Salve seu trabalho periodicamente usando o botão de salvamento
              </li>
              <li>Exporte como imagem quando necessário</li>
              <li>Compartilhe seu circuito através do link gerado</li>
            </ul>
          </div>
        </div>
      </section>
      <section class="states">
        <h2>Estados dos Componentes</h2>

        <div class="states-grid">
          <div class="state-card">
            <h3>Estado Ligado (ON)</h3>
            <div class="state-indicator on">
              <div class="circle"></div>
              <p>Verde indica sinal lógico 1 (HIGH)</p>
            </div>
            <ul>
              <li>Representa nível lógico alto (1)</li>
              <li>Indica passagem de corrente</li>
              <li>Conexões ativas são destacadas em verde</li>
            </ul>
          </div>

          <div class="state-card">
            <h3>Estado Desligado (OFF)</h3>
            <div class="state-indicator off">
              <div class="circle"></div>
              <p>Vermelho indica sinal lógico 0 (LOW)</p>
            </div>
            <ul>
              <li>Representa nível lógico baixo (0)</li>
              <li>Indica ausência de corrente</li>
              <li>Conexões inativas são destacadas em vermelho</li>
            </ul>
          </div>

          <div class="state-card info">
            <h3>Informações Adicionais</h3>
            <ul>
              <li>
                Os estados são atualizados em tempo real durante a simulação
              </li>
              <li>
                A visualização colorida facilita o acompanhamento do fluxo de
                sinais
              </li>
              <li>
                Útil para depuração e verificação do funcionamento do circuito
              </li>
              <li>
                As cores são consistentes em toda a interface para melhor
                compreensão
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.documentation {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, -apple-system, sans-serif;
  color: #1a1a1a;
  background-color: #ffffff;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e6e6e6;
}

h1 {
  font-size: 2.5rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.subtitle {
  color: #4d4d4d;
  font-size: 1.2rem;
}

h2 {
  font-size: 2rem;
  color: #1a1a1a;
  margin: 2rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e6e6e6;
}

h3 {
  font-size: 1.3rem;
  color: #333333;
  margin: 1rem 0;
  font-weight: 500;
}

.features-grid,
.states-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.feature-card,
.state-card {
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e6e6e6;
}

.usage-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 1.5rem 0;
}

.step {
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e6e6e6;
}

ul,
ol {
  padding-left: 1.5rem;
  margin: 1rem 0;
}

li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
  color: #333333;
  list-style: circle;
}

strong {
  color: #1a1a1a;
  font-weight: 600;
}

.state-indicator {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 6px;
  background: #ffffff;
}

.circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.on .circle {
  background-color: #4caf50; /* Verde */
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.5);
}

.off .circle {
  background-color: #f44336; /* Vermelho */
  box-shadow: 0 0 8px rgba(244, 67, 54, 0.5);
}

.state-indicator p {
  margin: 0;
  font-weight: 500;
  color: #333333;
}

.info {
  background: #f8f8f8;
}

/* Links */
a {
  color: #1a1a1a;
  text-decoration: underline;
  text-underline-offset: 2px;
}

a:hover {
  color: #4d4d4d;
}

/* Code blocks */
pre,
code {
  background: #f8f8f8;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  padding: 0.2em 0.4em;
  font-family: "Menlo", "Monaco", "Courier New", monospace;
}

pre {
  padding: 1rem;
  overflow-x: auto;
}

/* Tables */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

th,
td {
  padding: 0.75rem;
  border: 1px solid #e6e6e6;
  text-align: left;
}

th {
  background: #f5f5f5;
  font-weight: 600;
}

/* Form elements */
input,
select,
textarea {
  padding: 0.5rem;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  background: #ffffff;
  color: #1a1a1a;
}

button {
  padding: 0.5rem 1rem;
  background: #1a1a1a;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #333333;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .documentation {
    padding: 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.75rem;
  }

  .features-grid,
  .usage-steps,
  .states-grid {
    grid-template-columns: 1fr;
  }

  .state-indicator {
    flex-direction: column;
    text-align: center;
  }
}

/* Print styles */
@media print {
  .documentation {
    max-width: none;
    padding: 0;
  }

  .feature-card,
  .state-card,
  .step {
    break-inside: avoid;
    box-shadow: none;
  }
}
</style>
