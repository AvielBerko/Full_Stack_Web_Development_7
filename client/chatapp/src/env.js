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
  updateContact: (id) => `${SERVER_URL}/contacts/${id}`,
  deleteContact: (id) => `${SERVER_URL}/contacts/${id}`,
  getMessages: (contactID, options) => `${SERVER_URL}/contacts/${contactID}/messages/?${new URLSearchParams(options).toString()}`,
  sendMessage: (contactID) => `${SERVER_URL}/contacts/${contactID}/messages`,
  deleteMessage: (contactID, messageID) => `${SERVER_URL}/contacts/${contactID}/messages/${messageID}`,
  updateMessage: (contactID, messageID) => `${SERVER_URL}/contacts/${contactID}/messages/${messageID}`,
  getGroupMessages: (id) => `${SERVER_URL}/groups/${id}/messages`,
  sendGroupMessage: (id) => `${SERVER_URL}/groups/${id}/messages`,
  deleteGroupMessage: (groupID, messageID) => `${SERVER_URL}/groups/${groupID}/messages/${messageID}`,
  updateGroupMessage: (groupID, messageID) => `${SERVER_URL}/groups/${groupID}/messages/${messageID}`,
  getGroups: (id, start, end) =>
  start ? `${SERVER_URL}/groups?user_id=${id}?start=${start},end=${end}` : `${SERVER_URL}/groups?user_id=${id}`,
  getAllGroups: `${SERVER_URL}/groups`,
  addGroup: `${SERVER_URL}/groups`,
  joinGroup: (id) => `${SERVER_URL}/groups/${id}/members`,
  leaveGroup: (groupID, userID) => `${SERVER_URL}/groups/${groupID}/members/${userID}`,
  updateGroup: (id) => `${SERVER_URL}/groups/${id}`,
  deleteGroup: (id) => `${SERVER_URL}/groups/${id}`,
  sendFile: `${SERVER_URL}/upload`
};
export default routes;
export const axiosHeader = (jwt) => ({ headers: { Authorization: jwt } });
