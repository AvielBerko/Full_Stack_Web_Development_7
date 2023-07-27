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

export function sendGroupMessage(groupID, message) {
  return axios
    .post(routes.sendGroupMessage(groupID), message)
    .then((res) => res.data)
    .catch((err) => {
      if (err.response.data) {
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}

export function deleteGroupMessage(groupID, messageId) {
  return axios
    .delete(routes.deleteGroupMessage(groupID, messageId))
    .then((res) => res.data)
    .catch((err) => {
      if (err.response.data) {
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}

export function updateGroupMessage(groupID, message) {
  console.log(message);
  return axios
    .put(routes.updateGroupMessage(groupID, message.id), message)
    .then((res) => res.data)
    .catch((err) => {
      if (err.response.data) {
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}
