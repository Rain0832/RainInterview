# 🎯 InterviewOJ — 互联网求职中心

> 笔试 OJ + 面经题库 + 个人成长路线图

---

## 环境要求

| 工具 | 版本要求 | 检查命令 |
|------|---------|---------|
| **Node.js** | **≥ 20.6.0**（重要！） | `node -v` |
| **npm** | ≥ 10 | `npm -v` |
| **Git** | 任意 | `git --version` |
| **Python 3** | 任意（编译 better-sqlite3 需要） | `python3 --version` |
| **C++ 编译器** | g++ 或 MSVC（编译 better-sqlite3 需要） | `g++ --version` |

> ⚠️ **Node.js 版本必须 ≥ 20.6.0**。tsx 4.x 在旧版 Node 上会报
> `tsx must be loaded with --import instead of --loader` 然后静默退出。
> 请用 [nvm](https://github.com/nvm-sh/nvm) 升级：`nvm install 22 && nvm use 22`

### WSL2 / Linux 额外依赖

```bash
# Ubuntu/Debian（必须先装，否则 better-sqlite3 编译失败）
sudo apt update && sudo apt install -y python3 make g++ build-essential

# CentOS/Fedora
sudo yum groupinstall "Development Tools" && sudo yum install -y python3
```

### Windows（不使用 WSL）

```powershell
# 管理员 PowerShell
npm install --global windows-build-tools
```

---

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/Rain0832/RainInterview.git
cd RainInterview
```

### 2. 安装依赖

```bash
# 前端依赖（在项目根目录）
npm install

# 后端依赖（进入 server 目录）
cd server
npm install
cd ..
```

> ⚠️ 如果 `npm install` 在 server 目录报错 `better-sqlite3 failed to build`：
> ```bash
> # 步骤 1：安装编译工具
> sudo apt update && sudo apt install -y python3 make g++ build-essential
>
> # 步骤 2：清除缓存重装
> cd server
> rm -rf node_modules package-lock.json
> npm install
>
> # 步骤 3：如果还失败，强制重新编译
> npm rebuild better-sqlite3 --build-from-source
> ```

### 3. 启动服务

**需要两个终端同时运行**：

**终端 1 — 后端**：

```bash
cd server

# 推荐命令（兼容 Node 20.6+）
node --import tsx/esm src/index.ts

# 或者
npx tsx src/index.ts
```

**正确的启动输出**（必须能看到这些才算成功）：

```
📦 正在加载模块...
[CompilerJudge] Docker 不可用，将使用本地沙箱模式
✅ 所有模块加载完成
📂 静态文件: .../dist

  🚀 InterviewOJ Server 已启动:
     http://localhost:3000
     API: http://localhost:3000/api/health
```

**终端 2 — 前端开发服务器**：

```bash
# 在项目根目录
npm run dev
```

### 4. 访问

- **开发模式前端**：http://localhost:5173（带热更新）
- **API 健康检查**：http://localhost:3000/api/health
- **预置账号**：`2710007824@qq.com` / `2710007824@qq.com`

### 5. 生产模式（前后端一体，一个端口）

```bash
# 先构建前端
npm run build

# 再启动后端（会同时托管前端）
cd server
PORT=8080 node --import tsx/esm src/index.ts
# 访问 http://localhost:8080
```

---

## 常见问题排查

### ❌ `npx tsx src/index.ts` 只打一行就退出

**原因**：Node.js 版本太旧（< 20.6.0），tsx 加载方式不兼容。

**解决**：
```bash
# 检查版本
node -v  # 必须 >= 20.6.0

# 用 nvm 升级（推荐）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22
node -v  # 确认版本

# 重新安装依赖
cd server && npm install

# 启动
node --import tsx/esm src/index.ts
```

### ❌ `better-sqlite3` 编译失败 / node-gyp 报错

```bash
# WSL2 / Ubuntu
sudo apt update
sudo apt install -y python3 make g++ build-essential

cd server
rm -rf node_modules
npm install
```

### ❌ 端口被占用

```bash
# 查看占用
lsof -i :3000
# 或者换个端口
PORT=8080 node --import tsx/esm src/index.ts
```

### ❌ Git 自动同步报错（不影响使用）

Git 同步是可选功能。失败时会打印 `[GitSync] 同步失败(不影响使用):`，数据已保存在本地数据库，正常使用不受影响。

---

## 多设备数据同步

笔记、学习进度等数据存在 `server/data/interview.db`（已纳入 Git 管理）。

**手动同步**：
```bash
# 设备 A 推送
git add server/data/interview.db
git commit -m "sync: 更新数据"
git push

# 设备 B 拉取
git pull  # 重启后端即可看到最新数据
```

**自动同步**：登录后每次保存笔记/标记进度，5 秒内自动 git push。

---

## 项目结构

```
RainInterview/
├── src/                    前端 (React + Vite + TailwindCSS)
│   ├── features/exam/      笔试板块（选择题/编程题/判题）
│   ├── features/interview/ 面试题库（卡片刷题/状态标签/收藏）
│   ├── features/growth/    成长路线图（课程/笔记）
│   └── features/user/      用户（登录/个人中心/错题本）
│
├── server/                 后端 (Express 5 + SQLite)
│   ├── src/index.ts        入口
│   ├── src/models/         数据库（自动建表+种子数据）
│   ├── src/routes/         API (auth/records/growth/progress)
│   ├── src/utils/gitSync.ts Git 自动同步
│   └── data/interview.db   SQLite 数据库
│
└── dist/                   前端构建产物（npm run build 生成）
```

---

## 许可

本项目仅供个人学习和面试准备使用，题目版权归各公司所有。
