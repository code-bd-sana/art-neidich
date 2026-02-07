import { v4 as uuidv4 } from "uuid";

export function getOrCreateDeviceId() {
  if (typeof window === "undefined") return "server-dummy";

  let id = localStorage.getItem("deviceId");

  if (!id) {
    id = uuidv4();
    localStorage.setItem("deviceId", id);
  }

  return id;
}
