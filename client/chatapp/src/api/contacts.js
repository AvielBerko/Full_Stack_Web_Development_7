import axios from "axios";
import routes from "../env.js";

export function getContacts(id, start, end) {
  return axios
    .get(routes.getContacts(id, start, end))
    .then((res) => res.data)
    // .then((data) => {
    //   if (!data.ok) {
    //     throw new Error(data.err);
    //   }
    //   return data.posts;
    // })
    .catch((err) => {
      if(err.response.data){
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}

export function updateContact(contact) {
  return axios
    .put(routes.updateContact(contact.id), contact)
    .then((res) => res.data)
    // .then((data) => {
    //   if (!data.ok) {
    //     throw new Error(data.err);
    //   }
    //   return data.data;
    // })
    .catch((err) => {
      if(err.response.data){
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}

export function deleteContact(contactID) {
  return axios
    .delete(routes.deleteContact(contactID))
    .then((res) => res.data)
    // .then((data) => {
    //   if (!data.ok) {
    //     throw new Error(data.err);
    //   }
    //   return data.data;
    // })
    .catch((err) => {
      if(err.response.data){
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}

export function addContact(contact) {
  return axios
    .post(routes.addContact, contact)
    .then((res) => res.data)
    // .then((data) => {
    //   if (!data.ok) {
    //     throw new Error(data.err);
    //   }
    //   return data.data;
    // })
    .catch((err) => {
      if(err.response.data){
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}