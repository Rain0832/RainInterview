/**
 * 混合判题系统 — 策略模式实现
 *
 * 架构：
 *   用户提交代码
 *     ├──→ CompilerJudge (Docker 沙箱)  → AC/WA/TLE/MLE/RE
 *     │       ↓ (仅 AC 时触发)
 *     └──→ LLMReviewer (大模型 API)      → 代码质量评分 + 改进建议
 *
 * 设计模式：
 *   - 策略模式 (Strategy): JudgeStrategy 接口，CompilerJudge / LLMReviewer 各自实现
 *   - 管道模式 (Pipeline): 先编译判题 → 再 LLM 评审，串行执行
 *   - 工厂模式 (Factory): 根据语言选择 Docker 镜像和编译命令
 */

import { execSync, exec } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { v4 as uuid } from 'uuid'

// ==================== 类型定义 ====================

export interface TestCase {
  input: string
  expectedOutput: string
}

export interface JudgeResult {
  status: 'accepted' | 'wrong_answer' | 'time_limit' | 'memory_limit' | 'runtime_error' | 'compile_error' | 'system_error'
  testResults: TestCaseResult[]
  executionTimeMs: number
  memoryKb: number
  compileOutput?: string
}

export interface TestCaseResult {
  passed: boolean
  input: string
  expectedOutput: string
  actualOutput: string
  timeMs: number
}

export interface LLMReview {
  score: number           // 1-100
  correctness: number     // 1-10
  efficiency: number      // 1-10
  codeStyle: number       // 1-10
  edgeCases: number       // 1-10
  summary: string
  suggestions: string[]
}

export interface FullJudgeResult {
  judge: JudgeResult
  review?: LLMReview
}

// ==================== 语言配置工厂 ====================

interface LanguageConfig {
  extension: string
  compileCmd?: string       // undefined 表示解释型语言
  runCmd: string
  dockerImage: string
  timeoutSec: number
  memoryLimitMb: number
}

const LANGUAGE_CONFIGS: Record<string, LanguageConfig> = {
  cpp: {
    extension: '.cpp',
    compileCmd: 'g++ -O2 -std=c++17 -o solution solution.cpp',
    runCmd: './solution',
    dockerImage: 'gcc:14',
    timeoutSec: 5,
    memoryLimitMb: 256,
  },
  c: {
    extension: '.c',
    compileCmd: 'gcc -O2 -std=c11 -o solution solution.c -lm',
    runCmd: './solution',
    dockerImage: 'gcc:14',
    timeoutSec: 5,
    memoryLimitMb: 256,
  },
  python: {
    extension: '.py',
    runCmd: 'python3 solution.py',
    dockerImage: 'python:3.12-slim',
    timeoutSec: 10,
    memoryLimitMb: 256,
  },
  java: {
    extension: '.java',
    compileCmd: 'javac Solution.java',
    runCmd: 'java Solution',
    dockerImage: 'openjdk:21-slim',
    timeoutSec: 10,
    memoryLimitMb: 512,
  },
}

// ==================== 编译器判题策略 ====================

export class CompilerJudge {
  private dockerAvailable: boolean

  constructor() {
    try {
      execSync('docker info', { stdio: 'ignore' })
      this.dockerAvailable = true
    } catch {
      this.dockerAvailable = false
      console.warn('[CompilerJudge] Docker 不可用，将使用本地沙箱模式')
    }
  }

  async judge(code: string, language: string, testCases: TestCase[]): Promise<JudgeResult> {
    const config = LANGUAGE_CONFIGS[language]
    if (!config) {
      return { status: 'system_error', testResults: [], executionTimeMs: 0, memoryKb: 0, compileOutput: `不支持的语言: ${language}` }
    }

    if (testCases.length === 0) {
      return { status: 'system_error', testResults: [], executionTimeMs: 0, memoryKb: 0, compileOutput: '没有测试用例' }
    }

    const workDir = path.join(os.tmpdir(), `oj-${uuid()}`)
    fs.mkdirSync(workDir, { recursive: true })

    try {
      // 写入源代码
      const fileName = language === 'java' ? 'Solution' + config.extension : 'solution' + config.extension
      fs.writeFileSync(path.join(workDir, fileName), code)

      if (this.dockerAvailable) {
        return await this.judgeWithDocker(workDir, config, testCases)
      } else {
        return await this.judgeLocal(workDir, config, testCases, language)
      }
    } catch (err: any) {
      return { status: 'system_error', testResults: [], executionTimeMs: 0, memoryKb: 0, compileOutput: err.message }
    } finally {
      fs.rmSync(workDir, { recursive: true, force: true })
    }
  }

