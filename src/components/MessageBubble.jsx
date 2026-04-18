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
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
            isA ? 'bg-m3-alpha-container text-m3-on-alpha' : 'bg-m3-omega-container text-m3-on-omega'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            {message.name} · 搜尋資料
          </span>
          <div className={`rounded-[20px] px-5 py-4 text-base leading-relaxed prose prose-sm max-w-full border border-dashed ${
            isA
              ? 'bg-m3-alpha-container/50 border-m3-on-alpha/20 text-m3-on-alpha rounded-tl-sm'
              : 'bg-m3-omega-container/50 border-m3-on-omega/20 text-m3-on-omega rounded-tr-sm'
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
        <span className={`text-xs font-semibold ${isA ? 'text-m3-on-alpha' : 'text-m3-on-omega'}`}>
          {message.name}
        </span>
        <div className={`rounded-[20px] px-5 py-4 text-base leading-relaxed prose prose-sm max-w-full ${
          isA
            ? 'bg-m3-alpha-container text-m3-on-alpha rounded-tl-sm'
            : 'bg-m3-omega-container text-m3-on-omega rounded-tr-sm'
        } ${message.streaming ? 'animate-pulse' : ''}`}>
          <ReactMarkdown>{message.content || '▌'}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
