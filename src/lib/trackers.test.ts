import { describe, expect, it } from "vitest";

import { extractPublicTrackers } from "./trackers";

function magnetWithTrackers(...trackers: string[]) {
  const params = new URLSearchParams({ xt: `urn:btih:${"a".repeat(40)}` });
  for (const tracker of trackers) params.append("tr", tracker);
  return `magnet:?${params}`;
}

describe("extractPublicTrackers", () => {
  it("keeps supported public tracker URLs", () => {
    const trackers = [
      "https://tracker.example.org/announce",
      "udp://tracker.example.net:6969/announce",
    ];

    expect(extractPublicTrackers(magnetWithTrackers(...trackers))).toEqual(trackers);
  });

  it("rejects local, private, credentialed, and unsupported trackers", () => {
    const magnet = magnetWithTrackers(
      "http://localhost:8080/announce",
      "http://127.0.0.1/announce",
      "http://192.168.1.5/announce",
      "http://metadata.internal/announce",
      "http://user:password@tracker.example.org/announce",
      "file:///tmp/announce",
    );

    expect(extractPublicTrackers(magnet)).toEqual([]);
  });

  it("limits the number of user-supplied trackers", () => {
    const trackers = Array.from(
      { length: 25 },
      (_, index) => `https://tracker-${index}.example.org/announce`,
    );

    expect(extractPublicTrackers(magnetWithTrackers(...trackers))).toHaveLength(20);
  });
});
