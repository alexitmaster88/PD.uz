/** The `error` string from a JSON error body like `{ error: "..." }`, else `Server error: <status>`. */
export async function apiErrorMessage(res: Response): Promise<string> {
  const body: unknown = await res.json().catch(() => null)
  if (body && typeof body === "object" && "error" in body && typeof body.error === "string" && body.error) {
    return body.error
  }
  return `Server error: ${res.status}`
}

/** Message of a caught value, or "" when it isn't an Error. */
export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : ""
}
