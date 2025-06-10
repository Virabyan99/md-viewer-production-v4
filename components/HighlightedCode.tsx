import React from 'react'
import Prism from '@/prism/prismConfig' // Adjusted path to your prismConfig

interface HighlightedCodeProps {
  code: string
  language: string
}

export const HighlightedCode: React.FC<HighlightedCodeProps> = ({
  code,
  language,
}) => {
  // Add debug log to verify language availability
  console.log(`Language: ${language}, Available:`, Prism.languages[language])
  const highlightedCode = Prism.highlight(
    code,
    Prism.languages[language] || Prism.languages.text,
    language
  )
  return (
    <pre className="bg-transparent rounded-md p-0 m-0 font-mono text-sm text-foreground overflow-x-auto ">
      <code
        className={`language-${language}`}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </pre>
  )
}
