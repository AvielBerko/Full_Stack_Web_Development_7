import {get, add, remove, update} from "./axios_api.js"
import routes from "../env.js";

export function getMessages(contactID, options, token) {
  return get(routes.getMessages(contactID, options), token);
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

export function sendMessage(contactID, message, token) {
  return add(routes.sendMessage(contactID), message, token);
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

export function deleteMessage(contactID, messageId, token) {
  return remove(routes.deleteMessage(contactID, messageId), token);
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

export function updateMessage(contactID, message, token) {
  return update(routes.updateMessage(contactID, message.id), message, token);
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
