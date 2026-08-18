const HEX_INFO_HASH = /^[a-fA-F0-9]{40}$/;
const BASE32_INFO_HASH = /^[a-zA-Z2-7]{32}$/;
const MAX_MAGNET_LENGTH = 16_384;

export type NormalizedMagnet = {
  infoHash: string;
  magnet: string;
};

export type MagnetValidationResult =
  | { success: true; value: NormalizedMagnet }
  | { success: false };

function isInfoHash(value: string) {
  return HEX_INFO_HASH.test(value) || BASE32_INFO_HASH.test(value);
}

export function normalizeMagnetInput(input: string): MagnetValidationResult {
  const value = input.trim();

  if (!value || value.length > MAX_MAGNET_LENGTH) {
    return { success: false };
  }

  if (isInfoHash(value)) {
    const infoHash = value.toLowerCase();
    return {
      success: true,
      value: {
        infoHash,
        magnet: `magnet:?xt=urn:btih:${infoHash}`,
      },
    };
  }

  if (!value.toLowerCase().startsWith("magnet:?")) {
    return { success: false };
  }

  try {
    const url = new URL(value);
    const exactTopic = url.searchParams
      .getAll("xt")
      .find((topic) => topic.toLowerCase().startsWith("urn:btih:"));
    const infoHash = exactTopic?.slice("urn:btih:".length).trim();

    if (!infoHash || !isInfoHash(infoHash)) {
      return { success: false };
    }

    return {
      success: true,
      value: {
        infoHash: infoHash.toLowerCase(),
        magnet: value,
      },
    };
  } catch {
    return { success: false };
  }
}

export function sanitizeTorrentName(name: string | undefined) {
  const sanitized = (name || "download")
    .normalize("NFKC")
    .replace(/[/\\?%*:|"<>]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

  const baseName = sanitized || "download";
  return baseName.toLowerCase().endsWith(".torrent") ? baseName : `${baseName}.torrent`;
}
