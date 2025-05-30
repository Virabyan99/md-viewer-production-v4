"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconDownload } from "@tabler/icons-react";
import { useCurrentFile } from "@/lib/useCurrentFile";
import { exportTxt, exportMd, exportHtml } from "@/lib/export";
import { useTranslations } from "next-intl";

export function ExportMenu() {
  const { filename, markdown, html } = useCurrentFile();
  const t = useTranslations('export');
  if (!filename) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <IconDownload className="size-4" aria-hidden />
          {t('menu')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => exportTxt(filename, markdown)}>{t("txt")}</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => exportMd(filename, markdown)}>{t("md")}</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => exportHtml(filename, html)}>{t("html")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}