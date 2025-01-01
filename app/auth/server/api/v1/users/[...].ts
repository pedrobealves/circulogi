import usersController from "../../../controller/users";

export default defineEventHandler(async (event) => {
  return usersController(event);
});
