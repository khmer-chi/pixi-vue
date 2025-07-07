import { Align } from "yoga-layout";
import type * as z from "zod/v4";
import { literal, union } from "zod/v4";

const AlignSchema = union([
  literal("auto"),
  literal("flex-start"),
  literal("center"),
  literal("flex-end"),
  literal("stretch"),
  literal("baseline"),
  literal("space-between"),
  literal("space-around"),
  literal("space-evenly"),
]);
export type AlignItems = z.infer<typeof AlignSchema>;
const alignItemsMap = new Map<string, Align>([
  ["auto", Align.Auto],
  ["flex-start", Align.FlexStart],
  ["center", Align.Center],
  ["flex-end", Align.FlexEnd],
  ["stretch", Align.Stretch],
  ["baseline", Align.Baseline],
  ["space-between", Align.SpaceBetween],
  ["space-around", Align.SpaceAround],
  ["space-evenly", Align.SpaceEvenly],
]);
export const alignItemsStringToNumber = (alignItems: AlignItems) => {
  if (!alignItems) throw Error(`alignItems incorrect ${alignItems}`);
  const value = alignItemsMap.get(alignItems);
  if (!AlignSchema.parse(alignItems))
    throw Error(`alignItems incorrect ${alignItems}`);
  return value as Align;
};
