import {get, add, remove, update} from "./axios_api.js"
import routes from "../env.js";

export function getMessages(contactID, options, token) {
  return get(routes.getMessages(contactID, options), token);
}

export function sendMessage(contactID, message, token) {
  return add(routes.sendMessage(contactID), message, token);
}

export function deleteMessage(contactID, messageId, token) {
  return remove(routes.deleteMessage(contactID, messageId), token);
}

export function updateMessage(contactID, message, token) {
  return update(routes.updateMessage(contactID, message.id), message, token);
}
