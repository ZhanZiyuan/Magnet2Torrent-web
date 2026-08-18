import { describe, expect, it } from "vitest";

import { normalizeMagnetInput, sanitizeTorrentName } from "./magnet";

describe("normalizeMagnetInput", () => {
  it("normalizes a bare hexadecimal info hash", () => {
    const hash = "A".repeat(40);
    const result = normalizeMagnetInput(hash);

    expect(result).toEqual({
      success: true,
      value: {
        infoHash: hash.toLowerCase(),
        magnet: `magnet:?xt=urn:btih:${hash.toLowerCase()}`,
      },
    });
  });

  it("accepts a base32 info hash", () => {
    expect(normalizeMagnetInput("B".repeat(32)).success).toBe(true);
  });

  it("preserves display names and trackers on a complete magnet URI", () => {
    const hash = "1".repeat(40);
    const magnet = `magnet:?xt=urn:btih:${hash}&dn=Example&tr=udp%3A%2F%2Ftracker.example%3A80`;
    const result = normalizeMagnetInput(magnet);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.magnet).toBe(magnet);
      expect(result.value.infoHash).toBe(hash);
    }
  });

  it("rejects malformed or unrelated input", () => {
    expect(normalizeMagnetInput("").success).toBe(false);
    expect(normalizeMagnetInput("https://example.com").success).toBe(false);
    expect(normalizeMagnetInput("magnet:?dn=MissingHash").success).toBe(false);
    expect(normalizeMagnetInput("not-a-hash").success).toBe(false);
  });
});

describe("sanitizeTorrentName", () => {
  it("removes unsafe filename characters and adds the extension", () => {
    expect(sanitizeTorrentName('A/B:C*D?E"F')).toBe("A-B-C-D-E-F.torrent");
  });
});
