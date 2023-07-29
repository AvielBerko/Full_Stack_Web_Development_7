import { update } from "./axios_api.js"
import routes from "../env.js";

export function updateUser(newUser) {
  return update(routes.updateUser(newUser.id), newUser);
  // return axios
  //   .put(
  //     routes.updateUser(newUser.id),
  //     newUser /*{
  //       headers: { Authorization: user.token },
  //     }*/
  //   )
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
  //   });;
}
