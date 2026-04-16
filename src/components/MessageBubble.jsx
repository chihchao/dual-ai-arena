import ReactMarkdown from 'react-markdown'

export function MessageBubble({ message }) {
  const isA = message.role === 'A'
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
