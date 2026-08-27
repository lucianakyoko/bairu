export function isPrismaKnownRequestError(
  error: unknown,
): error is { code: string; meta?: unknown } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string" &&
    error.code.startsWith("P")
  );
}

export function getPrismaConstraintFields(error: unknown): string[] {
  if (!isPrismaKnownRequestError(error)) {
    return [];
  }

  const meta = error.meta as Record<string, unknown> | undefined;

  // Formato "antigo" (query engine Rust, Prisma <= 6)
  if (meta && Array.isArray(meta.target)) {
    return meta.target.filter(
      (field): field is string => typeof field === "string",
    );
  }

  // Formato "novo" (Prisma 7 + driver adapters, ex: adapter-pg)
  const driverAdapterError = meta?.driverAdapterError as
    { cause?: { constraint?: { fields?: unknown } } } | undefined;
  const fields = driverAdapterError?.cause?.constraint?.fields;

  if (Array.isArray(fields)) {
    return fields.filter((field): field is string => typeof field === "string");
  }

  return [];
}
