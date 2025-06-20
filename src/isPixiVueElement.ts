import { toKebabCase } from "#/toKebabCase";

export const isPixiVueElement = (tag: string) => {
  const name = toKebabCase(tag);
  if (name.startsWith("pixi-rwd-container")) return false;
  if (name.startsWith("pixi-")) return true;
  if (name.startsWith("layout-")) return true;
  return false;
}