"use server";

// This is a CommonJS module, so we need to use require.
const Magnet2torrent = require("magnet2torrent-js");

export async function generateTorrent(
    magnetLink: string
): Promise<{
    success: boolean;
    error?: string;
    data?: { name: string; file: string };
}> {
    if (!magnetLink || !magnetLink.startsWith("magnet:?xt=urn:btih:")) {
        return {
            success: false,
            error: "Invalid magnet link. Please check the format and try again.",
        };
    }
    
    try {
        const m2t = new Magnet2torrent({ timeout: 30 }); // 30 second timeout
        const torrent = await m2t.getTorrent(magnetLink);
        const buffer = torrent.toTorrentFile();
        const base64 = buffer.toString("base64");

        return {
            success: true,
            data: {
                name: torrent.name || "download",
                file: base64,
            },
        };
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : String(e);
        if (errorMessage.toLowerCase().includes("timed out")) {
             return {
                success: false,
                error: "Could not find torrent metadata. The link may be dead or have no active peers. Please try another.",
            };
        }
        return {
            success: false,
            error: "Failed to generate torrent. The server encountered an error.",
        };
    }
}
