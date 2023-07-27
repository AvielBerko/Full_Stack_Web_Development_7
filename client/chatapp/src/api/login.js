import { add } from "./axios_api.js"
import routes from "../env.js";

export default function login(username, password) {
  return add(routes.login, { username, password });
  // return axios
  //   .post(routes.login, { username, password })
  //   .then((response) => {
  //     if (response.status === 200) {
  //       return response.data;
  //     } else {
  //       return null;
  //     }
  //   })
  //   .catch((err) => {
  //     if (err.response.data) {
  //       throw new Error(err.response.data.error);
  //     }
  //     throw new Error(err.message);
  //   });
  // .then((data) => {
  //   return data.ok ? data : null; // data.jwt : null;
  // });
  // .then((token) => {
  //   return { ...jwtDecode(token), token };
  // });
}
