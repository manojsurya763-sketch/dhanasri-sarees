// Express 5 types req.params values as `string | string[]` to account for wildcard routes.
// None of our routes use wildcards, so a param is always a single string at runtime.
export function param(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}
