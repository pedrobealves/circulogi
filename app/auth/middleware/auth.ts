export default defineNuxtRouteMiddleware((from, to) => {
  const user = useSupabaseUser();

  if (user.value) {
    return navigateTo("/circuit");
  }
});
