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

A responsive web application that converts Magnet links and BTIH Info Hashes into `.torrent` files.
It fetches metadata directly from the BitTorrent network and starts the download in the browser.

## Features

- **Flexible Input**: Accepts full magnet URIs, tracker-enabled magnet URIs, and hexadecimal or Base32 BTIH Info Hashes.
- **Responsive Layout**: Side-by-side conversion and history panels on wide screens, stacked panels on smaller screens.
- **Localized Interface**: English, Simplified Chinese, Traditional Chinese, and Japanese with browser-language detection.
- **Theme Support**: Light and dark themes that follow the device preference by default.
- **Clear Feedback**: Transient notifications for success, invalid input, conversion failure, and timeout states.
- **Server-Side Processing**: Uses `magnet2torrent-js` in a Node.js Route Handler to fetch BitTorrent metadata.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with React 19 and Turbopack
- **Language**: TypeScript 5
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [Shadcn/UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Core Logic**: [magnet2torrent-js](https://github.com/Tsuk1ko/magnet2torrent-js)

## Getting Started

### Prerequisites

- Node.js 20.9+ installed on your machine.
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

- Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Usage

1. Paste a valid magnet URI or BTIH Info Hash into the input field.
2. Select **Convert and download**.
3. The application attempts to fetch metadata for up to 30 seconds, depending on peer availability.
4. On success, the `.torrent` file downloads automatically and the conversion is added to local history.

## Similar Projects

- [magnet2torrent](https://github.com/Tsuk1ko/magnet2torrent-js)
- [Magnet2Torrent](https://github.com/danfolkes/Magnet2Torrent)
- [Magnet2Torrent](https://github.com/JohnDoee/magnet2torrent)

## License

This project is licensed under the GPLv3 License - see the [LICENSE](./LICENSE) file for details.
