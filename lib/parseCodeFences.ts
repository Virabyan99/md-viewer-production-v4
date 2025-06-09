export function parseCodeFences(md: string) {
  const lines = md.split("\n");
  let inFence = false;
  let fenceType = "";
  let fenceLang = "";
  let buffer: string[] = [];
  let startLine = 0;
  let codeBlocks: { code: string; language: string; start: number; end: number; broken: boolean }[] = [];
  let errors: string[] = [];

  lines.forEach((line, i) => {
    const match = line.match(/^(```|~~~)(\w+)?\s*$/);
    if (match) {
      if (!inFence) {
        inFence = true;
        fenceType = match[1];
        fenceLang = match[2] || "";
        buffer = [];
        startLine = i;
      } else if (inFence && match[1] === fenceType) {
        codeBlocks.push({
          code: buffer.join("\n"),
          language: fenceLang,
          start: startLine,
          end: i,
          broken: false,
        });
        inFence = false;
        fenceType = "";
        fenceLang = "";
      }
    } else if (inFence) {
      buffer.push(line);
    }
  });

  if (inFence) {
    codeBlocks.push({
      code: buffer.join("\n"),
      language: fenceLang,
      start: startLine,
      end: lines.length - 1,
      broken: true,
    });
    errors.push(`Unclosed code fence starting at line ${startLine + 1}. Block is rendered as-is.`);
  }
  return { codeBlocks, errors };
}