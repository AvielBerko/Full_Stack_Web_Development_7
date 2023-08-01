import axios from "axios";
import routes from "../env.js";
import jwtDecode from "jwt-decode";

export default function login(username, password) {
  return axios
    .post(routes.login, { username, password })
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
