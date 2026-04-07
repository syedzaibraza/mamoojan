export function getWordPressBaseUrl() {
  const wcUrl = process.env.WC_URL;
  if (!wcUrl) {
    throw new Error("Missing WC_URL environment variable.");
  }
  return wcUrl.replace(/\/$/, "");
}

export function getWooCredentials() {
  const wcKey = process.env.WC_KEY;
  const wcSecret = process.env.WC_SECRET;
  if (!wcKey || !wcSecret) {
    throw new Error("Missing WC_KEY or WC_SECRET environment variable.");
  }
  return { wcKey, wcSecret };
}

export function absoluteWpEndpoint(pathOrUrl: string) {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  return `${getWordPressBaseUrl()}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}
