/**
 * Wraps a promise with a hard timeout.
 * Throws a typed TimeoutError if the operation exceeds the limit.
 */
export class TimeoutError extends Error {
  constructor(label: string, ms: number) {
    super(`[timeout] "${label}" exceeded ${ms}ms`);
    this.name = 'TimeoutError';
  }
}

export async function withTimeout<T>(
  fn: () => Promise<T>,
  ms: number,
  label: string
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new TimeoutError(label, ms)), ms);
  });

  try {
    const result = await Promise.race([fn(), timeout]);
    clearTimeout(timeoutId!);
    return result;
  } catch (err) {
    clearTimeout(timeoutId!);
    throw err;
  }
}
