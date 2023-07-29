import {get, add, remove, update} from "./axios_api.js"
import routes from "../env.js";

export function getContacts(id, start, end) {
  return get(routes.getContacts(id, start, end));
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

export function updateContact(contact) {
  return update(routes.updateContact(contact.id), contact);
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

export function deleteContact(contactID) {
  return remove(routes.deleteContact(contactID));
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

export function addContact(contact) {
  return add(routes.addContact, contact);
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