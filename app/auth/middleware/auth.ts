export default defineNuxtRouteMiddleware((from, to) => {
  const user = useSupabaseUser();
  const router = useRouter();

  if (user.value) {
    return router.push({ path: "/dashboard" });
  }
});
