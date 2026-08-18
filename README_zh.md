<p align="center">
    <img alt="favicon" src="./src/app/icon.svg"
        width="138" />
</p>

# Magnet2Torrent-web

<p align="right">
    <a href="./README.md">English</a> | <b>简体中文</b>
</p>

[![GitHub deployments](https://img.shields.io/github/deployments/ZhanZiyuan/Magnet2Torrent-web/Production)](https://github.com/ZhanZiyuan/Magnet2Torrent-web/deployments)
[![GitHub last commit](https://img.shields.io/github/last-commit/ZhanZiyuan/Magnet2Torrent-web)](https://github.com/ZhanZiyuan/Magnet2Torrent-web/commits/main/)
[![GitHub License](https://img.shields.io/github/license/ZhanZiyuan/Magnet2Torrent-web)](https://github.com/ZhanZiyuan/Magnet2Torrent-web/blob/main/LICENSE)
[![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/ZhanZiyuan/Magnet2Torrent-web/total)](https://github.com/ZhanZiyuan/Magnet2Torrent-web/releases)
[![Vercel Deploy](https://deploy-badge.vercel.app/vercel/magnet2torrent)](https://magnet2torrent.vercel.app/)

这是一个响应式 Web 应用，可将磁力链接和 BTIH Info Hash 转换为 `.torrent` 种子文件。
它直接通过 BitTorrent 网络获取元数据，并在浏览器中开始下载。

## 功能特性

- **灵活输入**：支持完整磁力链接、带 Tracker 的磁力链接，以及十六进制或 Base32 BTIH Info Hash。
- **响应式布局**：宽屏使用转换与历史记录双栏布局，小屏自动切换为上下布局。
- **多语言界面**：支持 English、简体中文、繁体中文和日本语，并默认跟随浏览器语言。
- **主题模式**：支持浅色与深色主题，默认跟随设备设置。
- **清晰反馈**：转换成功、无效输入、转换失败和超时均提供短暂浮动通知。
- **服务端处理**：通过 Node.js Route Handler 调用 `magnet2torrent-js` 获取 BitTorrent 元数据。

## 技术栈

- **框架**：[Next.js 16](https://nextjs.org/)、React 19 与 Turbopack
- **语言**：TypeScript 5
- **样式**：[Tailwind CSS 4](https://tailwindcss.com/)
- **组件库**：[Shadcn/UI](https://ui.shadcn.com/)
- **图标**：[Lucide React](https://lucide.dev/)
- **核心逻辑**：[magnet2torrent-js](https://github.com/Tsuk1ko/magnet2torrent-js)

## 快速开始

### 先决条件

- 本地安装了 Node.js 20.9+。
- 拥有npm包管理器。

### 安装

- 克隆代码仓库：

   ```bash
   git clone https://github.com/ZhanZiyuan/Magnet2Torrent-web.git
   cd Magnet2Torrent-web
   ```

- 安装依赖：

   ```bash
   npm install
   ```

### 运行开发服务器

- 启动本地开发服务器：

   ```bash
   npm run dev
   ```

- 在浏览器中打开 [http://localhost:9002](http://localhost:9002) 查看效果。

## 使用指南

1. 将有效磁力链接或 BTIH Info Hash 粘贴到输入框。
2. 点击“转换并下载”。
3. 应用会尝试获取元数据，依据节点可用性最多等待 30 秒。
4. 成功后 `.torrent` 文件会自动下载，并将本次转换加入本地历史记录。

## 类似的项目

- [magnet2torrent](https://github.com/Tsuk1ko/magnet2torrent-js)
- [Magnet2Torrent](https://github.com/danfolkes/Magnet2Torrent)
- [Magnet2Torrent](https://github.com/JohnDoee/magnet2torrent)

## 开源许可

本项目基于 GPLv3 许可证 - 详情请参阅 [LICENSE](./LICENSE) 文件。
