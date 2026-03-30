import React, { useState, useRef, useEffect } from 'react'
import { useTheme } from '../../../contexts/ThemeContext'
import type { Lesson, CourseModule } from '../data/courses'

interface Props {
  course: CourseModule
  lesson: Lesson
  allLessons: Lesson[]
  onChangeLesson: (l: Lesson) => void
  onBack: () => void
  onWriteNote: (milestoneId: string) => void
  sideNote: string
  onSideNoteChange: (v: string) => void
  onSaveSideNote: () => void
}

export default function LessonViewer({
  course, lesson, allLessons, onChangeLesson, onBack,
  onWriteNote, sideNote, onSideNoteChange, onSaveSideNote,
}: Props) {
  const { isDark } = useTheme()
  const [showNote, setShowNote] = useState(false)
  const [demoCode, setDemoCode] = useState('')
  const [demoOutput, setDemoOutput] = useState('')
  const [demoRunning, setDemoRunning] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const idx = allLessons.findIndex(l => l.id === lesson.id)

  // 切换章节时滚动到顶部
  useEffect(() => { contentRef.current?.scrollTo(0, 0) }, [lesson.id])

  // 提取课程中的第一个代码块作为 demo 初始值
  useEffect(() => {
    const codeMatch = lesson.content.match(/```(?:python|cpp|javascript|js|py)?\n([\s\S]*?)```/)
    if (codeMatch) setDemoCode(codeMatch[1].trim())
    else setDemoCode('')
    setDemoOutput('')
  }, [lesson.id])

  // 模拟运行代码（沙箱模式——用 Function 执行 JS，Python/C++ 给提示）
  const runDemo = () => {
    setDemoRunning(true)
    setTimeout(() => {
      try {
        // 只支持 JS 执行，其他语言给出提示
        if (demoCode.includes('#include') || demoCode.includes('using namespace')) {
          setDemoOutput('💡 C++ 代码需要在本地编译运行。\n建议：将代码复制到你的 RainCppAI 项目中测试。\n\n$ g++ -std=c++17 -o demo demo.cpp && ./demo')
        } else if (demoCode.includes('import ') || demoCode.includes('def ') || demoCode.includes('print(')) {
          setDemoOutput('💡 Python 代码需要本地 Python 环境。\n建议：\n$ python3 -c "' + demoCode.split('\n')[0] + '..."' + '\n\n或者在 https://www.online-python.com/ 在线运行')
        } else {
          // 尝试执行 JS
          const logs: string[] = []
          const mockConsole = { log: (...args: any[]) => logs.push(args.map(String).join(' ')) }
          const fn = new Function('console', demoCode)
          fn(mockConsole)
          setDemoOutput(logs.join('\n') || '(无输出)')
        }
      } catch (e: any) {
        setDemoOutput(`错误: ${e.message}`)
      }
      setDemoRunning(false)
    }, 500)
  }

  const c = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'

  return (
    <div className="flex gap-4">
      {/* ==================== 主内容区 ==================== */}
      <div className={`flex-1 min-w-0 ${showNote ? 'max-w-[calc(100%-320px)]' : ''}`}>
        {/* 顶部工具栏 */}
        <div className={`rounded-t-2xl border border-b-0 px-5 py-3 flex items-center justify-between ${c}`}>
          <div className="flex items-center gap-3">
            <button onClick={onBack} className={`text-sm px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>← 目录</button>
            <div className={`h-4 w-px ${isDark ? 'bg-slate-600' : 'bg-slate-200'}`} />
            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>第 {idx + 1} / {allLessons.length} 课</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowNote(!showNote)} className={`text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${showNote ? 'bg-blue-600 text-white' : isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              📝 {showNote ? '收起笔记' : '打开笔记'}
            </button>
            <span className={`text-xs px-2.5 py-1 rounded-full ${isDark ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>⏱ {lesson.duration}</span>
          </div>
        </div>

        {/* 章节导航条 */}
        <div className={`border border-b-0 px-5 py-2.5 overflow-x-auto flex gap-1.5 ${c}`}>
          {allLessons.map((l, i) => (
            <button key={l.id} onClick={() => onChangeLesson(l)}
              className={`shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full cursor-pointer transition-all ${
                l.id === lesson.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : isDark
                    ? 'bg-slate-700/50 text-slate-400 hover:bg-slate-600 hover:text-slate-200'
                    : 'bg-slate-100/80 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
              }`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${l.id === lesson.id ? 'bg-white/20' : isDark ? 'bg-slate-600' : 'bg-slate-200'}`}>{i + 1}</span>
              <span className="truncate max-w-[120px]">{l.title}</span>
            </button>
          ))}
        </div>

        {/* 课程标题 */}
        <div className={`border border-b-0 px-8 pt-8 pb-4 ${c}`}>
          <div className={`inline-block text-xs px-3 py-1 rounded-full mb-3 ${isDark ? 'bg-indigo-900/40 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>
            {course.subTaskTitle}
          </div>
          <h1 className={`text-2xl font-bold leading-tight ${isDark ? 'text-slate-50' : 'text-slate-900'}`}>
            {lesson.title}
          </h1>
        </div>

        {/* 课程正文 */}
        <div ref={contentRef} className={`border rounded-b-2xl px-8 py-6 max-h-[65vh] overflow-y-auto ${c}`}
          style={{ scrollBehavior: 'smooth' }}>
          <article className="space-y-1">
            {renderMarkdownPretty(lesson.content, isDark)}
          </article>

          {/* 互动代码 Demo */}
          {demoCode && (
            <div className={`mt-8 rounded-xl border overflow-hidden ${isDark ? 'border-slate-600' : 'border-slate-300'}`}>
              <div className={`flex items-center justify-between px-4 py-2 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>🧪 互动实验室</span>
                <button onClick={runDemo} disabled={demoRunning}
                  className="text-xs px-3 py-1 bg-green-600 text-white rounded-md cursor-pointer hover:bg-green-500 disabled:opacity-50 transition-colors">
                  {demoRunning ? '⏳ 运行中...' : '▶ 运行'}
                </button>
              </div>
              <textarea value={demoCode} onChange={e => setDemoCode(e.target.value)}
                className={`w-full p-4 text-sm font-mono leading-relaxed resize-y border-0 outline-none min-h-[120px] ${isDark ? 'bg-slate-900 text-green-400' : 'bg-slate-50 text-slate-800'}`}
                spellCheck={false} />
              {demoOutput && (
                <div className={`border-t px-4 py-3 text-sm font-mono whitespace-pre-wrap ${isDark ? 'border-slate-600 bg-slate-800 text-slate-300' : 'border-slate-300 bg-white text-slate-700'}`}>
                  <div className={`text-xs font-medium mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>输出:</div>
                  {demoOutput}
                </div>
              )}
            </div>
          )}

          {/* 底部导航 */}
          <div className={`flex items-center justify-between mt-10 pt-6 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            {idx > 0 ? (
              <button onClick={() => onChangeLesson(allLessons[idx - 1])}
                className={`text-sm px-5 py-2.5 rounded-xl cursor-pointer transition-all ${isDark ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                ← 上一课: {allLessons[idx - 1].title.slice(0, 20)}
              </button>
            ) : <div />}
            {idx < allLessons.length - 1 ? (
              <button onClick={() => onChangeLesson(allLessons[idx + 1])}
                className="text-sm px-5 py-2.5 rounded-xl cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transition-all">
                下一课: {allLessons[idx + 1].title.slice(0, 20)} →
              </button>
            ) : (
              <button onClick={() => onWriteNote(course.milestoneId)}
                className="text-sm px-5 py-2.5 rounded-xl cursor-pointer bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg transition-all">
                🎉 完成！写学习笔记 →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ==================== 侧边笔记小窗 ==================== */}
      {showNote && (
        <div className={`w-[300px] shrink-0 rounded-2xl border overflow-hidden flex flex-col sticky top-20 max-h-[80vh] ${c}`}>
          <div className={`px-4 py-3 border-b flex items-center justify-between ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-slate-50'}`}>
            <span className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>📝 学习笔记</span>
            <button onClick={() => setShowNote(false)} className={`text-xs cursor-pointer ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>✕</button>
          </div>
          <textarea
            value={sideNote}
            onChange={e => onSideNoteChange(e.target.value)}
            placeholder={"边学边记:\n- 这节课的关键概念...\n- 我的理解...\n- 有疑问的地方..."}
            className={`flex-1 p-4 text-sm leading-relaxed resize-none border-0 outline-none ${isDark ? 'bg-slate-800 text-slate-200 placeholder-slate-500' : 'bg-white text-slate-700 placeholder-slate-400'}`}
          />
          <div className={`px-4 py-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
            <button onClick={onSaveSideNote} disabled={!sideNote.trim()}
              className="w-full py-2 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg cursor-pointer hover:shadow-md transition-all disabled:opacity-50">
              💾 保存笔记
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ==================== 美化版 Markdown 渲染 ====================

function renderMarkdownPretty(text: string, isDark: boolean): React.ReactElement[] {
  const lines = text.split('\n')
  const elements: React.ReactElement[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]
    const k = key++

    // 标题
    const hMatch = line.match(/^(#{1,4})\s+(.*)/)
    if (hMatch) {
      const level = hMatch[1].length
      if (level === 1) {
        elements.push(<h1 key={k} className={`text-2xl font-extrabold mt-8 mb-4 pb-3 border-b ${isDark ? 'text-slate-50 border-slate-700' : 'text-slate-900 border-slate-200'}`}>{inl(hMatch[2], isDark)}</h1>)
      } else if (level === 2) {
        elements.push(<h2 key={k} className={`text-xl font-bold mt-6 mb-3 flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}><span className="w-1 h-6 rounded-full bg-blue-500 shrink-0" />{inl(hMatch[2], isDark)}</h2>)
      } else if (level === 3) {
        elements.push(<h3 key={k} className={`text-lg font-semibold mt-4 mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{inl(hMatch[2], isDark)}</h3>)
      } else {
        elements.push(<h4 key={k} className={`text-base font-semibold mt-3 mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{inl(hMatch[2], isDark)}</h4>)
      }
      i++; continue
    }

    // 代码块
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      const codeLines: string[] = []; i++
      while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++ }
      i++
      elements.push(
        <div key={k} className={`my-4 rounded-xl overflow-hidden border ${isDark ? 'border-slate-600' : 'border-slate-300'}`}>
          {lang && <div className={`px-4 py-1.5 text-xs font-mono ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'}`}>{lang}</div>}
          <pre className={`p-4 text-sm font-mono leading-relaxed overflow-x-auto ${isDark ? 'bg-slate-900 text-green-400' : 'bg-slate-50 text-slate-800'}`}>{codeLines.join('\n')}</pre>
        </div>
      )
      continue
    }

    // 表格
    if (line.includes('|') && line.trim().startsWith('|')) {
      const tableLines: string[] = [line]; i++
      while (i < lines.length && lines[i].includes('|')) { tableLines.push(lines[i]); i++ }
      const rows = tableLines.filter(l => !l.match(/^\|[\s-:|]+\|$/)).map(l => l.split('|').filter(Boolean).map(c => c.trim()))
      if (rows.length > 0) {
        elements.push(
          <div key={k} className="my-4 overflow-x-auto">
            <table className={`w-full text-sm border-collapse rounded-lg overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
              <thead><tr>{rows[0].map((h, hi) => <th key={hi} className={`px-4 py-2.5 text-left font-semibold ${isDark ? 'bg-slate-700 text-slate-200 border-slate-600' : 'bg-slate-100 text-slate-700 border-slate-200'} border-b`}>{inl(h, isDark)}</th>)}</tr></thead>
              <tbody>{rows.slice(1).map((row, ri) => <tr key={ri} className={ri % 2 === 0 ? '' : isDark ? 'bg-slate-800/50' : 'bg-slate-50/50'}>{row.map((cell, ci) => <td key={ci} className={`px-4 py-2 ${isDark ? 'text-slate-300 border-slate-700' : 'text-slate-600 border-slate-100'} border-b`}>{inl(cell, isDark)}</td>)}</tr>)}</tbody>
            </table>
          </div>
        )
      }
      continue
    }

    // 引用
    if (line.startsWith('>')) {
      const quoteLines: string[] = [line.slice(1).trim()]; i++
      while (i < lines.length && lines[i].startsWith('>')) { quoteLines.push(lines[i].slice(1).trim()); i++ }
      elements.push(
        <blockquote key={k} className={`my-3 pl-4 border-l-4 py-2 ${isDark ? 'border-blue-500 bg-blue-900/10 text-slate-300' : 'border-blue-400 bg-blue-50 text-slate-600'}`}>
          {quoteLines.map((ql, qi) => <p key={qi} className="text-sm leading-relaxed my-0.5">{inl(ql, isDark)}</p>)}
        </blockquote>
      )
      continue
    }

    // 无序列表
    if (/^[-*]\s/.test(line)) {
      const listItems: string[] = [line.replace(/^[-*]\s/, '')]; i++
      while (i < lines.length && /^[-*]\s/.test(lines[i])) { listItems.push(lines[i].replace(/^[-*]\s/, '')); i++ }
      elements.push(
        <ul key={k} className="my-3 space-y-1.5">
          {listItems.map((li, idx) => (
            <li key={idx} className="flex gap-2.5 items-start">
              <span className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${isDark ? 'bg-blue-400' : 'bg-blue-500'}`} />
              <span className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{inl(li, isDark)}</span>
            </li>
          ))}
        </ul>
      )
      continue
    }

    // 有序列表
    const olMatch = line.match(/^(\d+)[.)]\s(.*)/)
    if (olMatch) {
      const listItems: { num: string; text: string }[] = [{ num: olMatch[1], text: olMatch[2] }]; i++
      while (i < lines.length) { const m = lines[i].match(/^(\d+)[.)]\s(.*)/); if (m) { listItems.push({ num: m[1], text: m[2] }); i++ } else break }
      elements.push(
        <ol key={k} className="my-3 space-y-2">
          {listItems.map((li, idx) => (
            <li key={idx} className="flex gap-3 items-start">
              <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>{li.num}</span>
              <span className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{inl(li.text, isDark)}</span>
            </li>
          ))}
        </ol>
      )
      continue
    }

    // 空行
    if (!line.trim()) { elements.push(<div key={k} className="h-3" />); i++; continue }

    // 普通段落
    elements.push(<p key={k} className={`text-sm leading-[1.8] my-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{inl(line, isDark)}</p>)
    i++
  }

  return elements
}

function inl(text: string, isDark: boolean) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|~~[^~]+~~)/)
  return parts.map((p, i) => {
    if (/^\*\*.*\*\*$/.test(p)) return <strong key={i} className={isDark ? 'text-slate-100 font-semibold' : 'text-slate-800 font-semibold'}>{p.slice(2, -2)}</strong>
    if (/^`.*`$/.test(p)) return <code key={i} className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDark ? 'bg-slate-700 text-amber-300' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>{p.slice(1, -1)}</code>
    if (/^~~.*~~$/.test(p)) return <del key={i} className="opacity-60">{p.slice(2, -2)}</del>
    const linkMatch = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkMatch) return <a key={i} href={linkMatch[2]} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-400 underline underline-offset-2">{linkMatch[1]}</a>
    return <span key={i}>{p}</span>
  })
}
