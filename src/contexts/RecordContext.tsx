import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

// ==================== 类型定义 ====================

export interface AnswerRecord {
  companyId: string
  sessionId: string
  questionId: number
  questionTitle: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  timestamp: number
}

export interface UserQuestion {
  id: string
  title: string
  content: string
  type: 'choice' | 'coding'
  choices?: { label: string; text: string }[]
  answer?: string
  note?: string
  tags?: string[]
  difficulty?: 'Easy' | 'Medium' | 'Hard'
  createdAt: number
}

interface RecordContextType {
  // 做题记录
  records: AnswerRecord[]
  addRecord: (record: AnswerRecord) => void
  clearRecords: () => void
  getWrongRecords: () => AnswerRecord[]
  getDoneRecords: () => AnswerRecord[]
  // 用户上传题目
  userQuestions: UserQuestion[]
  addUserQuestion: (q: UserQuestion) => void
  removeUserQuestion: (id: string) => void
}

const RecordContext = createContext<RecordContextType | undefined>(undefined)

const RECORDS_KEY = 'oj-answer-records'
const USER_QUESTIONS_KEY = 'oj-user-questions'

export function RecordProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<AnswerRecord[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(RECORDS_KEY) || '[]')
    } catch {
      return []
    }
  })

  const [userQuestions, setUserQuestions] = useState<UserQuestion[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_QUESTIONS_KEY) || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records))
  }, [records])

  useEffect(() => {
    localStorage.setItem(USER_QUESTIONS_KEY, JSON.stringify(userQuestions))
  }, [userQuestions])

  const addRecord = useCallback((record: AnswerRecord) => {
    setRecords((prev) => {
      // 去重：同一题只保留最新一次记录
      const filtered = prev.filter(
        (r) =>
          !(r.companyId === record.companyId &&
            r.sessionId === record.sessionId &&
            r.questionId === record.questionId)
      )
      return [...filtered, record]
    })
  }, [])

  const clearRecords = useCallback(() => setRecords([]), [])

  const getWrongRecords = useCallback(
    () => records.filter((r) => !r.isCorrect),
    [records]
  )

  const getDoneRecords = useCallback(() => records, [records])

  const addUserQuestion = useCallback((q: UserQuestion) => {
    setUserQuestions((prev) => [...prev, q])
  }, [])

  const removeUserQuestion = useCallback((id: string) => {
    setUserQuestions((prev) => prev.filter((q) => q.id !== id))
  }, [])

  return (
    <RecordContext.Provider
      value={{
        records,
        addRecord,
        clearRecords,
        getWrongRecords,
        getDoneRecords,
        userQuestions,
        addUserQuestion,
        removeUserQuestion,
      }}
    >
      {children}
    </RecordContext.Provider>
  )
}

export function useRecord(): RecordContextType {
  const ctx = useContext(RecordContext)
  if (!ctx) throw new Error('useRecord must be used within RecordProvider')
  return ctx
}
