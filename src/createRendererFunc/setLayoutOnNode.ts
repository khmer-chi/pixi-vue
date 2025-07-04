import { Align, Justify, type Node } from "yoga-layout";

export const setLayoutOnNode = (
  layout: Record<string, unknown>,
  node: Node,
) => {
  if (layout.justifyContent) {
    const map = new Map<string, Justify>([
      ["flex-start", Justify.FlexStart],
      ["center", Justify.Center],
      ["flex-end", Justify.FlexEnd],
      ["space-between", Justify.SpaceBetween],
      ["space-around", Justify.SpaceAround],
      ["space-evenly", Justify.SpaceEvenly],
    ]);
    const value = map.get(layout.justifyContent as string);
    if (value) {
      node.setJustifyContent(value);
    }
  }
  if (layout.alignItem) {
    const map = new Map<string, Align>([
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
    const value = map.get(layout.alignItem as string);
    if (value) node.setAlignItems(value);
  }
  //TODO
  node.setJustifyContent(Justify.Center);
  node.setAlignItems(Align.Center);

  node.setWidth(layout.width as number | "auto" | `${number}%` | undefined);
  node.setHeight(layout.height as number | "auto" | `${number}%` | undefined);
};
