# AI 小报（AI_NEWS）

实时获取 AI 资讯的微信小程序，基于 [Taro](https://taro-docs.jd.com/) + React + TypeScript 构建。

## 功能概览

| 模块 | 说明 |
|------|------|
| 今日 | 当日 AI 资讯列表与摘要，支持下拉刷新、收藏 |
| 日报 | 按栏目浏览最新资讯 |
| 收藏 | 已收藏文章列表 |
| 我的 | 微信登录、阅读/收藏统计 |
| 资讯详情 | 正文阅读、标记已读、收藏 |

## 技术栈

- **框架**：Taro 4、React 18
- **语言**：TypeScript
- **样式**：Sass
- **构建**：Vite
- **目标平台**：微信小程序（亦可构建 H5 等，见下方脚本）

## 环境要求

- Node.js（建议使用 LTS，与 `package.json` 中 `browserslist` 维护版本一致）
- npm 或兼容的包管理器
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)（调试小程序）

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置接口地址

通过环境变量 `TARO_APP_API_BASE_URL` 指定后端 API 根地址，各环境文件如下：

| 文件 | 用途 |
|------|------|
| `.env.development` | 本地开发 |
| `.env.production` | 生产构建 |
| `.env.test` | 测试构建 |

示例（开发环境默认指向本地后端）：

```env
TARO_APP_API_BASE_URL="http://127.0.0.1:3001"
```

未配置时，请求会回退到 `https://api.hdajun.me`（见 `src/api/request.ts`）。

### 3. 启动开发编译

```bash
npm run dev:weapp
```

编译产物输出到 `dist/` 目录。

### 4. 用微信开发者工具打开

1. 打开微信开发者工具，选择「导入项目」
2. 项目目录选择本仓库根目录（`project.config.json` 中 `miniprogramRoot` 已指向 `./dist`）
3. 将 `project.config.json` 里的 `appid` 改为你的小程序 AppID（当前为 `touristappid`，仅适合游客模式体验）
4. 在开发者工具中勾选「不校验合法域名」等选项（本地 API 调试时常用）

修改代码后，保持 `dev:weapp` 运行即可热更新编译。

## 常用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev:weapp` | 微信小程序开发模式（watch） |
| `npm run build:weapp` | 微信小程序生产构建 |
| `npm run dev:h5` | H5 开发模式 |
| `npm run build:h5` | H5 生产构建 |

其他平台（支付宝、百度、抖音等）可使用 `package.json` 中对应的 `dev:*` / `build:*` 脚本。

## 项目结构

```
AI_NEWS/
├── config/              # Taro 构建配置（dev / prod）
├── src/
│   ├── api/             # 接口封装（news、auth、request）
│   ├── assets/          # 静态资源（UED 切图等）
│   ├── components/      # 通用组件（NewsCard、EmptyState 等）
│   ├── pages/           # 页面
│   │   ├── today/       # 今日
│   │   ├── daily/       # 日报
│   │   ├── favorites/   # 收藏
│   │   ├── me/          # 我的
│   │   └── news-detail/ # 资讯详情
│   ├── store/           # 本地状态（用户、收藏、已读）
│   ├── types/           # TypeScript 类型定义
│   ├── tabbar/          # 底部导航图标（构建时复制到 dist）
│   ├── app.config.ts    # 小程序全局配置
│   └── app.tsx          # 应用入口
├── dist/                # 编译输出（勿手动改，由构建生成）
├── project.config.json  # 微信开发者工具项目配置
└── package.json
```

## 后端接口说明

小程序通过 `src/api/request.ts` 统一发起请求，主要接口包括：

- `GET /api/news/today` — 今日资讯
- `GET /api/news/latest` — 最新资讯列表
- `GET /api/news/daily/latest` — 最新日报
- `POST /api/news/:id/read` — 标记已读
- `POST /api/news/:id/favorite` / `DELETE` — 收藏 / 取消收藏
- `POST /api/auth/wechat-login` — 微信登录

需自行部署或启动配套后端服务，并保证小程序请求域名已在微信公众平台配置为合法域名。

## 代码规范

仓库已配置 Husky、lint-staged 与 Commitlint（Conventional Commits）。提交前会自动执行相关检查。

## 相关文档

- [Taro 文档](https://taro-docs.jd.com/)
- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
