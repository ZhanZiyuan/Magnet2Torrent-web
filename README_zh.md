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

这是一个使用Next.js构建的简单、现代化的Web应用程序，可以将磁力链接（Magnet links）转换为`.torrent`种子文件。
它通过BitTorrent网络获取元数据并即时生成下载文件。

## 功能特性

- **即时转换**：粘贴磁力链接即可获取`.torrent`文件。
- **自动检测**：粘贴链接后自动验证并处理。
- **现代化 UI**：使用Shadcn/UI和Tailwind CSS构建的整洁、响应式界面。
- **实时反馈**：提供成功和错误状态的Toast通知。
- **服务端处理**：使用安全的服务端Action调用`magnet2torrent-js`处理DHT元数据抓取。

## 技术栈

- **框架**：[Next.js 15](https://nextjs.org/) (App Router)
- **样式**：[Tailwind CSS](https://tailwindcss.com/)
- **组件库**：[Shadcn/UI](https://ui.shadcn.com/)
- **图标**：[Lucide React](https://lucide.dev/)
- **核心逻辑**：[magnet2torrent-js](https://github.com/Tsuk1ko/magnet2torrent-js)

## 快速开始

### 先决条件

- 本地安装了Node.js 18+。
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

- 在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看效果。

## 使用指南

1. 复制一个有效的磁力链接（以`magnet:?xt=urn:btih:`开头）。
2. 将其粘贴到主页的输入框中。
3. 应用程序将自动尝试获取元数据（根据节点可用性，这可能需要最多30秒）。
4. 成功后，`.torrent`文件将自动开始下载。

## 开源许可

本项目基于 GPLv3 许可证 - 详情请参阅 [LICENSE](./LICENSE) 文件。
