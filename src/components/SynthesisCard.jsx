import ReactMarkdown from 'react-markdown'

export function SynthesisCard({ synthesis }) {
  if (!synthesis) return null

  return (
    <div className="mx-6 mb-4 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-indigo-800 mb-3">辯論總結</h3>
      <div className="prose prose-sm prose-indigo max-w-none">
        <ReactMarkdown>{synthesis}</ReactMarkdown>
      </div>
    </div>
  )
}
