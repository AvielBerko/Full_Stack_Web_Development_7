import { add } from "./axios_api.js"
import routes from "../env.js";

export default function register(user)  {
  // return add(routes.register, user);
  return axios
  .post(routes.register, user)
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