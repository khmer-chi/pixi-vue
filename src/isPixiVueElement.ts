import { toCamelCase } from "#/utils/toCamelCase";

export const isPixiVueElement = (tag: string) => {
  const name = toCamelCase(tag);
  if (name.startsWith("Pixi")) return true;
  return false;
}