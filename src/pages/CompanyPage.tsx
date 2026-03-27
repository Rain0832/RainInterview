import { useParams, Link } from 'react-router-dom'
import { getCompanyById } from '../data/questions'

export default function CompanyPage() {
  const { companyId } = useParams<{ companyId: string }>()
  const company = getCompanyById(companyId!)

  if (!company) {
    return (
      <div className="py-16 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">未找到该公司</h2>
        <Link to="/" className="text-blue-600 hover:text-blue-800">返回首页</Link>
      </div>
    )
  }

  return (
    <div className="py-8">
      {/* 公司 header */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-8">
        <div className="flex items-center gap-5">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl shadow-sm"
            style={{ backgroundColor: company.color + '20' }}
          >
            {company.logo}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{company.name}</h1>
            <p className="text-slate-500 mt-1">
              {company.year} {company.season} · 共 {company.sessions.length} 场考试
            </p>
          </div>
        </div>
      </div>

      {/* 场次列表 */}
      <h2 className="text-xl font-bold text-slate-800 mb-4">考试场次</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {company.sessions.map((session) => {
          const choiceQuestions = session.questions.filter((q) => q.type === 'choice')
          const codingQuestions = session.questions.filter((q) => q.type === 'coding')
          return (
            <Link
              key={session.id}
              to={`/company/${companyId}/${session.id}`}
              className="group block bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 no-underline"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {session.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {session.date && `${session.date} · `}{session.type}
                  </p>
                </div>
                <div className="text-3xl">
                  {session.type === '笔试' ? '📝' : '🎤'}
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg font-medium">
                  ✅ {choiceQuestions.length} 道选择题
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-violet-50 text-violet-700 rounded-lg font-medium">
                  💻 {codingQuestions.length} 道编程题
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-sm text-slate-400 flex items-center justify-between">
                <span>共 {session.questions.length} 题</span>
                <span className="text-blue-500 group-hover:translate-x-1 transition-transform">
                  进入 →
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
