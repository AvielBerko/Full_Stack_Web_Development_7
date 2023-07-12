import { SERVER_URL } from "../server_cfg.js";

export default function fetchAPI(path, method = "GET", body = {}) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (method !== "GET" && body !== {}) {
    options.body = JSON.stringify(body);
  }

  return fetch(`${SERVER_URL}/${path}`, options).then((res) => {
    if (res.ok) return res.json();
    else
      return res.json().then((res) => {
        throw Error(JSON.stringify(res));
      });
  });
}
