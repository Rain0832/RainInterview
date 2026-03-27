import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'

const JWT_SECRET = process.env.JWT_SECRET || 'interview-oj-secret-key-2026'
const JWT_EXPIRES = '7d'

export interface JwtPayload {
  userId: string
  username: string
  role: string
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES })
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload
}

// Express 中间件：鉴权
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: '未登录' })
    return
  }
  try {
    const payload = verifyToken(header.slice(7))
    ;(req as any).user = payload
    next()
  } catch {
    res.status(401).json({ error: 'Token 无效或已过期' })
  }
}

// 可选鉴权：有 token 则解析，无则继续
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (header?.startsWith('Bearer ')) {
    try {
      ;(req as any).user = verifyToken(header.slice(7))
    } catch { /* ignore */ }
  }
  next()
}
