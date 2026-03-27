import { Router } from 'express'
import db from '../models/database.js'
import { authMiddleware, type JwtPayload } from '../middleware/auth.js'
import { HybridJudgePipeline, type TestCase } from '../services/judge.js'

const router = Router()
const pipeline = new HybridJudgePipeline()

// ==================== 提交代码 ====================
router.post('/', authMiddleware, async (req, res) => {
  const { userId } = (req as any).user as JwtPayload
  const { companyId, sessionId, questionId, language, code, testCases, problemDescription } = req.body

  if (!code || !language) {
    res.status(400).json({ error: '代码和语言不能为空' })
    return
  }

  // 先记录提交
  const insertResult = db.prepare(`
    INSERT INTO submissions (user_id, company_id, session_id, question_id, language, code, status)
    VALUES (?, ?, ?, ?, ?, ?, 'running')
  `).run(userId, companyId || '', sessionId || '', questionId || 0, language, code)

  const submissionId = insertResult.lastInsertRowid

  // 如果提供了测试用例，执行判题
  const cases: TestCase[] = (testCases || []).map((tc: any) => ({
    input: tc.input,
    expectedOutput: tc.output || tc.expectedOutput,
  }))

  if (cases.length > 0) {
    try {
      const result = await pipeline.execute(code, language, cases, problemDescription || '')

      db.prepare(`
        UPDATE submissions
        SET status = ?, test_results = ?, execution_time_ms = ?, memory_kb = ?,
            llm_review = ?, llm_score = ?
        WHERE id = ?
      `).run(
        result.judge.status,
        JSON.stringify(result.judge.testResults),
        result.judge.executionTimeMs,
        result.judge.memoryKb,
        result.review ? JSON.stringify(result.review) : '',
        result.review?.score || null,
        submissionId
      )

      res.json({
        submissionId,
        status: result.judge.status,
        testResults: result.judge.testResults,
        executionTimeMs: result.judge.executionTimeMs,
        memoryKb: result.judge.memoryKb,
        compileOutput: result.judge.compileOutput,
        review: result.review || null,
      })
    } catch (err: any) {
      db.prepare('UPDATE submissions SET status = ? WHERE id = ?').run('system_error', submissionId)
      res.status(500).json({ error: '判题系统错误', detail: err.message })
    }
  } else {
    // 无测试用例时仅保存代码
    db.prepare('UPDATE submissions SET status = ? WHERE id = ?').run('accepted', submissionId)
    res.json({ submissionId, status: 'accepted', testResults: [], message: '代码已保存（无测试用例）' })
  }
})

// ==================== 获取提交历史 ====================
router.get('/', authMiddleware, (req, res) => {
  const { userId } = (req as any).user as JwtPayload
  const limit = Math.min(parseInt(req.query.limit as string) || 50, 100)
  const subs = db.prepare('SELECT * FROM submissions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?').all(userId, limit)
  res.json({ submissions: subs })
})

// ==================== 获取单次提交详情 ====================
router.get('/:id', authMiddleware, (req, res) => {
  const { userId } = (req as any).user as JwtPayload
  const sub = db.prepare('SELECT * FROM submissions WHERE id = ? AND user_id = ?').get(req.params.id, userId)
  if (!sub) {
    res.status(404).json({ error: '未找到该提交' })
    return
  }
  res.json({ submission: sub })
})

export default router
