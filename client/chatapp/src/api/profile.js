import axios from "axios";
import routes from "../env.js";

export function updateUser(newUser) {
  return axios
    .put(
      routes.updateUser,
      newUser /*{
        headers: { Authorization: user.token },
      }*/
    )
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      } else {
        return null;
      }
    });
}
