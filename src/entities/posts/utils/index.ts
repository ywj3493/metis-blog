export function isNotionPageId(id: string): boolean {
  const uuidWithHyphens =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const uuidWithoutHyphens = /^[0-9a-f]{32}$/i;
  return uuidWithHyphens.test(id) || uuidWithoutHyphens.test(id);
}
