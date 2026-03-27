import { Outlet, Link, useLocation } from 'react-router-dom'
import { getCompanyById, getSessionById } from '../data/questions'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const location = useLocation()
  const pathParts = location.pathname.split('/').filter(Boolean)
  const { theme, toggleTheme, isDark } = useTheme()
  const { user, isLoggedIn, logout } = useAuth()

  // 动态构建面包屑 — 从数据中心获取名称
  const crumbs: { label: string; to: string }[] = [{ label: '首页', to: '/' }]
  if (pathParts.length >= 2 && pathParts[0] === 'company') {
    const company = getCompanyById(pathParts[1])
    crumbs.push({
      label: company?.name || pathParts[1],
      to: `/company/${pathParts[1]}`,
    })
  }
  if (pathParts.length >= 3 && pathParts[0] === 'company') {
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
  // 错题本/上传/记录 页面面包屑
  if (pathParts[0] === 'wrong-book') {
    crumbs.push({ label: '错题本', to: '/wrong-book' })
  }
  if (pathParts[0] === 'my-records') {
    crumbs.push({ label: '做题记录', to: '/my-records' })
  }
  if (pathParts[0] === 'upload') {
    crumbs.push({ label: '上传题目', to: '/upload' })
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-slate-950 to-slate-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      {/* 顶部导航栏 */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b shadow-sm transition-colors duration-300 ${isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white/80 border-slate-200'}`}>
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
            <div className="flex items-center gap-3">
              {/* 导航链接 */}
              <nav className="hidden sm:flex items-center gap-1 text-sm">
                <Link to="/wrong-book" className={`px-3 py-1.5 rounded-lg transition-colors no-underline ${isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                  📝 错题本
                </Link>
                <Link to="/my-records" className={`px-3 py-1.5 rounded-lg transition-colors no-underline ${isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                  📊 记录
                </Link>
                <Link to="/upload" className={`px-3 py-1.5 rounded-lg transition-colors no-underline ${isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                  ➕ 上传
                </Link>
              </nav>
              {/* 暗色模式切换 */}
              <button
                onClick={toggleTheme}
                className={`relative w-14 h-7 rounded-full transition-all duration-300 cursor-pointer border-0 ${isDark ? 'bg-indigo-600' : 'bg-slate-300'}`}
                aria-label={`切换到${isDark ? '浅色' : '深色'}模式`}
                title={`当前: ${theme === 'dark' ? '深色' : '浅色'}模式`}
              >
                <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-xs transition-all duration-300 ${isDark ? 'left-7' : 'left-0.5'}`}>
                  {isDark ? '🌙' : '☀️'}
                </div>
              </button>
              {/* 用户状态 */}
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {user?.username}
                  </span>
                  <button
                    onClick={logout}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer ${isDark ? 'border-slate-600 text-slate-400 hover:bg-slate-700' : 'border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                  >
                    退出
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-lg font-medium hover:shadow-md transition-all no-underline"
                >
                  登录
                </Link>
              )}
            </div>
          </div>
        </div>
        {/* 移动端导航 */}
        <div className={`sm:hidden border-t px-4 py-2 flex gap-2 text-xs ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <Link to="/wrong-book" className={`px-2 py-1 rounded no-underline ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>📝 错题本</Link>
          <Link to="/my-records" className={`px-2 py-1 rounded no-underline ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>📊 记录</Link>
          <Link to="/upload" className={`px-2 py-1 rounded no-underline ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>➕ 上传</Link>
        </div>
      </header>

      {/* 面包屑导航 */}
      {crumbs.length > 1 && (
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-1 text-sm">
            {crumbs.map((crumb, i) => (
              <li key={crumb.to} className="flex items-center gap-1">
                {i > 0 && <span className={`mx-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>/</span>}
                {i < crumbs.length - 1 ? (
                  <Link to={crumb.to} className="text-blue-500 hover:text-blue-400 transition-colors no-underline">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{crumb.label}</span>
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
      <footer className={`border-t backdrop-blur-sm mt-auto transition-colors duration-300 ${isDark ? 'border-slate-700 bg-slate-900/60' : 'border-slate-200 bg-white/60'}`}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          InterviewOJ — 大厂笔面试题库 · Built for Interview Prep
        </div>
      </footer>
    </div>
  )
}