  private async judgeWithDocker(workDir: string, config: LanguageConfig, testCases: TestCase[]): Promise<JudgeResult> {
    const containerName = `oj-judge-${uuid().slice(0, 8)}`
    const memLimit = `${config.memoryLimitMb}m`

    try {
      // 编译阶段
      if (config.compileCmd) {
        try {
          execSync(
            `docker run --rm --name ${containerName}-compile ` +
            `--memory=${memLimit} --cpus=1 --network=none ` +
            `--pids-limit=64 ` +
            `-v ${workDir}:/work -w /work ` +
            `${config.dockerImage} sh -c "${config.compileCmd}" 2>&1`,
            { timeout: 30000 }
          )
        } catch (err: any) {
          return {
            status: 'compile_error',
            testResults: [],
            executionTimeMs: 0,
            memoryKb: 0,
            compileOutput: err.stdout?.toString() || err.stderr?.toString() || err.message
          }
        }
      }

      // 逐测试用例运行
      const testResults: TestCaseResult[] = []
      let totalTime = 0
      let maxMemory = 0
      let allPassed = true

      for (const tc of testCases) {
        const inputFile = path.join(workDir, 'input.txt')
        fs.writeFileSync(inputFile, tc.input)

        const startTime = Date.now()
        try {
          const output = execSync(
            `docker run --rm --name ${containerName}-run ` +
            `--memory=${memLimit} --cpus=1 --network=none ` +
            `--pids-limit=64 ` +
            `-v ${workDir}:/work -w /work ` +
            `${config.dockerImage} sh -c "${config.runCmd} < input.txt" 2>&1`,
            { timeout: config.timeoutSec * 1000 }
          ).toString().trim()

          const timeMs = Date.now() - startTime
          totalTime += timeMs

          const passed = output.trim() === tc.expectedOutput.trim()
          if (!passed) allPassed = false

          testResults.push({
            passed,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: output,
            timeMs,
          })
        } catch (err: any) {
          const timeMs = Date.now() - startTime
          totalTime += timeMs

          if (err.killed || timeMs >= config.timeoutSec * 1000) {
            testResults.push({ passed: false, input: tc.input, expectedOutput: tc.expectedOutput, actualOutput: '[超时]', timeMs })
            return { status: 'time_limit', testResults, executionTimeMs: totalTime, memoryKb: maxMemory }
          }

          testResults.push({ passed: false, input: tc.input, expectedOutput: tc.expectedOutput, actualOutput: err.message?.slice(0, 500) || '[运行错误]', timeMs })
          return { status: 'runtime_error', testResults, executionTimeMs: totalTime, memoryKb: maxMemory }
        }
      }

      return {
        status: allPassed ? 'accepted' : 'wrong_answer',
        testResults,
        executionTimeMs: totalTime,
        memoryKb: maxMemory,
      }
    } finally {
      // 清理可能残留的容器
      try {
        execSync(`docker rm -f ${containerName}-compile ${containerName}-run 2>/dev/null`, { stdio: 'ignore' })
      } catch { /* ignore */ }
    }
  }

