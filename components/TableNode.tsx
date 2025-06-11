import { DecoratorNode, NodeKey, SerializedLexicalNode } from "lexical";
import { JSX } from "react";
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { Root as MdastRoot, Paragraph as MdastParagraph } from 'mdast'; // Add mdast types
import { Root as HastRoot } from 'hast'; // Add hast types

interface TableData {
  headers: any[];
  alignments: (string | null)[];
  rows: any[][];
}

export class TableNode extends DecoratorNode<JSX.Element> {
  __tableData: TableData;

  static getType() {
    return "table";
  }

  static clone(node: TableNode) {
    return new TableNode(node.__tableData, node.__key);
  }

  static importJSON(json: SerializedLexicalNode & { tableData: TableData }) {
    return new TableNode(json.tableData);
  }

  constructor(tableData: TableData, key?: NodeKey) {
    super(key);
    this.__tableData = tableData;
  }

  private astToHtml(ast: any): string {
    const processor = remark()
      .use(remarkRehype)
      .use(rehypeStringify);

    // Define wrappedAst with explicit mdast types
    const wrappedAst: MdastRoot = {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: ast
        } as MdastParagraph
      ]
    };

    // Transform mdast to hast, then stringify
    const hast = processor.runSync(wrappedAst) as HastRoot;
    const html = processor.stringify(hast);
    return html.replace(/^<p>/, '').replace(/<\/p>$/, '');
  }

  createDOM() {
    const { headers, alignments, rows } = this.__tableData;
    const tableHtml = `
      <table>
        <thead>
          <tr>
            ${headers.map((headerAst, i) => `
              <th style="text-align: ${alignments[i] || 'left'}">
                ${this.astToHtml(headerAst)}
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              ${row.map((cellAst, j) => `
                <td style="text-align: ${alignments[j] || 'left'}">
                  ${this.astToHtml(cellAst)}
                </td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    const parser = new DOMParser();
    const doc = parser.parseFromString(tableHtml, 'text/html');
    const table = doc.querySelector('table');
    if (table) {
      return table;
    } else {
      throw new Error("Table not found in generated HTML");
    }
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return <div />;
  }

  exportJSON(): SerializedLexicalNode & { tableData: TableData } {
    return {
      type: "table",
      version: 1,
      tableData: this.__tableData,
    };
  }
}