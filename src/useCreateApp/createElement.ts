import {
  LayoutAnimatedSprite,
  LayoutBitmapText,
  LayoutContainer,
  LayoutHTMLText,
  LayoutMesh,
  LayoutNineSliceSprite,
  LayoutSprite,
  LayoutText,
  LayoutTilingSprite,
  LayoutView,
} from "@pixi/layout/components";
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
import {
  computed,
  type Ref,
  type RendererElement,
  type RendererNode,
  type RendererOptions,
  ref,
  watch,
} from "vue";
import { toCamelCase } from "#/utils/toCamelCase";

const getClass = (type: string) => {
  const componentMap = new Map<string, unknown>([
    ["PixiLayoutView", LayoutView],
    ["PixiLayoutContainer", LayoutContainer],
    ["PixiLayoutText", LayoutText],
    ["PixiLayoutHTMLText", LayoutHTMLText],
    ["PixiLayoutSprite", LayoutSprite],
    ["PixiLayoutBitmapText", LayoutBitmapText],
    ["PixiLayoutText", LayoutText],
    ["PixiLayoutAnimatedSprite", LayoutAnimatedSprite],
    ["PixiLayoutTilingSprite", LayoutTilingSprite],
    ["PixiLayoutNineSliceSprite", LayoutNineSliceSprite],
    ["PixiLayoutPixiMesh", LayoutMesh],

    ["PixiContainer", Container],
    ["PixiSprite", Sprite],
    ["PixiText", Text],
    ["PixiTexture", Texture],
    ["PixiGraphics", Graphics],
    ["PixiBitmapText", BitmapText],
    ["PixiHTMLText", HTMLText],
    ["PixiAnimatedSprite", AnimatedSprite],
    ["PixiTilingSprite", TilingSprite],
    ["PixiNineSliceSprite", NineSliceSprite],
    ["PixiMesh", Mesh],
  ]);
  const classFunc = componentMap.get(type);
  if (!classFunc) throw new Error(`Unknown element type: ${type}`);
  return classFunc;
};
export const createElement = (
  payload: Parameters<
    RendererOptions<RendererNode | null, RendererElement>["createElement"]
  >,
  application: Application,
  rwdWidth: Ref<number>,
  rwdHeight: Ref<number>,
): RendererNode => {
  const [type, _namespace, _isCustomizedBuiltIn, vnodeProps] = payload;
  const {
    layout = {},
    width: propsWidth = 0,
    height: propsHeight = 0,
  } = vnodeProps ?? {};
  const newType = toCamelCase(type);
  switch (newType) {
    case "PixiApplication": {
      application.stage.layout = {
        justifyContent: "center",
        alignItems: "center",
        transformOrigin: "left top",
      };
      const rwdContainer = new LayoutContainer();
      application.stage.removeChildren();
      application.stage.addChild(rwdContainer);
      rwdContainer.layout = { height: "100%" };
      const aspectRatio = computed(() => rwdWidth.value / rwdHeight.value);
      watch(
        aspectRatio,
        (aspectRatio) => {
          rwdContainer.layout = { aspectRatio };
        },
        { immediate: true },
      );
      rwdContainer.layout = layout;
      rwdWidth.value = propsWidth;
      rwdHeight.value = propsHeight;
      const resizeWH = ref({ width: 0, height: 0 });
      application.renderer.on("resize", (...args) => {
        const [width, height] = args;
        resizeWH.value = { width, height };

        vnodeProps?.onResize(...args);
      });
      watch(
        [rwdWidth, rwdHeight, resizeWH],
        ([rwdWidth, rwdHeight, { width, height }]) => {
          const scaleX = width / rwdWidth;
          const scaleY = height / rwdHeight;
          const scale = scaleX > scaleY ? scaleY : scaleX;
          application.stage.layout = {
            width: width / scale,
            height: height / scale,
          };
          application.stage.scale = scale;
        },
        { immediate: true },
      );
      application.resize();
      return application;
    }
    default: {
      const classFunc = getClass(newType);
      const object = new (classFunc as any)(vnodeProps);
      if (object instanceof Graphics) {
        vnodeProps?.draw(object);
      }
      return object;
    }
  }
};
