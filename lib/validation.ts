import { z } from "zod";

export const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 512 * 1024, { message: "File too large (512 kB max)" })
  .refine(
    (file) => /(markdown|md|txt)$/i.test(file.name.split(".").pop() ?? ""),
    { message: "Unsupported file type" },
  );