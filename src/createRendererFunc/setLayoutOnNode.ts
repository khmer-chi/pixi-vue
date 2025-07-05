import { Align, Justify, type Node } from "yoga-layout";

export const setLayoutOnNode = (
  layout: Record<string, unknown>,
  node: Node,
) => {
  // node.markLayoutSeen();
  // node.setAlignItems(Align.FlexEnd);
  // node.setJustifyContent(Justify.Center);
  // console.log(layout);
  if (layout.justifyContent) {
    const justifyMap = new Map<string, Justify>([
      ["flex-start", Justify.FlexStart],
      ["center", Justify.Center],
      ["flex-end", Justify.FlexEnd],
      ["space-between", Justify.SpaceBetween],
      ["space-around", Justify.SpaceAround],
      ["space-evenly", Justify.SpaceEvenly],
    ]);
    const value = justifyMap.get(layout.justifyContent as string);
    if (value) {
      node.setJustifyContent(value);
    }
  }

  if (layout.alignItems) {
    const alignMap = new Map<string, Align>([
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
    const value = alignMap.get(layout.alignItems as string);
    if (value) {
      node.setAlignItems(value);
    }
  }
  if (layout.width)
    node.setWidth(layout.width as number | "auto" | `${number}%` | undefined);
  if (layout.height)
    node.setHeight(layout.height as number | "auto" | `${number}%` | undefined);
};
