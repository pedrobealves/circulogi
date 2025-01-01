import circuitsController from "../../../controller/circuits";

export default defineEventHandler(async (event) => {
  return circuitsController(event);
});
