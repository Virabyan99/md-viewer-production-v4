import { z } from "zod";

export const fileSchema = z.object({
  name: z.string().refine(
    (name) => /(markdown|md|txt)$/i.test(name.split(".").pop() ?? ""),
    { message: "Unsupported file type" }
  ),
  size: z.number().max(512 * 1024, { message: "File too large (512 kB max)" }),
  type: z.string(),
});