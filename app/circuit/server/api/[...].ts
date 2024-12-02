import * as circuitApplication from "../applications/circuit";

const router = createRouter();

router.post("/circuits", defineEventHandler(circuitApplication.create));
router.get("/circuits", defineEventHandler(circuitApplication.getAllCircuits));

export default useBase("/api/v1", router.handler);
