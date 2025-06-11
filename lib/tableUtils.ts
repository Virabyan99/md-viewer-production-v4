export function extractTableData(tableNode: any): {
  headers: string[];
  alignments: (string | null)[];
  rows: string[][];
} {
  // Check if tableNode has children and at least 2 rows
  if (!tableNode.children || tableNode.children.length < 2) {
    console.warn("Invalid table: insufficient rows", tableNode);
    return { headers: [], alignments: [], rows: [] };
  }

  const headerRow = tableNode.children[0];
  const separatorRow = tableNode.children[1];

  // Extract headers with fallback for missing values
  const headers = headerRow.children.map(
    (cell: any) => cell.children?.[0]?.value || ""
  );

  // Extract alignments with safer access and default to null if invalid
  const alignments = separatorRow.children.map((cell: any) => {
    const text = cell.children?.[0]?.value?.trim() || "";
    if (text.startsWith(":") && text.endsWith(":")) return "center";
    if (text.startsWith(":")) return "left";
    if (text.endsWith(":")) return "right";
    return null;
  });

  // Extract data rows, handling missing cells
  const rows = tableNode.children.slice(2).map((row: any) =>
    row.children.map((cell: any) => cell.children?.[0]?.value || "")
  );

  return { headers, alignments, rows };
}