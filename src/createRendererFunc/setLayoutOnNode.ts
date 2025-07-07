import type { Node } from "yoga-layout";
import { alignItemsStringToNumber } from "#/schema/AlignSchema";
import { justifyStringToNumber } from "#/schema/justifyContentSchema";
import type { Layout } from "#/schema/Layout";

export const setLayoutOnNode = (layout: Layout, node: Node) => {
  if (layout.justifyContent)
    node.setJustifyContent(justifyStringToNumber(layout.justifyContent));

  if (layout.alignItems)
    node.setAlignItems(alignItemsStringToNumber(layout.alignItems));

  if (layout.alignContent)
    node.setAlignContent(alignItemsStringToNumber(layout.alignContent))

  if (layout.alignSelf)
    node.setAlignSelf(alignItemsStringToNumber(layout.alignSelf))

  if (layout.width) node.setWidth(layout.width);
  if (layout.height) node.setHeight(layout.height);
};
