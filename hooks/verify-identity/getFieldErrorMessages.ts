export function getFieldErrorMessages(fieldError?: {
  message?: unknown;
  types?: Record<string, unknown>;
}) {
  if (!fieldError) return [];

  const messages = new Set<string>();
  if (typeof fieldError.message === "string") messages.add(fieldError.message);

  Object.values(fieldError.types ?? {}).forEach((value) => {
    const values = Array.isArray(value) ? value : [value];
    values.forEach((item) => {
      if (typeof item === "string") messages.add(item);
    });
  });

  return Array.from(messages);
}

