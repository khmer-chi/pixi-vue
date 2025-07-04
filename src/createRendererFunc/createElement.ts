import {
  AnimatedSprite,
  type Application,
  BitmapText,
  Container,
  Graphics,
  HTMLText,
  Mesh,
  NineSliceSprite,
  Sprite,
  Text,
  Texture,
  TilingSprite,
} from "pixi.js";
import type { RendererNode } from "vue";
import {
  Align,
  Direction,
  Justify,
  type Node,
  type Yoga,
} from "yoga-layout/load";
import { RwdContainer } from "#/createRendererFunc/RwdContainer";
import { toKebabCase } from "#/toKebabCase";

const setLayoutOnNode = (layout: Record<string, unknown>, node: Node) => {
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
  node.setWidth(layout.width as number | "auto" | `${number}%` | undefined);
  node.setHeight(layout.height as number | "auto" | `${number}%` | undefined);

};
export const createElement = (
  type: string,
  vnodeProps: any,
  yoga: Yoga,
  application: Application,
  elScaleMap: WeakMap<RendererNode, number>,
  elAbortControllerMap: WeakMap<RendererNode, AbortController>,
  elYogaNodeMap: WeakMap<RendererNode, Node>,
): RendererNode => {
  const map = new Map<string, unknown>([
    ["pixi-container", Container],
    ["pixi-sprite", Sprite],
    ["pixi-text", Text],
    ["pixi-graphics", Graphics],
    ["pixi-bitmap-text", BitmapText],
    ["pixi-html-text", HTMLText],
    ["pixi-animated-sprite", AnimatedSprite],
    ["pixi-tiling-sprite", TilingSprite],
    ["pixi-nine-slice-sprite", NineSliceSprite],
    ["pixi-mesh", Mesh],

    ["pixi-rwd-container", RwdContainer],
  ]);

  const classFunc = map.get(toKebabCase(type));
  if (classFunc) {
    const node = yoga.Node.create();

    const layout = vnodeProps?.layout;

    if (layout)
      setLayoutOnNode(layout, node);
    const object = new (classFunc as any)(vnodeProps as any);

    if (vnodeProps?.scale) elScaleMap.set(object, vnodeProps.scale);
    elYogaNodeMap.set(object, node);

    if (object instanceof RwdContainer) {
      const controller = new AbortController();
      elAbortControllerMap.set(object, controller);
      object.orignalW = (vnodeProps as any).width;
      object.orignalH = (vnodeProps as any).height;
      // node.setMaxHeight("100%");
      // node.setMaxWidth("100%");
      node.setHeight("100%");
      node.setAspectRatio(
        (vnodeProps as any).width / (vnodeProps as any).height,
      );
      // node.setJustifyContent(Justify.Center)
      // node.setAlignItems(Align.Center);

    }


    if (object instanceof Graphics) {
      (vnodeProps as any).draw(object);
    }

    return object;
  }
  switch (toKebabCase(type)) {
    case "pixi-application": {
      const config = yoga.Config.create();
      config.setUseWebDefaults(true);
      const node = yoga.Node.create(config);
      if (vnodeProps) {
        // const { layout } = vnodeProps;
        // console.log({ layout });
        // if (layout) application.stage.layout = layout;
        const onAppResize = vnodeProps["on:appResize"] as any;
        const layout = vnodeProps?.layout;
        if (layout)
          setLayoutOnNode(layout, node);

        application.renderer.on("resize", (...args) => {
          const [width, height] = args;
          // console.log({ width, height })
          node.setWidth(width);
          node.setHeight(height);
          // node.calculateLayout(width, height, Direction.LTR);
          // console.log(node.getComputedLayout());
          onAppResize?.(...args);
        });
        application.resize();
      }

      elYogaNodeMap.set(application.stage, node);
      return application;
    }
    default: {
      throw new Error(`Unknown element type: ${type}`);
    }
  }
};
