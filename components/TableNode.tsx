import { DecoratorNode, NodeKey, SerializedLexicalNode } from "lexical";
import { JSX } from "react";

interface TableData {
  headers: string[];
  alignments: (string | null)[];
  rows: string[][];
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

  createDOM() {
    const div = document.createElement("div");
    div.className = "table-container";
    const { headers, alignments, rows } = this.__tableData;
    const tableHtml = `
      <table class="table border-collapse border border-gray-400 w-full my-4">
        <thead>
          <tr>
            ${headers.map((header, i) => `
              <th class="border border-gray-300 px-4 py-2 bg-gray-100 dark:bg-gray-800 dark:border-gray-600" style="text-align: ${alignments[i] || 'left'}">
                ${header}
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              ${row.map((cell, j) => `
                <td class="border border-gray-300 px-4 py-2 dark:border-gray-600" style="text-align: ${alignments[j] || 'left'}">
                  ${cell}
                </td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    div.innerHTML = tableHtml;
    return div;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return <div />; // Fixes TypeScript error
  }

  exportJSON(): SerializedLexicalNode & { tableData: TableData } {
    return {
      type: "table",
      version: 1,
      tableData: this.__tableData,
    };
  }
}