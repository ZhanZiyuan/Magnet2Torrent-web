#!/usr/bin/env python
# -*- coding:utf-8 -*-
"""
Convert a magnet link to a .torrent file.
"""

import sys
import time
import urllib.parse
from pathlib import Path

import libtorrent as lt
from flask import (Flask, Response, make_response, render_template, request,
                   send_file)

app = Flask(
    __name__,
    static_folder="../static",
    template_folder="../templates"
)

UPLOAD_FOLDER = "/tmp"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
Path(app.config["UPLOAD_FOLDER"]).mkdir(parents=True, exist_ok=True)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024


def parse_magnet_link(magnet_link: str,
                      truncation: int = 10) -> tuple:
    """
    Parse the magnet link.
    """
    parsed_url = urllib.parse.urlparse(magnet_link)
    query_params = urllib.parse.parse_qs(parsed_url.query)

    info_hash = query_params.get("xt", ["urn", "btih", ""])[0].split(":")[2]
    display_name = query_params.get("dn", [None])[0]
    file_name = (
        display_name
        if display_name is not None
        else info_hash[:truncation]
    )

    return info_hash, urllib.parse.unquote(file_name)


def magnet_to_torrent(magnet_link: str,
                      saved_path: str = str(Path(__file__).parent),
                      timeout: int | float = 120,
                      truncation: int = 10) -> Path:
    """
    Convert a magnet link to a .torrent file.
    """
    ses = lt.session()

    params = lt.add_torrent_params()
    params.save_path = saved_path
    params.url = magnet_link
    params.flags |= lt.torrent_flags.upload_mode

    handle = ses.add_torrent(params)

    print("Downloading metadata...")

    start_time = time.time()
    while not handle.status().has_metadata:
        if time.time() - start_time > timeout:
            print("\nMetadata downloading timed out!")

        sys.stdout.write(".")
        sys.stdout.flush()
        time.sleep(1)

    print("\nMetadata downloading completed.")

    torrent_info = handle.torrent_file()

    if torrent_info is None:
        print("Unable to retrieve torrent information!")

    torrent = lt.create_torrent(torrent_info)
    torrent_file_path = (
        Path(saved_path) /
        f"{parse_magnet_link(magnet_link)[0][:truncation]}"
        ".torrent"
    )

    with open(torrent_file_path, "wb") as torrent_file:
        torrent_file.write(lt.bencode(torrent.generate()))

    print(f"Torrent file has been created: {torrent_file_path.name}")
    return torrent_file_path


@app.route("/")
def index() -> str:
    """
    __doc__
    """
    return render_template("index.html")


@app.route("/magnet-to-torrent", methods=["POST"])
def convert_magnet_to_torrent() -> Response:
    """
    __doc__
    """
    magnet_link = request.form.get("magnet_link")

    if not magnet_link:
        return make_response("A magnet link is required", 400)

    torrent_file = magnet_to_torrent(magnet_link, UPLOAD_FOLDER)
    download_path = Path(UPLOAD_FOLDER) / torrent_file.name

    response = make_response(send_file(download_path))
    response.headers["Content-Disposition"] = f"attachment; filename={download_path.name}"
    return response


if __name__ == "__main__":

    app.run()
