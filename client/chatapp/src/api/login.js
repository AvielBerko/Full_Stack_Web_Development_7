import axios from "axios";
import routes from "../env.js";

export default function login(username, password)  {
  return axios
  .post(routes.login, { username, password })
  .then((response) => {
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  })
  .then((data) => {
    return data.ok ? data : null; // data.jwt : null;
  });
  // .then((token) => {
  //   return { ...jwtDecode(token), token };
  // });
}