import ReactMarkdown from 'react-markdown'
import { AlphaAvatar, OmegaAvatar } from './CharacterAvatar'

export function MessageBubble({ message }) {
  const isA = message.role === 'A'
  const Avatar = isA ? AlphaAvatar : OmegaAvatar

  if (message.type === 'research') {
    return (
      <div className={`flex gap-3 ${isA ? '' : 'flex-row-reverse'}`}>
        <div className="flex-shrink-0 mt-1">
          <Avatar className="w-8 h-8" />
        </div>
        <div className={`flex flex-col gap-1 flex-1 min-w-0 ${isA ? 'items-start' : 'items-end'}`}>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
            isA ? 'bg-sky-950 text-sky-400' : 'bg-amber-950 text-amber-400'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            {message.name} · 搜尋資料
          </span>
          <div className={`rounded-2xl px-4 py-3 text-sm prose prose-sm prose-invert max-w-full border border-dashed ${
            isA
              ? 'bg-sky-950/40 border-sky-800 text-slate-300 rounded-tl-none'
              : 'bg-amber-950/40 border-amber-800 text-slate-300 rounded-tr-none'
          } ${message.streaming ? 'animate-pulse' : ''}`}>
            <ReactMarkdown>{message.content || '搜尋中...'}</ReactMarkdown>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex gap-3 ${isA ? '' : 'flex-row-reverse'}`}>
      <div className="flex-shrink-0 mt-1">
        <Avatar className="w-9 h-9" />
      </div>
      <div className={`flex flex-col gap-1 flex-1 min-w-0 ${isA ? 'items-start' : 'items-end'}`}>
        <span className={`text-xs font-bold ${isA ? 'text-sky-400' : 'text-amber-400'}`}>
          {message.name}
        </span>
        <div className={`rounded-2xl px-4 py-3 text-sm prose prose-sm prose-invert max-w-full ${
          isA
            ? 'bg-sky-950/60 border border-sky-900 text-slate-200 rounded-tl-none'
            : 'bg-amber-950/60 border border-amber-900 text-slate-200 rounded-tr-none'
        } ${message.streaming ? 'animate-pulse' : ''}`}>
          <ReactMarkdown>{message.content || '▌'}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
