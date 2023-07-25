const PORT = 3000;
const DOMAIN = "http://127.0.0.1";
export const SERVER_URL = `${DOMAIN}:${PORT}`;


const routes = {
  login: `${SERVER_URL}/login`,
  updateUser: (id) => `${SERVER_URL}/users/${id}`,
  getTodos: `${SERVER_URL}/todos`,
  deleteTodo: `${SERVER_URL}/todos`,
  addTodo: `${SERVER_URL}/todos`,
  completeTodo: (id) => `${SERVER_URL}/todos/${id}/completed`,
  updateTodoTitle: (id) => `${SERVER_URL}/todos/${id}/title`,
  register: `${SERVER_URL}/register`,
  createPost: `${SERVER_URL}/posts`,
  getPosts: (start, end) =>
    start ? `${SERVER_URL}/posts/${start}/${end}` : `${SERVER_URL}/posts`,
  deletePost: (id) => `${SERVER_URL}/posts/${id}`,
  updatePost: `${SERVER_URL}/posts`,
  getComments: (postId, start, end) =>
    start != undefined
      ? `${SERVER_URL}/comments/${postId}/${start}/${end}`
      : `${SERVER_URL}/comments/${postId}`,
  /* Albums */
  createAlbum: `${SERVER_URL}/albums`,
  getAlbums: (start, end) =>
    `${SERVER_URL}/albums` + (start ? `/${start}` + (end ? `/${end}` : '') : ''),
  updateAlbum: `${SERVER_URL}/albums`,
  deleteAlbum: id => `${SERVER_URL}/albums/${id}`,
  /* Photos */
  createPhoto: `${SERVER_URL}/photos`,
  getPhotos: (albumId, start, end) =>
    `${SERVER_URL}/photos/${albumId}/${start}/${end}`,
  updatePhoto: `${SERVER_URL}/photos`,
  deletePhoto: id => `${SERVER_URL}/photos/${id}`,
  createComment: `${SERVER_URL}/comments`,
  deleteComment: (id) => `${SERVER_URL}/comments/${id}`,
  upadteComment: `${SERVER_URL}/comments`,
};
export default routes;
export const axiosHeader = (jwt) => ({ headers: { Authorization: jwt } });
