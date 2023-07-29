import {get, add, remove, update} from "./axios_api.js"
import routes from "../env.js";

export function getGroupMessages(groupID) {
  return get(routes.getGroupMessages(groupID));
  // return axios
  //   .get(routes.getGroupMessages(groupID))
  //   .then((res) => res.data)
  //   .catch((err) => {
  //     if (err.response.data) {
  //       throw new Error(err.response.data.error);
  //     }
  //     throw new Error(err.message);
  //   });
}

export function sendGroupMessage(groupID, message) {
  return add(routes.sendGroupMessage(groupID), message);
  // return axios
  //   .post(routes.sendGroupMessage(groupID), message)
  //   .then((res) => res.data)
  //   .catch((err) => {
  //     if (err.response.data) {
  //       throw new Error(err.response.data.error);
  //     }
  //     throw new Error(err.message);
  //   });
}

export function deleteGroupMessage(groupID, messageId) {
  return remove(routes.deleteGroupMessage(groupID, messageId));
  // return axios
  //   .delete(routes.deleteGroupMessage(groupID, messageId))
  //   .then((res) => res.data)
  //   .catch((err) => {
  //     if (err.response.data) {
  //       throw new Error(err.response.data.error);
  //     }
  //     throw new Error(err.message);
  //   });
}

export function updateGroupMessage(groupID, message) {
  return update(routes.updateGroupMessage(groupID, message.id), message);
  // return axios
  //   .put(routes.updateGroupMessage(groupID, message.id), message)
  //   .then((res) => res.data)
  //   .catch((err) => {
  //     if (err.response.data) {
  //       throw new Error(err.response.data.error);
  //     }
  //     throw new Error(err.message);
  //   });
}
