import * as circuitApplication from "../applications/circuit";

const router = createRouter();

router.post("/circuits", defineEventHandler(circuitApplication.create));
router.get("/circuits", defineEventHandler(circuitApplication.getAllCircuits));
router.get("/circuits/:id", defineEventHandler(circuitApplication.getById));
router.put("/circuits/:id", defineEventHandler(circuitApplication.update));

export default useBase("/api/v1", router.handler);
