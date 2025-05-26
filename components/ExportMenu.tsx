
"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconDownload } from "@tabler/icons-react";
import { useCurrentFile } from "@/lib/useCurrentFile";
import { exportTxt, exportMd, exportHtml, exportPdf } from "@/lib/export";

export function ExportMenu() {
  const { filename, markdown, html } = useCurrentFile();

  if (!filename) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <IconDownload className="size-4" aria-hidden />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => exportTxt(filename, markdown)}>TXT</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => exportMd(filename, markdown)}>Markdown</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => exportHtml(filename, html)}>HTML</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => exportPdf(filename, html)}>PDF</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}