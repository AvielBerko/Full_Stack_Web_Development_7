import axios from "axios";
import routes from "../env.js";

export function getGroupMessages(groupID) {
  return axios
    .get(routes.getGroupMessages(groupID))
    .then((res) => res.data)
    .catch((err) => {
      if (err.response.data) {
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}

export function sendGroupMessage(message) {
  return axios
    .post(routes.sendMessage, message)
    .then((res) => res.data)
    .catch((err) => {
      if (err.response.data) {
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}

export function deleteGroupMessage(messageId) {
  return axios
    .delete(routes.deleteMessage(messageId))
    .then((res) => res.data)
    .catch((err) => {
      if (err.response.data) {
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}

export function updateGroupMessage(message) {
  return axios
    .put(routes.updateMessage(message.id), message)
    .then((res) => res.data)
    .catch((err) => {
      if (err.response.data) {
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}
