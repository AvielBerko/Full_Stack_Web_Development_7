import {get, add, remove, update} from "./axios_api.js"
import routes from "../env.js";

export function getAllGroups(token) {
  return get(routes.getAllGroups, token);
}

export function getGroups(options, token) {
  return get(routes.getGroups(options), token);
}

export function getGroupMembers(id, token) {
  return get(routes.getGroupMembers(id), token);
}

export function updateGroup(group, token) {
  return update(routes.updateGroup(group.id), group, token);
}

export function deleteGroup(groupID, token) {
  return remove(routes.deleteGroup(groupID), token);
}

export function joinGroup(groupID, data, token) {
  return add(routes.joinGroup(groupID), data, token);
}

export function leaveGroup(groupID, userID, token) {
  return remove(routes.leaveGroup(groupID, userID), token);
}

export function addGroup(group, token) {
  return add(routes.addGroup, group, token);
}