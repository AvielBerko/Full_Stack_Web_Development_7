import {get} from "./axios_api.js"
import routes from "../env.js";

export function getUsers() {
  return get(routes.getUsers);
  // return axios
  // .get(routes.getUsers)
  // .then((response) => {
  //   if (response.status === 200) {
  //     return response.data;
  //   } else {
  //     return null;
  //   }
  // });
}