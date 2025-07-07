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
  TilingSprite,
} from "pixi.js";
import type { RendererNode } from "vue";
import type { Yoga } from "yoga-layout/load";
import { RwdContainer } from "#/createRendererFunc/RwdContainer";
import { setLayoutOnNode } from "#/createRendererFunc/setLayoutOnNode";
import { updateElByNode } from "#/createRendererFunc/updateElByNode";
import type { WeakMapObject } from "#/schema/WeakMapObject";
import { toKebabCase } from "#/toKebabCase";

export const createElement = (
  type: string,
  vnodeProps: any,
  yoga: Yoga,
  application: Application,
  weakMapObject: WeakMapObject,
): RendererNode => {
  const {
    elScaleMap,
    elAbortControllerMap,
    elYogaNodeMap,
    elBgMap,
    elLayoutDataMap,
  } = weakMapObject;
  const config = yoga.Config.create();
  config.setUseWebDefaults(true);
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
    const node = yoga.Node.create(config);

    const object = new (classFunc as any)(vnodeProps as any);

    if (vnodeProps?.scale) elScaleMap.set(object, vnodeProps.scale);

    if (object instanceof RwdContainer) {
      elAbortControllerMap.set(object, new AbortController());
      object.orignalW = (vnodeProps as any).width;
      object.orignalH = (vnodeProps as any).height;
      node.setMaxHeight("100%");
      node.setMaxWidth("100%");
      node.setHeight("100%");
      node.setAspectRatio(
        (vnodeProps as any).width / (vnodeProps as any).height,
      );
      elLayoutDataMap.set(object, vnodeProps?.layout)
    }

    // if (vnodeProps?.layout.backgroundColor) {
    //   elBgMap.set(object, new Graphics())
    // }
    const layout = vnodeProps?.layout;

    if (layout) setLayoutOnNode(layout, node);
    elYogaNodeMap.set(object, node);
    if (object instanceof Graphics) {
      (vnodeProps as any).draw(object);
    }

    return object;
  }
  switch (toKebabCase(type)) {
    case "pixi-application": {
      const node = yoga.Node.create(config);
      elYogaNodeMap.set(application.stage, node);
      if (vnodeProps) {
        const onAppResize = vnodeProps["on:appResize"] as any;
        const layout = vnodeProps?.layout;
        if (layout) setLayoutOnNode(layout, node);

        application.renderer.on("resize", (...args) => {
          const [width, height] = args;
          node.setWidth(width);
          node.setHeight(height);
          updateElByNode(application.stage, weakMapObject);

          onAppResize?.(...args);
        });
        application.resize();
      }

      return application;
    }
    default: {
      throw new Error(`Unknown element type: ${type}`);
    }
  }
};
