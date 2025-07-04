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
    const classArgsOptions = { ...(vnodeProps as any) };
    // if (classFunc == RwdContainer) {
    //   delete classArgsOptions.width;
    //   delete classArgsOptions.height;

    //   classArgsOptions.layout = {
    //     ...vnodeProps?.layout,
    //     height: "100%",
    //     aspectRatio: (vnodeProps as any).width / (vnodeProps as any).height,
    //   };
    // }

    const object = new (classFunc as any)(classArgsOptions);

    if (vnodeProps?.scale) elScaleMap.set(object, vnodeProps.scale);

    if (object instanceof RwdContainer) {
      const controller = new AbortController();
      object.orignalW = (vnodeProps as any).width;
      object.orignalH = (vnodeProps as any).height;
      // console.log(vnodeProps?.layout);
      // node.setJustifyContent(Justify.Center);
      // node.setAlignItems(Align.Center);

      node.setHeight("100%");
      node.setAspectRatio(0.5);
      node.setMaxHeight('100%')
      node.setMaxWidth('100%')
      // node.setHeight(200);
      // console.log(node.isDirty())

      // node.calculateLayout(100, 300, Direction.LTR)
      // console.log(node.isDirty())
      // console.log(node.getComputedLayout())
      // object.on(
      //   "layout",
      //   (event) => {
      //     // console.log(event.computedLayout.width, (vnodeProps as any).width)
      //     const _scaleX =
      //       event.computedLayout.width / (vnodeProps as any).width;
      //     // const _scaleY =
      //     //   event.computedLayout.height / (vnodeProps as any).height;
      //     // console.log({ _scaleX, _scaleY })

      //     // const scaleEffect = _scaleX > 1 ? 1 : _scaleX;
      //     setScaleEffect(object, _scaleX);
      //   },
      //   { signal: controller.signal },
      // );
      elAbortControllerMap.set(object, controller);
    }
    if (object instanceof Graphics) {
      (vnodeProps as any).draw(object);
    }
    elYogaNodeMap.set(object, node);
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
        node.setJustifyContent(Justify.Center);
        node.setAlignItems(Align.Center);

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
