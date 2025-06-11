export function extractTableData(tableNode: any): {
  headers: any[];
  alignments: (string | null)[];
  rows: any[][];
} {
  if (!tableNode.children || tableNode.children.length < 2) {
    console.warn("Invalid table: insufficient rows", tableNode);
    return { headers: [], alignments: [], rows: [] };
  }

  const headerRow = tableNode.children[0];
  const separatorRow = tableNode.children[1];

  // Extract headers as AST nodes
  const headers = headerRow.children.map((cell: any) => cell.children || []);

  // Extract alignments from separator row
  const alignments = separatorRow.children.map((cell: any) => {
    const text = cell.children?.[0]?.value?.trim() || "";
    if (text.startsWith(":") && text.endsWith(":")) return "center";
    if (text.startsWith(":")) return "left";
    if (text.endsWith(":")) return "right";
    return null;
  });

  // Extract data rows as AST nodes
  const rows = tableNode.children.slice(2).map((row: any) =>
    row.children.map((cell: any) => cell.children || [])
  );

  return { headers, alignments, rows };
}