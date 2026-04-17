import ReactMarkdown from 'react-markdown'

export function MessageBubble({ message }) {
  const isA = message.role === 'A'

  if (message.type === 'research') {
    return (
      <div className={`flex flex-col gap-1 ${isA ? 'items-start' : 'items-end'}`}>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
            isA ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          {message.name} · 搜尋資料
        </span>
        <div
          className={`max-w-2xl rounded-2xl px-4 py-3 text-sm prose prose-sm border border-dashed ${
            isA
              ? 'bg-blue-50/60 border-blue-200 text-gray-700 rounded-tl-none'
              : 'bg-red-50/60 border-red-200 text-gray-700 rounded-tr-none'
          } ${message.streaming ? 'animate-pulse' : ''}`}
        >
          <ReactMarkdown>{message.content || '搜尋中...'}</ReactMarkdown>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col gap-1 ${isA ? 'items-start' : 'items-end'}`}>
      <span
        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
          isA ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
        }`}
      >
        {message.name}
      </span>
      <div
        className={`max-w-2xl rounded-2xl px-4 py-3 text-sm prose prose-sm ${
          isA
            ? 'bg-blue-50 text-gray-800 rounded-tl-none'
            : 'bg-red-50 text-gray-800 rounded-tr-none'
        } ${message.streaming ? 'animate-pulse' : ''}`}
      >
        <ReactMarkdown>{message.content || '▌'}</ReactMarkdown>
      </div>
    </div>
  )
}
