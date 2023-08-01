import { axiosHeader } from "./axios_api.js";
import axios from "axios";
import routes from "../env.js";
import jwtDecode from "jwt-decode";

export function updateUser(newUser, token) {
  return axios
    .put(routes.updateUser(newUser.id), newUser, axiosHeader(token))
    .then((response) => {
      return response.data;
    })
    .then((token) => {
      return { ...jwtDecode(token), token };
    })
    .catch((err) => {
      if (err.response.data.error) {
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}
