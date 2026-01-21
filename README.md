<p align="center">
    <img alt="favicon" src="./src/app/icon.svg"
        width="138" />
</p>

# Magnet2Torrent-web

<p align="right">
    <b>English</b> | <a href="./README_zh.md">简体中文</a>
</p>

[![GitHub deployments](https://img.shields.io/github/deployments/ZhanZiyuan/Magnet2Torrent-web/Production)](https://github.com/ZhanZiyuan/Magnet2Torrent-web/deployments)
[![GitHub last commit](https://img.shields.io/github/last-commit/ZhanZiyuan/Magnet2Torrent-web)](https://github.com/ZhanZiyuan/Magnet2Torrent-web/commits/main/)
[![GitHub License](https://img.shields.io/github/license/ZhanZiyuan/Magnet2Torrent-web)](https://github.com/ZhanZiyuan/Magnet2Torrent-web/blob/main/LICENSE)
[![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/ZhanZiyuan/Magnet2Torrent-web/total)](https://github.com/ZhanZiyuan/Magnet2Torrent-web/releases)
[![Vercel Deploy](https://deploy-badge.vercel.app/vercel/magnet2torrent)](https://magnet2torrent.vercel.app/)

A simple, modern web application built with Next.js that converts Magnet links into `.torrent` files.
It fetches metadata from the BitTorrent network and generates a download file instantly.

## Features

- **Instant Conversion**: Paste a magnet link and get a `.torrent` file.
- **Auto-detection**: Automatically validates and processes the link upon pasting.
- **Modern UI**: Clean, responsive interface built with Shadcn/UI and Tailwind CSS.
- **Real-time Feedback**: Toast notifications for success and error states.
- **Server-Side Processing**: Utilizes `magnet2torrent-js` in a secure server action to handle DHT metadata fetching.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Shadcn/UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Core Logic**: [magnet2torrent-js](https://github.com/Tsuk1ko/magnet2torrent-js)

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine.
- npm package manager.

### Installation

- Clone the repository:

   ```bash
   git clone https://github.com/ZhanZiyuan/Magnet2Torrent-web.git
   cd Magnet2Torrent-web
   ```

- Install dependencies:

   ```bash
   npm install
   ```

### Running the Development Server

- Start the local development server:

   ```bash
   npm run dev
   ```

- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Copy a valid magnet link (starting with `magnet:?xt=urn:btih:`).
2. Paste it into the input field on the home page.
3. The application will automatically attempt to fetch the metadata (this may take up to 30 seconds depending on peer availability).
4. Upon success, the `.torrent` file will automatically download.

## Similar Projects

- [magnet2torrent](https://github.com/Tsuk1ko/magnet2torrent-js)
- [Magnet2Torrent](https://github.com/danfolkes/Magnet2Torrent)
- [Magnet2Torrent](https://github.com/JohnDoee/magnet2torrent)

## License

This project is licensed under the GPLv3 License - see the [LICENSE](./LICENSE) file for details.
