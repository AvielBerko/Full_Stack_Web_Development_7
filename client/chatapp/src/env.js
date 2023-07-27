const PORT = 3000;
const DOMAIN = "http://127.0.0.1";
export const SERVER_URL = `${DOMAIN}:${PORT}`;


const routes = {
  login: `${SERVER_URL}/login`,
  register: `${SERVER_URL}/register`,
  getUser: (id) => `${SERVER_URL}/users/${id}`,
  getUsers: `${SERVER_URL}/users`,
  updateUser: (id) => `${SERVER_URL}/users/${id}`,
  getContacts: (id, start, end) =>
  start ? `${SERVER_URL}/contacts?saver_id=${id}?start=${start},end=${end}` : `${SERVER_URL}/contacts?saver_id=${id}`,
  addContact: `${SERVER_URL}/contacts`,
  updateContact: (contactID) => `${SERVER_URL}/contacts/${contactID}`,
  deleteContact: (contactID) => `${SERVER_URL}/contacts/${contactID}`,
  getGroupMessages: (options) =>
  options ? `${SERVER_URL}/gmessages?${new URLSearchParams(options).toString()}` : `${SERVER_URL}/gmessages/${id}`,
  sendGroupMessage: `${SERVER_URL}/gmessages`,
  deleteGroupMessage: (messageId) => `${SERVER_URL}/gmessages/${messageId}`,
  updateGroupMessage: (id) => `${SERVER_URL}/gmessages/${id}`,
  getGroups: (id, start, end) =>
  start ? `${SERVER_URL}/groups?user_id=${id}?start=${start},end=${end}` : `${SERVER_URL}/groups?user_id=${id}`,
  getAllGroups: `${SERVER_URL}/groups`,
  addGroup: `${SERVER_URL}/groups`,
  joinGroup: `${SERVER_URL}/gusers`,
  leaveGroup: (id) => `${SERVER_URL}/gusers/${id}`,
  updateGroup: (groupID) => `${SERVER_URL}/groups/${groupID}`,
  deleteGroup: (groupID) => `${SERVER_URL}/groups/${groupID}`,
};
export default routes;
export const axiosHeader = (jwt) => ({ headers: { Authorization: jwt } });
