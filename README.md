# 🎯 InterviewOJ — 大厂笔面试题库

> 2027 届暑期实习（2026 年进行）笔试真题 + 模拟题，在线 OJ 风格练习平台。

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.2-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev/)

---

## 📖 目录

- [项目简介](#-项目简介)
- [收录公司与题量](#-收录公司与题量)
- [项目结构](#-项目结构)
- [网站架构](#-网站架构)
- [快速开始](#-快速开始)
- [数据扩展指南](#-数据扩展指南)
- [技术栈](#-技术栈)
- [后续规划](#-后续规划)

---

## 🎯 项目简介

面向 **2027 届**（2026 年暑期实习）互联网大厂笔试面试的 **离线题库 + 在线练习平台**。

### 核心功能

- ✅ **选择题交互答题** — 逐题作答、实时判分、答案解析、成绩汇总
- 💻 **编程题浏览** — 分栏布局，左侧题目 / 示例，右侧深色代码编辑器
- 🏢 **多公司多场次** — 数据驱动，按「公司 → 场次 → 题目」三级组织
- 📊 **统计面板** — 首页展示公司数、场次数、选择题数、编程题数
- 🧭 **面包屑导航** — 动态路径追踪，随时回退
- 🌙 **黑夜模式** — 全站暗色主题切换，自动保存偏好
- 📝 **错题本** — 自动记录做错的题目，支持重做
- 📊 **做题记录** — 追踪做题进度、正确率统计
- ➕ **用户上传题目** — 支持自定义选择题/编程题，本地持久化

---

## 📋 收录公司与题量

| 公司 | 场次 | 选择题 | 编程题 | 来源 | 笔试日期 |
|------|------|--------|--------|------|----------|
| 🟡 美团 | 2 | 20 | 6 | ✅ 真题回忆 | 2026-03-07, 03-14 |
| 🔵 饿了么 | 1 | 5 | 3 | 📝 模拟题 | 约 2026-03 下旬 |
| 🐜 蚂蚁集团 | 1 | 5 | 2 | 📝 模拟题 | 约 2026-03 下旬 |
| 🟠 拼多多 | 1 | 4 | 3 | 📝 模拟题 | 约 2026-03 上旬 |
| 🎮 米哈游 | 1 | 5 | 3 | 📝 模拟题 | 约 2026-03 上旬 |
| **合计** | **6** | **39** | **17** | — | — |

> **说明**：美团两场笔试为用户提供的真题回忆，经核实。其余公司为基于 26 届（2025 年）真题风格整理的**模拟练习题**，题目内容仅供备考参考，不代表实际考题。

---

## 📁 项目结构

```
Interview/
├── README.md                     # 项目文档
├── EXPANSION_PLAN.md             # 上线拓展方案
├── index.html                    # 入口 HTML
├── package.json                  # 依赖与脚本
├── vite.config.ts                # Vite 构建配置（已配置外网访问）
├── tsconfig.json                 # TypeScript 配置（根）
├── tsconfig.app.json             # TypeScript 配置（应用）
├── tsconfig.node.json            # TypeScript 配置（Node）
├── eslint.config.js              # ESLint 配置
├── .gitignore
│
├── public/                       # 静态资源
│   ├── favicon.svg
│   └── icons.svg
│
└── src/                          # 源码
    ├── main.tsx                  # 应用入口（Provider 嵌套）
    ├── App.tsx                   # 路由定义（含新增路由）
    ├── index.css                 # TailwindCSS + 暗色模式变量
    │
    ├── contexts/                 # 🧠 全局状态管理
    │   ├── ThemeContext.tsx       #   主题切换（亮/暗）
    │   └── RecordContext.tsx      #   做题记录 + 用户题目
    │
    ├── components/               # 公共组件
    │   └── Layout.tsx            #   全局布局 (Header + 导航 + 暗色切换)
    │
    ├── data/                     # 📦 题目数据
    │   ├── types.ts              #   TypeScript 类型定义
    │   ├── questions.ts          #   数据注册中心 + 查询函数
    │   ├── meituan.ts            #   美团题库 (真题)
    │   ├── eleme.ts              #   饿了么题库 (模拟)
    │   ├── ant.ts                #   蚂蚁集团题库 (模拟)
    │   ├── pdd.ts                #   拼多多题库 (模拟)
    │   └── mihoyo.ts             #   米哈游题库 (模拟)
    │
    └── pages/                    # 📄 页面
        ├── HomePage.tsx          #   首页（含快捷入口）
        ├── CompanyPage.tsx       #   公司页
        ├── SessionPage.tsx       #   场次页
        ├── ChoicePage.tsx        #   选择题答题（集成记录）
        ├── CodingPage.tsx        #   编程题查看
        ├── WrongBookPage.tsx     #   📝 错题本
        ├── MyRecordsPage.tsx     #   📊 做题记录
        └── UploadPage.tsx        #   ➕ 上传题目
```

---

## 🏗️ 网站架构

### 路由

```
/                                          → 首页 (公司列表 + 快捷入口)
/company/:companyId                        → 公司详情 (场次列表)
/company/:companyId/:sessionId             → 场次详情 (题目总览)
/company/:companyId/:sessionId/choice      → 选择题交互答题
/company/:companyId/:sessionId/coding/:id  → 编程题查看
/wrong-book                                → 错题本
/my-records                                → 做题记录
/upload                                    → 上传题目
```

### 数据模型

```
CompanyData
├── id, name, logo, color, year, season
└── sessions: ExamSession[]
    ├── id, name, date, type
    └── questions: Question[]
        ├── ChoiceQuestion (content, choices, answer, note)
        └── CodingQuestion (content, examples, codeTemplate, difficulty, tags)
```

### 数据流

```
各公司数据模块 (meituan.ts, eleme.ts, ...)
          │
          ▼
    questions.ts  ← 数据注册中心
    ├── companies[]
    ├── getCompanyById()
    ├── getSessionById()
    └── getQuestionById()
          │
          ▼
    页面组件 (URL params → 查询数据 → 渲染)
```

---

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 浏览器访问 http://localhost:5173

# 生产构建
npm run build
npm run preview
```

---

## 🔧 数据扩展指南

只需 **两步** 即可添加新公司或新场次：

### 1. 创建数据文件

在 `src/data/` 下新建 `{company}.ts`：

```typescript
import type { ExamSession } from './types';

export const xxxTest1: ExamSession = {
  id: 'test1',
  name: '笔试第一场',
  date: '2026-03-XX',
  type: '笔试',
  questions: [
    // 选择题 (id: 1~10)
    { id: 1, type: 'choice', title: '...', content: '...', choices: [...], answer: 'B' },
    // 编程题 (id: 11+)
    { id: 11, type: 'coding', title: '...', content: '...', ... },
  ],
};
```

### 2. 注册到 questions.ts

```typescript
import { xxxTest1 } from './xxx';

// 添加到 companies 数组
{ id: 'xxx', name: '公司名', logo: '🏢', color: '#FF6600', year: 2027, season: '暑期实习', sessions: [xxxTest1] },
```

刷新页面即可。

---

## ⚡ 技术栈

| 技术 | 用途 |
|------|------|
| React 19 | UI 框架 |
| TypeScript 5.9 | 类型安全 |
| Vite 8 | 构建工具 |
| TailwindCSS 4 | 原子化样式 |
| React Router 7 | 客户端路由 |

---

## 🗺️ 后续规划

- [ ] 收集更多公司 27 届真题（字节、腾讯、网易、百度、阿里云等）
- [ ] 搜索功能 — 按关键字 / 标签 / 难度筛选
- [x] 做题记录 — LocalStorage 持久化做题进度
- [x] 深色模式
- [x] 错题本 — 自动记录做错的题目
- [x] 用户上传题目 — 自定义选择题/编程题
- [ ] 代码在线运行（Judge0 沙箱）
- [ ] 大模型代码评审
- [ ] 用户系统 + 云端数据同步

> 📋 详细拓展方案请查看 [EXPANSION_PLAN.md](./EXPANSION_PLAN.md)

---

## 📄 许可

本项目仅供个人学习和面试准备使用。题目版权归各公司所有。
