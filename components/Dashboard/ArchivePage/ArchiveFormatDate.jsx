export function formatDate(dateString) {
  if (!dateString || dateString === "-") return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}
