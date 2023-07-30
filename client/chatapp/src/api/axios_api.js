import axios from "axios";

// TODO change error to check if it is an axios error or server error

export const axiosHeader = (jwt) => ({ headers: { Authorization: jwt } });

export function get(path, token) {
  return axios
    .get(path, axiosHeader(token))
    .then((res) => res.data)
    .catch((err) => {
      if (err.response.data.error) {
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}

export function add(path, data, token) {
  return axios
    .post(path, data, axiosHeader(token))
    .then((res) => res.data)
    .catch((err) => {
      if (err.response.data.error) {
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}

export function update(path, data, token) {
  return axios
    .put(path, data, axiosHeader(token))
    .then((res) => res.data)
    .catch((err) => {
      if (err.response.data.error) {
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}

export function remove(path, token) {
  return axios
    .delete(path, axiosHeader(token))
    .then((res) => res.data)
    .catch((err) => {
      if (err.response.data.error) {
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}