  private async judgeLocal(workDir: string, config: LanguageConfig, testCases: TestCase[], language: string): Promise<JudgeResult> {
    // 本地沙箱模式（无 Docker 时的降级方案）：使用 timeout + ulimit
    if (config.compileCmd && (language === 'cpp' || language === 'c')) {
      try {
        execSync(config.compileCmd, { cwd: workDir, timeout: 30000, stdio: 'pipe' })
      } catch (err: any) {
        return {
          status: 'compile_error', testResults: [], executionTimeMs: 0, memoryKb: 0,
          compileOutput: err.stderr?.toString() || err.message
        }
      }
    }

    const testResults: TestCaseResult[] = []
    let totalTime = 0
    let allPassed = true

    for (const tc of testCases) {
      const inputFile = path.join(workDir, 'input.txt')
      fs.writeFileSync(inputFile, tc.input)

      const startTime = Date.now()
      try {
        const output = execSync(
          `timeout ${config.timeoutSec} sh -c '${config.runCmd} < input.txt'`,
          { cwd: workDir, timeout: (config.timeoutSec + 1) * 1000, stdio: 'pipe' }
        ).toString().trim()

        const timeMs = Date.now() - startTime
        totalTime += timeMs

        const passed = output.trim() === tc.expectedOutput.trim()
        if (!passed) allPassed = false

        testResults.push({ passed, input: tc.input, expectedOutput: tc.expectedOutput, actualOutput: output, timeMs })
      } catch (err: any) {
        const timeMs = Date.now() - startTime
        totalTime += timeMs

        if (err.killed || timeMs >= config.timeoutSec * 1000) {
          testResults.push({ passed: false, input: tc.input, expectedOutput: tc.expectedOutput, actualOutput: '[超时]', timeMs })
          return { status: 'time_limit', testResults, executionTimeMs: totalTime, memoryKb: 0 }
        }
        testResults.push({ passed: false, input: tc.input, expectedOutput: tc.expectedOutput, actualOutput: err.stderr?.toString()?.slice(0, 500) || '[运行错误]', timeMs })
        return { status: 'runtime_error', testResults, executionTimeMs: totalTime, memoryKb: 0 }
      }
    }

    return { status: allPassed ? 'accepted' : 'wrong_answer', testResults, executionTimeMs: totalTime, memoryKb: 0 }
  }
}

// ==================== LLM 代码评审策略 ====================

export class LLMReviewer {
  private apiUrl: string
  private apiKey: string
  private model: string

  constructor() {
    this.apiUrl = process.env.LLM_API_URL || 'https://api.openai.com/v1/chat/completions'
    this.apiKey = process.env.LLM_API_KEY || ''
    this.model = process.env.LLM_MODEL || 'gpt-4o-mini'
  }

  get isConfigured(): boolean {
    return !!this.apiKey
  }

  async review(code: string, problemDescription: string, language: string): Promise<LLMReview | null> {
    if (!this.apiKey) {
      return null
    }

    const prompt = `你是一位资深算法面试官和代码评审专家。请评审以下代码。

## 题目描述
${problemDescription}

## 用户代码 (${language})
\`\`\`${language}
${code}
\`\`\`

请以 JSON 格式返回评审结果（不要 markdown 代码块包裹）：
{
  "correctness": <1-10 正确性>,
  "efficiency": <1-10 时间/空间复杂度>,
  "codeStyle": <1-10 代码风格/可读性>,
  "edgeCases": <1-10 边界情况处理>,
  "score": <1-100 综合评分>,
  "summary": "<一句话总结>",
  "suggestions": ["<改进建议1>", "<改进建议2>", ...]
}`

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 1000,
        }),
      })

      if (!response.ok) {
        console.error('[LLMReviewer] API 请求失败:', response.status)
        return null
      }

      const data = await response.json() as any
      const content = data.choices?.[0]?.message?.content || ''

      // 尝试解析 JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as LLMReview
      }
      return null
    } catch (err) {
      console.error('[LLMReviewer] 评审失败:', err)
      return null
    }
  }
}

// ==================== 混合判题管道 ====================

export class HybridJudgePipeline {
  private compiler: CompilerJudge
  private reviewer: LLMReviewer

  constructor() {
    this.compiler = new CompilerJudge()
    this.reviewer = new LLMReviewer()
  }

  async execute(
    code: string,
    language: string,
    testCases: TestCase[],
    problemDescription: string
  ): Promise<FullJudgeResult> {
    // 第一步：编译器判题
    const judgeResult = await this.compiler.judge(code, language, testCases)

    // 第二步：仅在 AC 时触发 LLM 评审
    let review: LLMReview | undefined
    if (judgeResult.status === 'accepted' && this.reviewer.isConfigured) {
      const llmResult = await this.reviewer.review(code, problemDescription, language)
      if (llmResult) {
        review = llmResult
      }
    }

    return { judge: judgeResult, review }
  }
}
