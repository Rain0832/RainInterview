import { useParams, Link } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { getSessionById, type ChoiceQuestion } from '../data/questions'

export default function ChoicePage() {
  const { companyId, sessionId } = useParams<{ companyId: string; sessionId: string }>()
  const session = getSessionById(companyId!, sessionId!)

  const choiceQuestions = useMemo(
    () => (session?.questions.filter((q) => q.type === 'choice') as ChoiceQuestion[]) ?? [],
    [session]
  )

  const [currentIdx, setCurrentIdx] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
  const [showAnswer, setShowAnswer] = useState<Record<number, boolean>>({})
  const [showResult, setShowResult] = useState(false)

  if (!session || choiceQuestions.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">暂无选择题</h2>
        <Link to={`/company/${companyId}/${sessionId}`} className="text-blue-600">返回</Link>
      </div>
    )
  }

  const q = choiceQuestions[currentIdx]
  const selected = userAnswers[q.id]
  const revealed = showAnswer[q.id]
  const totalAnswered = Object.keys(userAnswers).length

  const handleSelect = (label: string) => {
    if (revealed) return
    setUserAnswers((prev) => ({ ...prev, [q.id]: label }))
  }

  const handleReveal = () => {
    setShowAnswer((prev) => ({ ...prev, [q.id]: true }))
  }

  const handleSubmit = () => {
    setShowResult(true)
  }

  // 结果页
  if (showResult) {
    const correct = choiceQuestions.filter(
      (cq) => cq.answer && userAnswers[cq.id] === cq.answer
    ).length
    const total = choiceQuestions.length
    const pct = Math.round((correct / total) * 100)

    return (
      <div className="py-8 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center mb-8">
          <div className="text-6xl mb-4">{pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪'}</div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">答题完成！</h2>
          <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent my-4">
            {correct} / {total}
          </div>
          <p className="text-slate-500">正确率 {pct}%</p>
          <div className="w-full bg-slate-100 rounded-full h-3 mt-4 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-blue-500 to-purple-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* 逐题回顾 */}
        <div className="space-y-4">
          {choiceQuestions.map((cq, idx) => {
            const ua = userAnswers[cq.id]
            const isCorrect = ua === cq.answer
            return (
              <div key={cq.id} className={`bg-white rounded-xl p-5 border ${isCorrect ? 'border-green-200' : 'border-red-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                    {idx + 1}
                  </span>
                  <span className="text-sm font-medium text-slate-800">{cq.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isCorrect ? '✓ 正确' : `✗ 你选 ${ua || '未答'} / 正确 ${cq.answer}`}
                  </span>
                </div>
                {cq.note && (
                  <p className="text-xs text-slate-500 mt-1 pl-9">💡 {cq.note}</p>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setShowResult(false)
              setUserAnswers({})
              setShowAnswer({})
              setCurrentIdx(0)
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all cursor-pointer"
          >
            重新答题
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 max-w-3xl mx-auto">
      {/* 进度条 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2 text-sm text-slate-500">
          <span>第 {currentIdx + 1} / {choiceQuestions.length} 题</span>
          <span>已答 {totalAnswered} 题</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / choiceQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 题号导航 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {choiceQuestions.map((cq, idx) => {
          const answered = !!userAnswers[cq.id]
          const isCurrent = idx === currentIdx
          const isRevealed = showAnswer[cq.id]
          const isCorrect = isRevealed && userAnswers[cq.id] === cq.answer

          let cls = 'w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all cursor-pointer '
          if (isCurrent) {
            cls += 'bg-blue-600 text-white shadow-md scale-110'
          } else if (isRevealed) {
            cls += isCorrect
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-red-100 text-red-700 border border-red-300'
          } else if (answered) {
            cls += 'bg-blue-100 text-blue-700 border border-blue-200'
          } else {
            cls += 'bg-white text-slate-500 border border-slate-200 hover:border-blue-300'
          }

          return (
            <button key={cq.id} className={cls} onClick={() => setCurrentIdx(idx)}>
              {idx + 1}
            </button>
          )
        })}
      </div>

      {/* 题目卡片 */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
            单选题
          </span>
          <span className="text-sm text-slate-400">#{q.id}</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-800 leading-relaxed mb-6">{q.content}</h3>

        {/* 选项 */}
        <div className="space-y-3">
          {q.choices.map((choice) => {
            const isSelected = selected === choice.label
            const isAnswer = q.answer === choice.label
            let optionCls =
              'flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer '

            if (revealed) {
              if (isAnswer) {
                optionCls += 'border-green-400 bg-green-50'
              } else if (isSelected && !isAnswer) {
                optionCls += 'border-red-400 bg-red-50'
              } else {
                optionCls += 'border-slate-100 bg-slate-50 opacity-60'
              }
            } else if (isSelected) {
              optionCls += 'border-blue-400 bg-blue-50 shadow-sm'
            } else {
              optionCls += 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
            }

            return (
              <div key={choice.label} className={optionCls} onClick={() => handleSelect(choice.label)}>
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                    revealed && isAnswer
                      ? 'bg-green-500 text-white'
                      : revealed && isSelected && !isAnswer
                      ? 'bg-red-500 text-white'
                      : isSelected
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {choice.label}
                </span>
                <span className="text-slate-700 leading-relaxed">{choice.text}</span>
                {revealed && isAnswer && <span className="ml-auto text-green-600 shrink-0">✓</span>}
                {revealed && isSelected && !isAnswer && <span className="ml-auto text-red-600 shrink-0">✗</span>}
              </div>
            )
          })}
        </div>

        {/* 查看答案 / 备注 */}
        {selected && !revealed && (
          <button
            onClick={handleReveal}
            className="mt-5 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors cursor-pointer"
          >
            👁️ 查看答案
          </button>
        )}
        {revealed && q.note && (
          <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
            💡 <strong>解析：</strong>{q.note}
          </div>
        )}
      </div>

      {/* 上一题 / 下一题 / 提交 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
          disabled={currentIdx === 0}
          className="px-5 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          ← 上一题
        </button>
        <div className="flex gap-3">
          {currentIdx < choiceQuestions.length - 1 ? (
            <button
              onClick={() => setCurrentIdx(currentIdx + 1)}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all cursor-pointer"
            >
              下一题 →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg transition-all cursor-pointer"
            >
              🎯 提交答案
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
