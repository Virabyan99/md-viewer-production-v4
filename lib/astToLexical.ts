import { LexicalNode, $createTextNode, $createParagraphNode } from 'lexical'
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import { $createListNode, $createListItemNode } from '@lexical/list'
import { $createCodeNode } from '@lexical/code'
import { $createLinkNode } from '@lexical/link'
import { $createHorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode'
import { TableNode } from '@/components/TableNode'
import { extractTableData } from './tableUtils'

// Define the mapping from heading levels to heading tags
const headingTags: { [key in 1 | 2 | 3 | 4 | 5 | 6]: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' } = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
}

function createInlineNodes(node: any): LexicalNode[] {
  if (node.type === 'text') {
    return [$createTextNode(node.value)]
  } else if (node.type === 'inlineCode') {
    const textNode = $createTextNode(node.value)
    textNode.setFormat('code')
    return [textNode]
  } else if (node.type === 'strong') {
    const textNode = $createTextNode(node.children[0]?.value || '')
    textNode.setFormat('bold')
    return [textNode]
  } else if (node.type === 'emphasis') {
    const textNode = $createTextNode(node.children[0]?.value || '')
    textNode.setFormat('italic')
    return [textNode]
  } else if (node.type === 'delete') {
    const textNode = $createTextNode(node.children[0]?.value || '')
    textNode.setFormat('strikethrough')
    return [textNode]
  } else if (node.type === 'link') {
    const href = node.url
    const textNodes = node.children.map((child: any) =>
      $createTextNode(child.value || '')
    )
    const linkNode = $createLinkNode(href)
    textNodes.forEach((node) => linkNode.append(node))
    return [linkNode]
  }
  return []
}

export function createLexicalNodesFromAST(node: any): LexicalNode | null {
  switch (node.type) {
    case 'paragraph':
      const paragraphNode = $createParagraphNode()
      node.children.forEach((child: any) => {
        const inlineNodes = createInlineNodes(child)
        inlineNodes.forEach((inlineNode) => paragraphNode.append(inlineNode))
      })
      return paragraphNode
    case 'heading':
      const headingLevel = node.depth
      if (headingLevel >= 1 && headingLevel <= 6) {
        const tag = headingTags[headingLevel as 1 | 2 | 3 | 4 | 5 | 6]
        const headingNode = $createHeadingNode(tag)
        node.children.forEach((child: any) => {
          const inlineNodes = createInlineNodes(child)
          inlineNodes.forEach((inlineNode) => headingNode.append(inlineNode))
        })
        return headingNode
      } else {
        console.warn(`Invalid heading level: ${headingLevel}`)
        return null
      }
    case 'thematicBreak':
      return $createHorizontalRuleNode()
    case 'blockquote':
      const quoteNode = $createQuoteNode()
      node.children.forEach((child: any) => {
        const blockNode = createLexicalNodesFromAST(child)
        if (blockNode) quoteNode.append(blockNode)
      })
      return quoteNode
    case 'list':
      const isOrdered = node.ordered
      const listType = isOrdered ? 'number' : 'bullet'
      const listNode = $createListNode(listType)
      node.children.forEach((item: any) => {
        const listItemNode = $createListItemNode()
        item.children.forEach((child: any) => {
          const blockNode = createLexicalNodesFromAST(child)
          if (blockNode) listItemNode.append(blockNode)
        })
        listNode.append(listItemNode)
      })
      return listNode
    case 'code':
      const codeNode = $createCodeNode(node.lang || '')
      const textNode = $createTextNode(node.value)
      codeNode.append(textNode)
      return codeNode
    case 'table':
      console.log('Raw table AST node:', JSON.stringify(node, null, 2))
      const tableData = extractTableData(node)
      console.log('Extracted tableData:', tableData)
      if (tableData.headers.length > 0) {
        return new TableNode(tableData)
      } else {
        console.warn('Skipping invalid table')
        return null
      }
    default:
      return null
  }
}