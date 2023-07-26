import axios from "axios";
import routes from "../env.js";

export function getUsers() {
  return axios
  .get(routes.getUsers)
  .then((response) => {
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  });
}