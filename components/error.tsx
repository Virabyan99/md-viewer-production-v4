"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { IconAlertTriangle } from "@tabler/icons-react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    console.error(error); // Log for debugging
  }, [error]);

  return (
    <html>
      <body className="grid min-h-screen place-content-center bg-destructive text-destructive-foreground p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <IconAlertTriangle className="size-12" aria-hidden />
          <h2 className="text-2xl font-semibold">Something went wrong</h2>
          <button
            onClick={() => router.refresh()}
            className="rounded bg-background px-4 py-2 text-sm font-medium"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}