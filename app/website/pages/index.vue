<script setup lang="ts">
const user = useSupabaseUser();

watchEffect(() => {
  if (user.value) {
    return navigateTo("/dashboard");
  }
});
</script>
<template>
  <div>
    <h1>Home</h1>
    <p>Welcome to the home page</p>
  </div>
</template>
