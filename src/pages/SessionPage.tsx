import { useParams, Link } from 'react-router-dom'
import { getSessionById, type CodingQuestion } from '../data/questions'

export default function SessionPage() {
  const { companyId, sessionId } = useParams<{ companyId: string; sessionId: string }>()
  const session = getSessionById(companyId!, sessionId!)

  if (!session) {
    return (
      <div className="py-16 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">未找到该场次</h2>
        <Link to={`/company/${companyId}`} className="text-blue-600 hover:text-blue-800">返回公司页面</Link>
      </div>
    )
  }

  const choiceQuestions = session.questions.filter((q) => q.type === 'choice')
  const codingQuestions = session.questions.filter((q) => q.type === 'coding') as CodingQuestion[]

  const difficultyColor = {
    Easy: 'bg-green-100 text-green-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Hard: 'bg-red-100 text-red-700',
  }

  return (
    <div className="py-8">
      {/* Session header */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{session.name}</h1>
        <p className="text-slate-500">
          {session.date && `${session.date} · `}{session.type} · 共 {session.questions.length} 题
        </p>
      </div>

      {/* 选择题模块 */}
      {choiceQuestions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-xl">✅</span> 选择题
            <span className="text-sm font-normal text-slate-400 ml-1">({choiceQuestions.length} 题)</span>
          </h2>
          <Link
            to={`/company/${companyId}/${sessionId}/choice`}
            className="group block bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-green-200 transition-all duration-300 no-underline"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 group-hover:text-green-600 transition-colors">
                  开始答题
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  包含 {choiceQuestions.length} 道单选题，涵盖 AI/LLM、计算机基础等
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-sm font-medium shadow-sm group-hover:shadow-md transition-shadow">
                  进入答题 →
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* 编程题模块 */}
      {codingQuestions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-xl">💻</span> 编程题
            <span className="text-sm font-normal text-slate-400 ml-1">({codingQuestions.length} 题)</span>
          </h2>
          <div className="space-y-3">
            {codingQuestions.map((q, idx) => (
              <Link
                key={q.id}
                to={`/company/${companyId}/${sessionId}/coding/${q.id}`}
                className="group flex items-center bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all duration-200 no-underline"
              >
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-sm font-bold text-slate-600 mr-4 shrink-0 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                    {q.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {q.difficulty && (
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${difficultyColor[q.difficulty]}`}>
                        {q.difficulty}
                      </span>
                    )}
                    {q.tags?.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all ml-4 shrink-0">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
