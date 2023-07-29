import axios from "axios";

// TODO change error to check if it is an axios error or server error

export function get(path) {
  return axios
    .get(path)
    .then((res) => res.data)
    .catch((err) => {
      if (err.response.data) {
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}

export function add(path, data) {
  return axios
    .post(path, data)
    .then((res) => res.data)
    .catch((err) => {
      if (err.response.data) {
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}

export function update(path, data) {
  return axios
    .put(path, data)
    .then((res) => res.data)
    .catch((err) => {
      if (err.response.data) {
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}

export function remove(path) {
  return axios
    .delete(path)
    .then((res) => res.data)
    .catch((err) => {
      if (err.response.data) {
        throw new Error(err.response.data.error);
      }
      throw new Error(err.message);
    });
}
