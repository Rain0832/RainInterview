import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import db from '../models/database.js'
import { authMiddleware, optionalAuth, type JwtPayload } from '../middleware/auth.js'

const router = Router()

// ==================== 创建题目 ====================
router.post('/', authMiddleware, (req, res) => {
  const { userId } = (req as any).user as JwtPayload
  const { title, content, type, choices, answer, note, difficulty, tags, isPublic } = req.body

  if (!title || !content || !type) {
    res.status(400).json({ error: '标题、内容和类型不能为空' })
    return
  }

  const id = uuid()
  db.prepare(`
    INSERT INTO user_questions (id, user_id, title, content, type, choices, answer, note, difficulty, tags, is_public)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, userId, title, content, type,
    JSON.stringify(choices || []),
    answer || '', note || '',
    difficulty || 'Medium',
    JSON.stringify(tags || []),
    isPublic ? 1 : 0
  )

  res.json({ id, success: true })
})

// ==================== 获取我的题目 ====================
router.get('/mine', authMiddleware, (req, res) => {
  const { userId } = (req as any).user as JwtPayload
  const questions = db.prepare('SELECT * FROM user_questions WHERE user_id = ? ORDER BY created_at DESC').all(userId)
  res.json({ questions })
})

// ==================== 获取公开题目 ====================
router.get('/public', optionalAuth, (_req, res) => {
  const questions = db.prepare('SELECT uq.*, u.username FROM user_questions uq JOIN users u ON uq.user_id = u.id WHERE uq.is_public = 1 ORDER BY uq.created_at DESC LIMIT 100').all()
  res.json({ questions })
})

// ==================== 删除题目 ====================
router.delete('/:id', authMiddleware, (req, res) => {
  const { userId } = (req as any).user as JwtPayload
  const result = db.prepare('DELETE FROM user_questions WHERE id = ? AND user_id = ?').run(req.params.id, userId)
  if (result.changes === 0) {
    res.status(404).json({ error: '未找到该题目或无权删除' })
    return
  }
  res.json({ success: true })
})

export default router
