<script setup lang="ts">
import { AutoForm } from "@/common/components/ui/auto-form";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import LucideSpinner from "~icons/lucide/loader-2";
import type { ZodType, ZodTypeDef } from "zod";
import type { ZodObjectOrWrapped } from "~/common/components/ui/auto-form/utils";

const props = defineProps({
  schema: {
    type: Object as PropType<ZodObjectOrWrapped>,
    required: true,
  },
  onSubmit: {
    type: Function as PropType<(event: { [x: string]: any }) => any>,
    required: true,
  },
  fieldConfig: Object,
  submitButtonText: {
    type: String,
    default: "Submit",
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const form = useForm({
  validationSchema: toTypedSchema(props.schema),
});
</script>

<template>
  <AutoForm
    class="w-full space-y-2"
    :schema="props.schema"
    :form="form"
    @submit="props.onSubmit"
    :field-config="props.fieldConfig"
  >
    <div class="grid gap-1">
      <Button :disabled="props.isLoading" class="mt-4" type="submit">
        <LucideSpinner
          v-if="props.isLoading"
          class="mr-2 h-4 w-4 animate-spin"
        />
        {{ props.submitButtonText }}
      </Button>
    </div>
  </AutoForm>
</template>
