# TT Lobby Manager 部署指南

## 📋 部署前准备

你需要准备以下两个账号：
1. **GitHub 账号** - 用于托管网站和部署 GitHub Pages
2. **Cloudflare 账号** - 用于部署 Workers 代理（免费即可）

---

## 🚀 第一步：部署 Cloudflare Workers（核心功能）

这是实现"一键切换大厅"的核心部分。

### 1.1 创建 Cloudflare 账号

1. 打开 https://dash.cloudflare.com/sign-up
2. 使用邮箱注册一个账号（免费）

### 1.2 安装 Wrangler CLI

打开 **命令提示符** 或 **PowerShell**，执行以下命令：

```bash
npm install -g wrangler
```

### 1.3 登录 Cloudflare

```bash
wrangler login
```

执行后会自动打开浏览器，登录你的 Cloudflare 账号即可。

### 1.4 创建 Workers 项目

在命令行中输入：

```bash
wrangler init tt-lobby-manager
```

然后按提示选择：
- 输入项目名称：直接回车使用默认名
- 选择模板：选 `Hello World` 或 `Empty` 均可

### 1.5 修改 Worker 代码

1. 打开 `tt-lobby-manager/src/index.ts` 文件
2. 删除所有原有内容
3. 复制 `worker.js` 文件中的全部代码粘贴进去

### 1.6 部署 Worker

```bash
wrangler publish
```

部署成功后，会显示类似这样的输出：
```
Published tt-lobby-manager (0.1.0)
  https://tt-lobby-manager.your-name.workers.dev
```

**复制这个 URL！** 这就是你的 Worker 地址。

---

## 🌐 第二步：部署网站到 GitHub Pages

### 2.1 更新 Worker URL

打开 `src/App.tsx` 文件，找到第 4 行：

```typescript
const WORKER_URL = 'https://tt-lobby-manager.workers.dev';
```

将 `https://tt-lobby-manager.workers.dev` 替换为你刚才复制的 Worker URL。

### 2.2 创建 GitHub 仓库

1. 打开 https://github.com/new
2. 仓库名称：可以命名为 `tt_lobby` 或任意名称
3. 选择 **Public**（公开）
4. 点击 **Create repository**

### 2.3 上传代码到 GitHub

打开 **命令提示符**，进入项目目录：

```bash
cd c:\Users\fcy20\Documents\trae_projects\tt_lobby
```

然后执行以下命令（一步一步来）：

```bash
# 初始化 Git
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit"

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/仓库名.git

# 推送代码
git branch -M main
git push -u origin main
```

### 2.4 启用 GitHub Pages

1. 打开你的 GitHub 仓库页面
2. 点击 **Settings**（设置）
3. 点击左侧的 **Pages**
4. 在 **Source** 部分：
   - 选择 **GitHub Actions**
5. 保存设置

### 2.5 等待部署完成

每次推送代码后，GitHub Actions 会自动构建并部署。

查看部署状态：
- 点击仓库页面的 **Actions** 标签
- 如果看到绿色的 ✅，说明部署成功
- 部署成功后，页面会显示你的网站地址（通常是 `https://用户名.github.io/仓库名/`）

---

## ✅ 验证部署

### 测试网站
1. 打开你的 GitHub Pages 网站
2. 应该能看到 TT Lobby Manager 的界面
3. 点击各个大厅按钮，应该能打开游戏

### 测试大厅切换
1. 点击 **Lobby 0** 按钮
2. 游戏页面会打开，右上角显示浮动选择器
3. 点击 **Multiplayer** 进入游戏
4. 验证是否进入了 Lobby 0

---

## 📝 常见问题

### Q1: Wrangler 安装失败？
A: 确保你已经安装了 Node.js（版本 18+）。可以从 https://nodejs.org/ 下载安装。

### Q2: Git 推送失败？
A: 确保你已经在 GitHub 上创建了仓库，并且使用了正确的仓库地址。

### Q3: GitHub Pages 部署失败？
A: 检查 **Actions** 页面的错误信息，通常是因为缺少 `node_modules` 或构建失败。

### Q4: 游戏页面打不开？
A: 检查 Worker 是否部署成功，确认 WORKER_URL 配置正确。

### Q5: 进入游戏后显示封禁？
A: 这是正常的，不同大厅可能有不同的封禁状态。尝试切换到其他大厅。

---

## 📁 项目结构

```
tt_lobby/
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions 部署配置
├── src/
│   ├── types/
│   │   └── index.ts      # 类型定义
│   ├── App.tsx           # 主应用组件
│   ├── index.css         # 全局样式
│   └── main.tsx          # 入口文件
├── public/
│   └── tt-lobby-manager.user.js  # 用户脚本（备用）
├── worker.js             # Cloudflare Workers 代码
├── package.json          # 项目依赖
├── vite.config.ts        # Vite 配置
└── tailwind.config.js    # Tailwind CSS 配置
```

---

## 🎉 部署完成！

现在你的 TT Lobby Manager 已经上线了！用户可以：
1. 访问你的网站
2. 点击大厅按钮直接进入游戏
3. 使用右上角的浮动选择器切换大厅

无需安装任何插件，真正实现**点击即玩**！