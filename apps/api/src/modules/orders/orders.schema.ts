import { z } from "zod";

// `phone` identifies the buyer until real JWT auth (Prompt 12) supplies req.userId instead.
export const createOrderSchema = z.object({
  phone: z.string().min(6),
});
