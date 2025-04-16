#!/usr/bin/env python
# -*- coding:utf-8 -*-

import sys
import time
import urllib.parse
from pathlib import Path

import libtorrent as lt
from flask import Flask, Response, make_response, render_template, request, send_file

app = Flask(__name__, static_folder="./static", template_folder="./templates")

UPLOAD_FOLDER = "/tmp"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
Path(app.config["UPLOAD_FOLDER"]).mkdir(parents=True, exist_ok=True)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024


def parse_magnet_link(magnet_link: str) -> tuple:
    """
    Parses a magnet link to extract the info hash and the file name.
    """
    parsed_url = urllib.parse.urlparse(magnet_link)
    query_params = urllib.parse.parse_qs(parsed_url.query)

    info_hash = query_params.get("xt", ["urn", "btih", ""])[0].split(":")[2]
    file_name = query_params.get("dn", [None])[0]

    if not file_name:
        file_name = info_hash[:10]
    file_name = urllib.parse.unquote(file_name)

    return info_hash, file_name


def magnet_to_torrent(
    magnet_link: str, saved_path: str = str(Path(__file__).parent), timeout: int = 60
) -> None:
    """
    Converts a magnet link to a torrent file by downloading metadata.
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
            print("Metadata download timed out!")
            sys.exit(1)

        sys.stdout.write(".")
        sys.stdout.flush()
        time.sleep(1)

    print("\nMetadata download complete")

    torrent_info = handle.torrent_file()

    if torrent_info is None:
        print("Unable to retrieve torrent information!")
        sys.exit(1)

    torrent = lt.create_torrent(torrent_info)

    torrent_filename = f"{parse_magnet_link(magnet_link)[1]}.torrent"

    with open(torrent_filename, "wb") as torrent_file:
        torrent_file.write(lt.bencode(torrent.generate()))

    print(f"Torrent file created: {torrent_filename}")


@app.route("/")
def index() -> str:
    """
    Renders the index page.
    """
    return render_template("index.html")


@app.route("/magnet-to-torrent", methods=["POST"])
def magnet_to_torrent_route() -> Response:
    """
    __doc__
    """
    magnet_link = request.form.get("magnet_link")

    if not magnet_link:
        return make_response("Magnet link is required", 400)

    magnet_to_torrent(magnet_link)

    torrent_filename = f"{parse_magnet_link(magnet_link)[1]}.torrent"
    torrent_filepath = Path(UPLOAD_FOLDER) / torrent_filename

    response = make_response(send_file(torrent_filepath, as_attachment=True))

    response.headers["Content-Disposition"] = f"attachment; filename={torrent_filename}"
    response.headers["Cache-Control"] = "no-store"

    return response


if __name__ == "__main__":

    app.run()
