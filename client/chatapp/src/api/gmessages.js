import { get, add, remove, update } from "./axios_api.js";
import routes from "../env.js";

export function getGroupMessages(groupID, token) {
  return get(routes.getGroupMessages(groupID), token);
}

export function sendGroupMessage(groupID, message, token) {
  return add(routes.sendGroupMessage(groupID), message, token);
}

export function deleteGroupMessage(groupID, messageId, token) {
  return remove(routes.deleteGroupMessage(groupID, messageId), token);
}

export function updateGroupMessage(groupID, message, token) {
  return update(routes.updateGroupMessage(groupID, message.id), message, token);
}
