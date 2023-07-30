import {get, add, remove, update} from "./axios_api.js"
import routes from "../env.js";

export function getContacts(options, token) {
  return get(routes.getContacts(options), token);
}

export function updateContact(contact, token) {
  return update(routes.updateContact(contact.id), contact, token);
}

export function deleteContact(contactID, token) {
  return remove(routes.deleteContact(contactID), token);
}

export function addContact(contact, token) {
  return add(routes.addContact, contact, token);
}