import * as circuitApplication from "../applications/circuit";

const router = createRouter();

router.post("/circuits", defineEventHandler(circuitApplication.create));

router.get(
  "/test",
  defineEventHandler(() => {
    return { message: "Hello, World!" };
  })
);

export default useBase("/api/v1", router.handler);
