import axios from "axios";
import routes from "../env.js";

export function getAllGroups() {
  return axios
    .get(routes.getAllGroups)
    .then((res) => res.data)
    .catch((err) => {
      if(err.response.data){
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}

export function getGroups(id, start, end) {
  return axios
    .get(routes.getGroups(id, start, end))
    .then((res) => res.data)
    .catch((err) => {
      if(err.response.data){
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}

export function updateGroup(group) {
  return axios
    .put(routes.updateGroup(group.id), group)
    .then((res) => res.data)
    .catch((err) => {
      if(err.response.data){
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}

export function deleteGroup(groupID) {
  return axios
    .delete(routes.deleteGroup(groupID))
    .then((res) => res.data)
    .catch((err) => {
      if(err.response.data){
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}

export function joinGroup(groupID, data) {
  return axios
    .post(routes.joinGroup(groupID), data)
    .then((res) => res.data)
    .catch((err) => {
      if(err.response.data){
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}

export function leaveGroup(groupID, userID) {
  return axios
    .delete(routes.leaveGroup(groupID, userID))
    .then((res) => res.data)
    .catch((err) => {
      if(err.response.data){
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}

export function addGroup(group) {
  return axios
    .post(routes.addGroup, group)
    .then((res) => res.data)
    .catch((err) => {
      if(err.response.data){
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}