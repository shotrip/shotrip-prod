import * as z from "zod";

export const profileSchema = z.object({
  nickname: z.string()
  .min(5, "Nickname is required (5 to 20 characters)")
  .max(20, "Must be Between 5 and 20 characters long.")
  .transform((val) => val.trim()),
  nationality: z.string()
  .min(1, "Nationality is required")
  .transform((val) => val.trim()),
  honorific: z.string().min(1, "Title is required"),
  age: z.string().min(1, "Age is required"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;