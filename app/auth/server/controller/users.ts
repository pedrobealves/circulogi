import { createRouter, defineEventHandler, useBase } from "h3";
import * as usersApplication from "../applications/users";

const router = createRouter();

router.delete("/:id", defineEventHandler(usersApplication.deleteUser));
router.put("/", defineEventHandler(usersApplication.update));

export default useBase("/api/v1/users", router.handler);
