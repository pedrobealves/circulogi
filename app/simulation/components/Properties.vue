<script setup lang="ts">
import { Separator } from "@/common/components/ui/separator";

import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/components/ui/select";
import { Textarea } from "@/common/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/common/components/ui/tooltip";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/common/components/ui/tabs";
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/common/components/ui/number-field";
import {
  Bird,
  Book,
  Bot,
  Code2,
  CornerDownLeft,
  LifeBuoy,
  Mic,
  Paperclip,
  Rabbit,
  Settings,
  Settings2,
  Share,
  SquareTerminal,
  SquareUser,
  Triangle,
  Turtle,
} from "lucide-vue-next";

import { useSimulationStore } from "~/simulation/stores/simulation";
import { showProperties } from "@/simulation/utils/is-component";
import { useComponentProperties } from "@/simulation/composables/component/component-properties";

const circuitStore = useSimulationStore();
const { getProprieties, updateProperty } = useComponentProperties();

const componentProperties = ref<any[]>([]);

watchEffect(async () => {
  if (circuitStore.selectedNodes?.type) {
    componentProperties.value = await getProprieties(
      circuitStore.selectedNodes.type
    );
  } else {
    componentProperties.value = [];
  }
});

const getDefaultValue = (field: string, default_field: string) => {
  if (circuitStore.selectedNodes) {
    return circuitStore.selectedNodes.configurations?.[field] ?? default_field;
  }
  return default_field;
};

const isComponentType = computed(() => {
  if (!circuitStore.selectedNodes) return false;
  return showProperties(circuitStore.selectedNodes);
});

const handlePropertyUpdate = (field: any, value: any) => {
  if (circuitStore.selectedNodes) {
    updateProperty(circuitStore.selectedNodes.type, field, value);
    circuitStore.save();
  }
};
</script>
<template>
  <div v-if="isComponentType" class="flex absolute z-[2] top-1/3 right-14">
    <div class="flex flex-col w-64 h-full bg-white rounded-2xl">
      <h1 class="text-xl font-semibold p-4 border-b">Propriedades</h1>
      <div class="grid w-full items-start gap-6 px-4 py-4">
        <fieldset class="grid gap-6 rounded-lg border p-4">
          <legend class="-ml-1 px-1 text-sm font-medium">Configurações</legend>
          <div class="grid gap-3">
            <template v-for="field in componentProperties" :key="field.id">
              <!-- Number input field -->
              <NumberField
                v-if="field.type === 'NUMBER'"
                :id="field.id"
                :default-value="getDefaultValue(field.name, field.default)"
                :min="field.min"
                :max="field.max"
                :step="field.step"
                class="flex flex-col gap-3"
                locale="pt-BR"
                @update:model-value="
                  (value) => handlePropertyUpdate(field.name, value)
                "
              >
                <Label :for="field.id">{{ field.label }}</Label>
                <NumberFieldContent>
                  <NumberFieldDecrement />
                  <NumberFieldInput />
                  <NumberFieldIncrement />
                </NumberFieldContent>
              </NumberField>

              <!-- Select input field -->
              <div v-if="field.type === 'SELECT'" class="flex flex-col gap-2">
                <Label :for="field.id">{{ field.label }}</Label>
                <Select
                  :default-value="field.default"
                  @update:model-value="
                    (value) => handlePropertyUpdate(field.name, value)
                  "
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="option in field.options"
                      :key="option"
                      :value="option"
                    >
                      {{ option }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </template>
          </div>
        </fieldset>
      </div>
    </div>
  </div>
</template>
