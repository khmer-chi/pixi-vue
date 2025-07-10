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
import debounce from "lodash.debounce";
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
  type RendererNode,
  type RendererOptions,
  ref,
  watch,
} from "vue";
import { toCamelCase } from "#/utils/toCamelCase";

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
const getClass = (type: string) => {
  const classFunc = componentMap.get(type);
  if (!classFunc) throw new Error(`Unknown element type: ${type}`);
  return classFunc;
};
export const createElement = (
  payload: Parameters<
    RendererOptions["createElement"]
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
      application.stage.removeChildren();
      application.stage.layout = {
        justifyContent: "center",
        alignItems: "center",
        transformOrigin: "left top",
      };
      const rwdContainer = new LayoutContainer();
      application.stage.addChild(rwdContainer);

      rwdContainer.layout = layout;
      rwdContainer.layout = { height: "100%" };
      const aspectRatio = computed(() => rwdWidth.value / rwdHeight.value);
      rwdWidth.value = propsWidth;
      rwdHeight.value = propsHeight;
      const resizeWH = ref({ width: 0, height: 0 });

      application.renderer.on("resize", (...args) => {
        const [width, height] = args;
        resizeWH.value = { width, height };
        vnodeProps?.onResize?.(...args);
      });
      application.resize();


      watch(
        aspectRatio,
        (aspectRatio) => {
          rwdContainer.layout = { aspectRatio };
        },
        { immediate: true },
      );
      // 將 resize 事件的 watch 包裝 debounce，減少高頻觸發
      const updateStageLayout = debounce(
        (
          rwdWidth: number,
          rwdHeight: number,
          width: number,
          height: number,
        ) => {
          const scaleX = width / rwdWidth;
          const scaleY = height / rwdHeight;
          const scale = scaleX > scaleY ? scaleY : scaleX;
          application.stage.layout = {
            width: width / scale,
            height: height / scale,
          };
          application.stage.scale = scale;
        },
        16, // 16ms 約等於 60fps
      );

      watch(
        [rwdWidth, rwdHeight, resizeWH],
        ([rwdWidth, rwdHeight, { width, height }]) => {
          updateStageLayout(rwdWidth, rwdHeight, width, height);
        },
        { immediate: true },
      );

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
