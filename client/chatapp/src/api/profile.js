import { update, axiosHeader } from "./axios_api.js"
import axios from "axios";
import routes from "../env.js";

export function updateUser(newUser, token) {
  //return update(routes.updateUser(newUser.id), newUser, token);
  return axios
    .put(
      routes.updateUser,
      newUser,
      axiosHeader(token)
    )
    .then((response) => {
        return response.data;
    })
    .then((token) => {
      return {...jwtDecode(token), token};
    })
    .catch((err) => {
      if (err.response.data.error) {
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });;
}
