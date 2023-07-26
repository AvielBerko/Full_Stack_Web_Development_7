const PORT = 3000;
const DOMAIN = "http://127.0.0.1";
export const SERVER_URL = `${DOMAIN}:${PORT}`;


const routes = {
  login: `${SERVER_URL}/login`,
  getUser: (id) => `${SERVER_URL}/users/${id}`,
  getUsers: `${SERVER_URL}/users`,
  updateUser: (id) => `${SERVER_URL}/users/${id}`,
  getContacts: (id, start, end) =>
  start ? `${SERVER_URL}/contacts?saver_id=${id}?start=${start},end=${end}` : `${SERVER_URL}/contacts?saver_id=${id}`,
  addContact: `${SERVER_URL}/contacts`,
  updateContact: (contactID) => `${SERVER_URL}/contacts/${contactID}`,
  deleteContact: (contactID) => `${SERVER_URL}/contacts/${contactID}`,
  getMessages: (options) =>
  options ? `${SERVER_URL}/dmessages?${new URLSearchParams(options).toString()}` : `${SERVER_URL}/dmessages/${id}`,
  sendMessage: `${SERVER_URL}/dmessages`,
  deleteMessage: (messageId) => `${SERVER_URL}/dmessages/${messageId}`,
  updateMessage: (id) => `${SERVER_URL}/dmessages/${id}`,
};
export default routes;
export const axiosHeader = (jwt) => ({ headers: { Authorization: jwt } });
