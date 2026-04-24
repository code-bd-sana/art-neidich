const GENERIC_ERROR_MESSAGES = new Set([
  "something went wrong",
  "an error occurred",
  "request failed",
]);

function toCleanString(value) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function looksGeneric(message) {
  const normalized = toCleanString(message).toLowerCase().replace(/\.+$/, "");
  return GENERIC_ERROR_MESSAGES.has(normalized);
}

function pickFromErrorList(errors) {
  if (!Array.isArray(errors) || errors.length === 0) return "";

  for (const item of errors) {
    if (typeof item === "string") {
      const message = toCleanString(item);
      if (message) return message;
      continue;
    }

    if (item && typeof item === "object") {
      const message =
        toCleanString(item.message) ||
        toCleanString(item.msg) ||
        toCleanString(item.error);

      if (!message) continue;

      const field =
        toCleanString(item.field) ||
        toCleanString(item.path) ||
        toCleanString(item.param);

      return field ? `${field}: ${message}` : message;
    }
  }

  return "";
}

function extractMessageFromSource(source) {
  if (!source) return "";

  if (typeof source === "string") {
    return toCleanString(source);
  }

  if (typeof source !== "object") {
    return "";
  }

  const directKeys = ["message", "error", "detail", "title"];
  for (const key of directKeys) {
    const message = toCleanString(source[key]);
    if (message) return message;
  }

  const listMessage = pickFromErrorList(source.errors);
  if (listMessage) return listMessage;

  if (source.data && typeof source.data === "object") {
    const nestedDataMessage = extractMessageFromSource(source.data);
    if (nestedDataMessage) return nestedDataMessage;
  }

  if (source.response && typeof source.response === "object") {
    const nestedResponseMessage = extractMessageFromSource(source.response);
    if (nestedResponseMessage) return nestedResponseMessage;
  }

  return "";
}

export function statusFallbackMessage(statusCode) {
  if (statusCode === 401)
    return "Your session has expired. Please login again.";
  if (statusCode === 403)
    return "You do not have permission to perform this action.";
  if (statusCode === 404) return "The requested resource was not found.";
  if (statusCode === 422)
    return "Please review the highlighted fields and try again.";
  if (statusCode >= 500) return "Server error. Please try again in a moment.";
  return "Request failed. Please try again.";
}

export function extractErrorMessage(
  source,
  fallback = "Request failed. Please try again.",
) {
  const explicitMessage = extractMessageFromSource(source);
  if (explicitMessage && !looksGeneric(explicitMessage)) {
    return explicitMessage;
  }

  const statusCode =
    source?.status ||
    source?.code ||
    source?.response?.status ||
    source?.response?.code;

  const statusMessage = statusFallbackMessage(Number(statusCode));

  if (explicitMessage && statusMessage) {
    return `${explicitMessage} (${statusMessage})`;
  }

  return statusMessage || fallback;
}

export function extractErrorList(source) {
  const possibleLists = [
    source?.errors,
    source?.response?.errors,
    source?.data?.errors,
    source?.response?.data?.errors,
  ];

  for (const errors of possibleLists) {
    if (!Array.isArray(errors)) continue;

    const normalized = errors
      .map((item) => {
        if (typeof item === "string") {
          const message = toCleanString(item);
          return message ? { message } : null;
        }

        if (!item || typeof item !== "object") {
          return null;
        }

        const message =
          toCleanString(item.message) ||
          toCleanString(item.msg) ||
          toCleanString(item.error);

        if (!message) {
          return null;
        }

        const field =
          toCleanString(item.field) ||
          toCleanString(item.path) ||
          toCleanString(item.param);

        return field ? { field, message } : { message };
      })
      .filter(Boolean);

    if (normalized.length > 0) {
      return normalized;
    }
  }

  return [];
}

export function normalizeActionError(error, fallback, defaultCode = 500) {
  return {
    success: false,
    code: error?.status || error?.code || defaultCode,
    message: extractErrorMessage(error, fallback),
    errors: extractErrorList(error),
  };
}
