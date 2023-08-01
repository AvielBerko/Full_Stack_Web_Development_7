import { add } from "./axios_api.js";
import routes from "../env.js";

export function sendFile(file) {
  return add(routes.sendFile, file);
}
