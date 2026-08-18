import Magnet2torrent from "magnet2torrent-js";

import { normalizeMagnetInput, sanitizeTorrentName } from "@/lib/magnet";
import { extractPublicTrackers } from "@/lib/trackers";

export const runtime = "nodejs";
export const maxDuration = 40;

const CONVERSION_TIMEOUT_SECONDS = 30;
const MAX_REQUEST_BYTES = 20_000;
const DEFAULT_TRACKERS = [
  "udp://zer0day.ch:1337/announce",
  "udp://tracker.publictracker.xyz:6969/announce",
  "udp://tracker.opentrackr.org:1337/announce",
  "udp://open.demonii.com:1337/announce",
  "udp://open.stealth.si:80/announce",
] as const;

type ConversionRequest = {
  magnet?: unknown;
};

function errorResponse(code: "invalid_input" | "timeout" | "conversion_failed", status: number) {
  return Response.json({ code }, { status });
}

function isTimeoutError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /timed?\s*out|timeout/i.test(message);
}

async function readRequestBody(request: Request) {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
    throw new Error("Request body is too large");
  }

  if (!request.body) throw new Error("Request body is missing");

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let body = "";
  let receivedBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    receivedBytes += value.byteLength;
    if (receivedBytes > MAX_REQUEST_BYTES) {
      await reader.cancel();
      throw new Error("Request body is too large");
    }
    body += decoder.decode(value, { stream: true });
  }

  body += decoder.decode();
  return JSON.parse(body) as ConversionRequest;
}

export async function POST(request: Request) {
  let body: ConversionRequest;

  try {
    body = await readRequestBody(request);
  } catch {
    return errorResponse("invalid_input", 400);
  }

  if (typeof body.magnet !== "string") {
    return errorResponse("invalid_input", 400);
  }

  const normalized = normalizeMagnetInput(body.magnet);
  if (!normalized.success) {
    return errorResponse("invalid_input", 400);
  }

  try {
    const inputTrackers = extractPublicTrackers(normalized.value.magnet);
    const trackers = [...new Set([...inputTrackers, ...DEFAULT_TRACKERS])];
    const converter = new Magnet2torrent({
      addTrackersToTorrent: true,
      trackers,
      timeout: CONVERSION_TIMEOUT_SECONDS,
    });
    const torrent = await converter.getTorrent(normalized.value.magnet);
    const torrentBuffer = torrent.toTorrentFile();
    const torrentName = (torrent as { name?: unknown }).name;
    const fileName = sanitizeTorrentName(typeof torrentName === "string" ? torrentName : undefined);
    const encodedFileName = encodeURIComponent(fileName);

    return new Response(new Uint8Array(torrentBuffer), {
      headers: {
        "Cache-Control": "no-store",
        "Content-Disposition": `attachment; filename="download.torrent"; filename*=UTF-8''${encodedFileName}`,
        "Content-Type": "application/x-bittorrent",
        "X-Info-Hash": normalized.value.infoHash,
        "X-Torrent-Name": encodedFileName,
      },
    });
  } catch (error) {
    if (isTimeoutError(error)) {
      return errorResponse("timeout", 504);
    }

    console.error(
      "Magnet metadata conversion failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return errorResponse("conversion_failed", 422);
  }
}
