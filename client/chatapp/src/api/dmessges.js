import {get, add, remove, update} from "./axios_api.js"
import routes from "../env.js";

export function getMessages(options) {
  return get(routes.getMessages(options));
  // return axios
  //   .get(routes.getMessages(options))
  //   .then((res) => res.data)
  //   .catch((err) => {
  //     if (err.response.data) {
  //       throw new Error(err.response.data.error);
  //     }
  //     throw new Error(err.message);
  //   });
}

export function sendMessage(message) {
  return add(routes.sendMessage, message);
  // return axios
  //   .post(routes.sendMessage, message)
  //   .then((res) => res.data)
  //   .catch((err) => {
  //     if (err.response.data) {
  //       throw new Error(err.response.data.error);
  //     }
  //     throw new Error(err.message);
  //   });
}

export function deleteMessage(messageId) {
  return remove(routes.deleteMessage(messageId));
  // return axios
  //   .delete(routes.deleteMessage(messageId))
  //   .then((res) => res.data)
  //   .catch((err) => {
  //     if (err.response.data) {
  //       throw new Error(err.response.data.error);
  //     }
  //     throw new Error(err.message);
  //   });
}

export function updateMessage(message) {
  return update(routes.updateMessage(message.id), message);
  // return axios
  //   .put(routes.updateMessage(message.id), message)
  //   .then((res) => res.data)
  //   .catch((err) => {
  //     if (err.response.data) {
  //       throw new Error(err.response.data.error);
  //     }
  //     throw new Error(err.message);
  //   });
}
