import { get } from "./axios_api.js";
import routes from "../env.js";

export function getUsers(token) {
  return get(routes.getUsers, token);
}
