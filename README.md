# Spotifyse landing preview

独立的 MotionSites 产品落地页试验，中文文案，真实媒体，夜行 / 漫游画面切换。它不替换原播放器，也不连接 Supabase。

直接打开 `index.html`，或在此目录运行：

```powershell
npm run dev
```

本地预览地址：`http://127.0.0.1:4175`。无需安装依赖。需要 Node.js 18 或更新版本。端口冲突时可设置 `PORT`。

- 首屏主视觉：真实地貌图像之间的一次渐变揭示；可暂停动效，遵循系统减少动态设置。
- 夜行 / 漫游只改变视觉，不播放音频。
- 主导航、手机菜单、能力展开项和 FAQ 可操作；所有 GitHub CTA 指向原项目。
- 文案只介绍源码中存在的曲库、标题搜索、收藏、上传和播放控制。真实登录、音频和上传未经本次浏览器验证。
- 已知原应用仍在迭代。本页没有注册、订阅、上传表单或虚构商业音乐库。

媒体和字体均在 `assets/`，预览不依赖远程脚本。第三方来源与完整许可见 `ASSET-LICENSES.md`、`MOTIONSITES-LICENSE.txt` 及字体 OFL 文件。

## GitHub Pages

这是纯静态页面，可使用 GitHub Pages，无需运行 Node 服务或连接 Supabase。

在本地准备发布文件：

```powershell
npm run build:pages
```

输出到 `_site/`，只包含页面、运行素材及许可。无需安装依赖。新增素材时需更新 `scripts/build-pages.cjs` 的发布文件列表。

准备使用独立仓库发布时：

1. 先确定目标仓库及可见性；不需要把本页放进播放器仓库。
2. 将本项目作为独立仓库提交到 `main` 分支。`.gitignore` 已排除本地验收记录、截图和生成目录。
3. 仓库 Settings → Pages → Build and deployment → Source 选择 **GitHub Actions**。
4. 在 Actions 手动运行 **Deploy Spotifyse landing to Pages**。之后 `main` 上页面、素材与部署配置的变更会自动部署。

工作流只上传 `_site/`，不会把整个工作目录公开。页面的图片、字体和内部链接使用相对路径，支持 `https://<owner>.github.io/<repository>/` 这样的项目子路径。

本页使用独立仓库，与播放器项目分开维护。GitHub Free 支持公开仓库的 Pages；私有仓库是否可用取决于账户计划。以 [GitHub 官方说明](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) 为准。
