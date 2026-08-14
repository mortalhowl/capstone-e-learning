import z from "zod";

export const createPaginatedResponse = <T extends z.ZodTypeAny>(
  itemSchema: T,
) => {
  z.object({
    currentPage: z.number(),
    count: z.number(),
    totalPages: z.number(),
    totalCount: z.number(),
    items: z.array(itemSchema),
  });
};

export const safeParseData = <T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
): z.infer<T> | null => {
  const result = schema.safeParse(data);

  if (!result.success) {
    console.log("Schema validation failed", result.error.flatten());

    return null;
  }
  return result.data;
};
