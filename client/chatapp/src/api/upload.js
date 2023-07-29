import axios from "axios";
import routes from "../env.js";

export function sendFile(file) {
  return axios
    .post(routes.sendFile, file)
    .then((res) => res.data)
    .catch((err) => {
      if (err.response.data) {
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}
