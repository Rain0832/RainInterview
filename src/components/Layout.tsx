import { Outlet, Link, useLocation } from 'react-router-dom'
import { getCompanyById, getSessionById } from '../data/questions'

export default function Layout() {
  const location = useLocation()
  const pathParts = location.pathname.split('/').filter(Boolean)

  // 动态构建面包屑 — 从数据中心获取名称
  const crumbs: { label: string; to: string }[] = [{ label: '首页', to: '/' }]
  if (pathParts.length >= 2 && pathParts[0] === 'company') {
    const company = getCompanyById(pathParts[1])
    crumbs.push({
      label: company?.name || pathParts[1],
      to: `/company/${pathParts[1]}`,
    })
  }
  if (pathParts.length >= 3) {
    const session = getSessionById(pathParts[1], pathParts[2])
    crumbs.push({
      label: session?.name || pathParts[2],
      to: `/company/${pathParts[1]}/${pathParts[2]}`,
    })
  }
  if (pathParts.length >= 4) {
    if (pathParts[3] === 'choice') {
      crumbs.push({ label: '选择题', to: location.pathname })
    } else if (pathParts[3] === 'coding' && pathParts[4]) {
      crumbs.push({ label: `编程题 #${pathParts[4]}`, to: location.pathname })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 no-underline">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md">
                OJ
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                InterviewOJ
              </span>
            </Link>
            <div className="text-sm text-slate-500">
              大厂笔面试题库
            </div>
          </div>
        </div>
      </header>

      {/* 面包屑导航 */}
      {crumbs.length > 1 && (
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-1 text-sm">
            {crumbs.map((crumb, i) => (
              <li key={crumb.to} className="flex items-center gap-1">
                {i > 0 && <span className="text-slate-400 mx-1">/</span>}
                {i < crumbs.length - 1 ? (
                  <Link to={crumb.to} className="text-blue-600 hover:text-blue-800 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-slate-600 font-medium">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Outlet />
      </main>

      {/* 底部 */}
      <footer className="border-t border-slate-200 bg-white/60 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-slate-400">
          InterviewOJ — 离线大厂笔面试题库 · Built for Interview Prep
        </div>
      </footer>
    </div>
  )
}
