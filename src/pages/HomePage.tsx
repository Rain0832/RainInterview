import { Link } from 'react-router-dom'
import { companies } from '../data/questions'

export default function HomePage() {
  return (
    <div className="py-8">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          大厂笔面试题库
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          汇集各大互联网公司笔试与面试真题，助你系统备战秋招春招
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: '公司', value: companies.length, icon: '🏢' },
          { label: '场次', value: companies.reduce((s, c) => s + c.sessions.length, 0), icon: '📋' },
          {
            label: '选择题',
            value: companies.reduce(
              (s, c) => s + c.sessions.reduce((ss, se) => ss + se.questions.filter((q) => q.type === 'choice').length, 0),
              0
            ),
            icon: '✅',
          },
          {
            label: '编程题',
            value: companies.reduce(
              (s, c) => s + c.sessions.reduce((ss, se) => ss + se.questions.filter((q) => q.type === 'coding').length, 0),
              0
            ),
            icon: '💻',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 text-center shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
            <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 公司列表 */}
      <h2 className="text-2xl font-bold text-slate-800 mb-6">选择公司</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => {
          const choiceCount = company.sessions.reduce(
            (s, se) => s + se.questions.filter((q) => q.type === 'choice').length,
            0
          )
          const codingCount = company.sessions.reduce(
            (s, se) => s + se.questions.filter((q) => q.type === 'coding').length,
            0
          )
          return (
            <Link
              key={company.id}
              to={`/company/${company.id}`}
              className="group block bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 no-underline"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
                  style={{ backgroundColor: company.color + '20' }}
                >
                  {company.logo}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {company.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {company.year} {company.season}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg">
                  📋 {company.sessions.length} 场
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-lg">
                  ✅ {choiceCount} 选择
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg">
                  💻 {codingCount} 编程
                </span>
              </div>
            </Link>
          )
        })}

        {/* 占位卡片 - 更多公司 */}
        <div className="block bg-slate-50 rounded-2xl p-6 border-2 border-dashed border-slate-200 flex items-center justify-center">
          <div className="text-center text-slate-400">
            <div className="text-4xl mb-2">➕</div>
            <div className="text-sm">更多公司即将添加...</div>
          </div>
        </div>
      </div>
    </div>
  )
}
