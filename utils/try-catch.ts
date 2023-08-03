export function tryCatch<T>(
  lazy: () => T
): {status: 'fulfilled'; value: T} | {status: 'rejected'; reason: unknown} {
  try {
    return {status: 'fulfilled', value: lazy()};
  } catch (err) {
    return {status: 'rejected', reason: err};
  }
}
