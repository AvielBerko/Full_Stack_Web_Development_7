import axios from "axios";
import routes from "../env.js";

export default function register(user)  {
  return axios
  .post(routes.register, user)
  .then((response) => {
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  })
  .then((data) => {
    if (!data.ok) {
      return data;
    }
    return {
      ok: true,
      user: data.user
      //user: { ...jwtDecode(data.token), token: data.token },
    };
  });
}