<script setup lang="ts">
import { Button } from "@/common/components/ui/button";

import { Separator } from "@/common/components/ui/separator";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/common/components/ui/alert-dialog";

async function deleteUser() {
  const user = useSupabaseUser();

  if (!user.value) return;

  try {
    await $fetch(`/api/v1/users/${user.value?.id}`, {
      method: "DELETE",
    });
    console.log("Usuário excluído com sucesso");
  } catch (error) {
    console.error("Erro ao excluir circuito:", error);
  }

  useSupabaseClient().auth.signOut();
  navigateTo("/login");
}
</script>

<template>
  <div>
    <h3 class="text-lg font-medium">Account</h3>
    <p class="text-sm text-muted-foreground">
      Update your account settings. Set your preferred language and timezone.
    </p>
  </div>
  <Separator />
  <div class="space-y-8">
    <AlertDialog>
      <div>
        <div
          class="space-y-2 flex flex-row items-center justify-between rounded-lg border p-4"
        >
          <div class="space-y-0.5 mr-4">
            <label
              for="radix-v-280-form-item"
              class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base"
            >
              Delete your account
            </label>
            <p
              id="radix-v-280-form-item-description"
              class="text-sm text-muted-foreground"
            >
              Deleting your account will permanently remove all your data and
              cannot be undone.
            </p>
          </div>
          <div>
            <AlertDialogTrigger
              ><Button variant="destructive">
                Delete Account
              </Button></AlertDialogTrigger
            >
          </div>
        </div>
      </div>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible. All your data, preferences, and account
            information will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" @click="deleteUser">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
