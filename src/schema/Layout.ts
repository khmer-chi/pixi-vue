import type { ColorSource } from "pixi.js";
import type { Node } from "yoga-layout";
import type { AlignItems } from "#/schema/AlignSchema";
import type { JustifyContent } from "#/schema/justifyContentSchema";

export type Layout = {
  justifyContent: JustifyContent;
  alignItems: AlignItems;
  alignContent: AlignItems;
  alignSelf: AlignItems;

  width: Parameters<Node["setWidth"]>[0];
  height: Parameters<Node["setHeight"]>[0];
  backgroundColor: ColorSource;
};
