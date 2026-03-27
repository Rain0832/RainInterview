import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { v4 as uuid } from 'uuid'
import db from '../models/database.js'
import { signToken, authMiddleware, type JwtPayload } from '../middleware/auth.js'

const router = Router()

// ==================== 注册 ====================
router.post('/register', (req, res) => {
  const { username, email, password } = req.body
  if (!username || !email || !password) {
    res.status(400).json({ error: '用户名、邮箱和密码不能为空' })
    return
  }
  if (password.length < 6) {
    res.status(400).json({ error: '密码至少 6 位' })
    return
  }
  if (!/^[a-zA-Z0-9_]{2,20}$/.test(username)) {
    res.status(400).json({ error: '用户名只能包含字母、数字、下划线，2-20 位' })
    return
  }

  const existing = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email)
  if (existing) {
    res.status(409).json({ error: '用户名或邮箱已存在' })
    return
  }

  const id = uuid()
  const passwordHash = bcrypt.hashSync(password, 10)

  db.prepare('INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)').run(id, username, email, passwordHash)

  const token = signToken({ userId: id, username, role: 'user' })
  res.json({ token, user: { id, username, email, role: 'user' } })
})

// ==================== 登录 ====================
router.post('/login', (req, res) => {
  const { login, password } = req.body
  if (!login || !password) {
    res.status(400).json({ error: '请输入账号和密码' })
    return
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(login, login) as any
  if (!user) {
    res.status(401).json({ error: '账号或密码错误' })
    return
  }

  if (!bcrypt.compareSync(password, user.password_hash)) {
    res.status(401).json({ error: '账号或密码错误' })
    return
  }

  const token = signToken({ userId: user.id, username: user.username, role: user.role })
  res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } })
})

// ==================== 获取当前用户信息 ====================
router.get('/me', authMiddleware, (req, res) => {
  const { userId } = (req as any).user as JwtPayload
  const user = db.prepare('SELECT id, username, email, role, avatar, created_at FROM users WHERE id = ?').get(userId)
  if (!user) {
    res.status(404).json({ error: '用户不存在' })
    return
  }
  res.json({ user })
})

export default router
