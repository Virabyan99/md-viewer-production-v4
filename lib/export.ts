import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "@fontsource/noto-sans"; // Registers Noto Sans for PDFs

export async function exportTxt(filename: string, markdown: string) {
  downloadBlob(markdown, `${filename}.txt`, "text/plain;charset=utf-8");
}

export async function exportMd(filename: string, markdown: string) {
  downloadBlob(markdown, `${filename}.md`, "text/markdown;charset=utf-8");
}

export async function exportHtml(filename: string, html: string) {
  const doc = `
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8"/>
      <title>${filename}</title>
      <style>${embedTailwindCSS()}</style>
    </head>
    <body class="prose">${html}</body>
    </html>
  `;
  downloadBlob(doc, `${filename}.html`, "text/html;charset=utf-8");
}

export async function exportPdf(filename: string, html: string) {
  const doc = new jsPDF({ unit: "pt" });
  doc.setFont("NotoSans", "normal");
  await doc.html(html, {
    html2canvas: { scale: 0.8, useCORS: true },
    callback: () => doc.save(`${filename}.pdf`),
    windowWidth: 1024,
  });
}

function downloadBlob(data: string, name: string, type: string) {
  const blob = new Blob([data], { type });
  saveAs(blob, name);
}

function embedTailwindCSS() {
  return `
    body { font-family: 'Noto Sans', sans-serif; }
    h1, h2, h3 { font-weight: 600; }
    code { background: #f5f5f5; padding: 0.2em 0.4em; border-radius: 4px; }
  `;
}