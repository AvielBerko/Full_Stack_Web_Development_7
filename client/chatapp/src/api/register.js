import { add } from "./axios_api.js"
import routes from "../env.js";

export default function register(user)  {
  return add(routes.register, user);
  // return axios
  // .post(routes.register, user)
  // .then((response) => {
  //   if (response.status === 200) {
  //     return response.data;
  //   } else {
  //     return null;
  //   }
  // }).catch((err) => {
  //   if (err.response.data) {
  //     throw new Error(err.response.data.error);
  //   }
  //   throw new Error (err.message);
  // });
  // .then((data) => {
  //   if (!data.ok) {
  //     return data;
  //   }
  //   return {
  //     ok: true,
  //     user: data.user
  //     //user: { ...jwtDecode(data.token), token: data.token },
  //   };
  // });
}