'use client'

import { useEffect } from 'react'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListNode, ListItemNode } from '@lexical/list'
import { LinkNode } from '@lexical/link'
import { CodeNode } from '@lexical/code'
import { PluginProvider } from './PluginContext'
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode'
import { MarkdownParser } from '@/lib/markdownParser'
import { TypographyPlugin } from './TypographyPlugin'
import { lexicalTheme } from '@/lib/lexicalTheme'
import { useTranslations } from 'next-intl'

interface LexicalViewerProps {
  markdown: string | null
}

export function LexicalViewer({ markdown }: LexicalViewerProps) {
  const t = useTranslations('viewer.placeholder')
  const composerConfig = {
    namespace: 'markdown-viewer',
    editable: false,
    theme: lexicalTheme,
    onError(error: Error) {
      throw error
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      LinkNode,
      CodeNode,
      HorizontalRuleNode,
    ],
  }

  return (
    <LexicalComposer initialConfig={composerConfig}>
      <MarkdownLoader markdown={markdown} />
      <PluginProvider plugins={[TypographyPlugin]}>
        {markdown ? (
          <ContentEditable className="prose dark:prose-invert max-w-none" />
        ) : (
          <div className="grid min-h-[40vh] place-content-center text-center text-muted-foreground">
            <p>
              {t('part1')}
              <br />
              {t('part2')} <code>.md</code> {t('part3')}
            </p>
          </div>
        )}
      </PluginProvider>
    </LexicalComposer>
  )
}

function MarkdownLoader({ markdown }: { markdown: string | null }) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (markdown) {
      const parser = new MarkdownParser(editor)
      parser.import(markdown)
    }
  }, [editor, markdown])

  return null
}
