import { Justify } from "yoga-layout";
import type * as z from "zod/v4";
import { literal, union } from "zod/v4";

const justifyContentSchema = union([
  literal("flex-start"),
  literal("center"),
  literal("flex-end"),
  literal("space-between"),
  literal("space-around"),
  literal("space-evenly"),
]);
export type JustifyContent = z.infer<typeof justifyContentSchema>;
const justifyContentMap = new Map<JustifyContent, Justify>([
  ["flex-start", Justify.FlexStart],
  ["center", Justify.Center],
  ["flex-end", Justify.FlexEnd],
  ["space-between", Justify.SpaceBetween],
  ["space-around", Justify.SpaceAround],
  ["space-evenly", Justify.SpaceEvenly],
]);
export const justifyStringToNumber = (justifyContent: JustifyContent) => {
  if (!justifyContent)
    throw Error(`justifyContent incorrect ${justifyContent}`);

  const value = justifyContentMap.get(justifyContent)
  if (!justifyContentSchema.parse(justifyContent))
    throw Error(`justifyContent incorrect ${justifyContent}`);

  return value as Justify
}