export function getOrCreateDeviceId() {
  if (typeof window === "undefined") return "server-dummy";
  let id = localStorage.getItem("deviceId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("deviceId", id);
  }
  return id;
}
