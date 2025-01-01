import * as circuitApplication from "../applications/circuit";

const router = createRouter();

router.post("/", defineEventHandler(circuitApplication.create));
router.get("/", defineEventHandler(circuitApplication.getAllCircuits));
router.get("/:id", defineEventHandler(circuitApplication.getById));
router.put("/:id", defineEventHandler(circuitApplication.update));
router.delete("/:id", defineEventHandler(circuitApplication.deleteCircuit));
router.post("/image", defineEventHandler(circuitApplication.uploadImage));

export default useBase("/api/v1/circuits", router.handler);
