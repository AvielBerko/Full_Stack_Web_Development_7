import {get, add, remove, update} from "./axios_api.js"
import routes from "../env.js";

export function getAllGroups(token) {
  return get(routes.getAllGroups, token);
  // return axios
  //   .get(routes.getAllGroups)
  //   .then((res) => res.data)
  //   .catch((err) => {
  //     if(err.response.data){
  //       throw new Error(err.response.data.error);
  //     }
  //     throw new Error(err.message);
  //   });
}

export function getGroups(options, token) {
  return get(routes.getGroups(options), token);
  // return axios
  //   .get(routes.getGroups(id, start, end))
  //   .then((res) => res.data)
  //   .catch((err) => {
  //     if(err.response.data){
  //       throw new Error(err.response.data.error);
  //     }
  //     throw new Error(err.message);
  //   });
}

export function getGroupMembers(id, token) {
  return get(routes.getGroupMembers(id), token);
}

export function updateGroup(group, token) {
  return update(routes.updateGroup(group.id), group, token);
  // return axios
  //   .put(routes.updateGroup(group.id), group)
  //   .then((res) => res.data)
  //   .catch((err) => {
  //     if(err.response.data){
  //       throw new Error(err.response.data.error);
  //     }
  //     throw new Error(err.message);
  //   });
}

export function deleteGroup(groupID, token) {
  return remove(routes.deleteGroup(groupID), token);
  // return axios
  //   .delete(routes.deleteGroup(groupID))
  //   .then((res) => res.data)
  //   .catch((err) => {
  //     if(err.response.data){
  //       throw new Error(err.response.data.error);
  //     }
  //     throw new Error(err.message);
  //   });
}

export function joinGroup(groupID, data, token) {
  return add(routes.joinGroup(groupID), data, token);
  // return axios
  //   .post(routes.joinGroup(groupID), data)
  //   .then((res) => res.data)
  //   .catch((err) => {
  //     if(err.response.data){
  //       throw new Error(err.response.data.error);
  //     }
  //     throw new Error(err.message);
  //   });
}

export function leaveGroup(groupID, userID, token) {
  return remove(routes.leaveGroup(groupID, userID), token);
  // return axios
  //   .delete(routes.leaveGroup(groupID, userID))
  //   .then((res) => res.data)
  //   .catch((err) => {
  //     if(err.response.data){
  //       throw new Error(err.response.data.error);
  //     }
  //     throw new Error(err.message);
  //   });
}

export function addGroup(group, token) {
  return add(routes.addGroup, group, token);
  // return axios
  //   .post(routes.addGroup, group)
  //   .then((res) => res.data)
  //   .catch((err) => {
  //     if(err.response.data){
  //       throw new Error(err.response.data.error);
  //     }
  //     throw new Error(err.message);
  //   });
}