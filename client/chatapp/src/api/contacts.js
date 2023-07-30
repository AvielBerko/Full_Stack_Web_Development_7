import {get, add, remove, update} from "./axios_api.js"
import routes from "../env.js";

export function getContacts(id, options, token) {
  return get(routes.getContacts(id, options), token);
  // return axios
  //   .get(routes.getContacts(id, start, end))
  //   .then((res) => res.data)
  //   .catch((err) => {
  //     if(err.response.data){
  //       throw new Error(err.response.data.error);
  //     }
  //     throw new Error(err.message);
  //   });
}

export function updateContact(contact, token) {
  return update(routes.updateContact(contact.id), contact, token);
  // return axios
  //   .put(routes.updateContact(contact.id), contact)
  //   .then((res) => res.data)
  //   .catch((err) => {
  //     if(err.response.data){
  //       throw new Error(err.response.data.error);
  //     }
  //     throw new Error(err.message);
  //   });
}

export function deleteContact(contactID, token) {
  return remove(routes.deleteContact(contactID), token);
  // return axios
  //   .delete(routes.deleteContact(contactID))
  //   .then((res) => res.data)
  //   .catch((err) => {
  //     if(err.response.data){
  //       throw new Error(err.response.data.error);
  //     }
  //     throw new Error(err.message);
  //   });
}

export function addContact(contact, token) {
  return add(routes.addContact, contact, token);
  // return axios
  //   .post(routes.addContact, contact)
  //   .then((res) => res.data)
  //   .catch((err) => {
  //     if(err.response.data){
  //       throw new Error(err.response.data.error);
  //     }
  //     throw new Error(err.message);
  //   });
}