import { SERVER_URL } from "../env.js";

export default async function fetchAPI(path, method = "GET", body = {}) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (method !== "GET" && body !== {}) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${SERVER_URL}/${path}`, options);
  if (res.ok) return res.json();
  else
    return res.json().then((data) => {
      throw Error(data.error);
    });
}
