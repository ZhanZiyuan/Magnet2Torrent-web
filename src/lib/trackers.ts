const ALLOWED_TRACKER_PROTOCOLS = new Set(["http:", "https:", "udp:"]);
const MAX_INPUT_TRACKERS = 20;

function isPrivateOrReservedIpv4(host: string) {
  const parts = host.split(".").map(Number);
  if (
    parts.length !== 4 ||
    parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)
  ) {
    return false;
  }

  const [first, second, third] = parts;
  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    (first === 100 && second >= 64 && second <= 127) ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 0 && third === 0) ||
    (first === 192 && second === 0 && third === 2) ||
    (first === 192 && second === 168) ||
    (first === 198 && (second === 18 || second === 19)) ||
    (first === 198 && second === 51 && third === 100) ||
    (first === 203 && second === 0 && third === 113) ||
    first >= 224
  );
}

function isPrivateTrackerHost(hostname: string) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");

  if (
    !host ||
    host === "localhost" ||
    !host.includes(".") ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host.includes(":")
  ) {
    return true;
  }

  return isPrivateOrReservedIpv4(host);
}

export function extractPublicTrackers(magnet: string) {
  try {
    const url = new URL(magnet);
    return url.searchParams
      .getAll("tr")
      .filter((tracker) => {
        try {
          const trackerUrl = new URL(tracker);
          return (
            ALLOWED_TRACKER_PROTOCOLS.has(trackerUrl.protocol) &&
            !trackerUrl.username &&
            !trackerUrl.password &&
            !isPrivateTrackerHost(trackerUrl.hostname)
          );
        } catch {
          return false;
        }
      })
      .slice(0, MAX_INPUT_TRACKERS);
  } catch {
    return [];
  }
}
