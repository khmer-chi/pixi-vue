import { toKebabCase } from "#/toKebabCase";

export const isPixiVueElement = (tag: string) => {
  const name = toKebabCase(tag);
  if (name.startsWith("pixi-")) return true;
  return false;
}