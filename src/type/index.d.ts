import type { LayoutOptions } from "@pixi/layout";
import type {
  LayoutAnimatedSprite,
  LayoutBitmapText,
  LayoutContainer,
  LayoutGraphics,
  LayoutHTMLText,
  LayoutMesh,
  LayoutNineSliceSprite,
  LayoutSprite,
  LayoutText,
  LayoutTilingSprite,
  LayoutView,
} from "@pixi/layout/components";
import type {
  AnimatedSprite,
  BitmapText,
  Container,
  Graphics,
  HTMLText,
  Mesh,
  NineSliceSprite,
  Renderer,
  Sprite,
  Text,
  TilingSprite,
} from "pixi.js";
import type { DefineComponent, UnwrapRef } from "vue";

type ConstructParam<T extends abstract new (...args: any) => any> =
  ConstructorParameters<T>[0];

type VueDefineProps<
  T extends abstract new (
    ...args: any
  ) => any,
  U = unknown,
> = UnwrapRef<DefineComponent<ConstructParam<T> & U>>;
type layoutWithoutBgColor<
  T extends abstract new (
    ...args: any
  ) => any,
  U = unknown,
> = UnwrapRef<
  DefineComponent<
    Omit<ConstructParam<T>, "layout"> & {
      layout: Omit<LayoutOptions, "target" | "backgroundColor">;
    } & U
  >
>;

export interface CustomVueComponent {
  readonly LayoutContainer: VueDefineProps<typeof LayoutContainer>;
  readonly LayoutSprite: VueDefineProps<typeof LayoutSprite>;
  readonly LayoutText: VueDefineProps<typeof LayoutText>;
  readonly LayoutView: VueDefineProps<typeof LayoutView>;
  readonly LayoutBitmapText: VueDefineProps<typeof LayoutBitmapText>;
  readonly LayoutHtmlText: VueDefineProps<typeof LayoutHTMLText>;
  readonly LayoutGraphics: VueDefineProps<typeof LayoutGraphics>;
  readonly LayoutAnimatedSprite: VueDefineProps<typeof LayoutAnimatedSprite>;
  readonly LayoutTilingSprite: VueDefineProps<typeof LayoutTilingSprite>;
  readonly LayoutNineSliceSprite: VueDefineProps<typeof LayoutNineSliceSprite>;
  readonly LayoutMesh: VueDefineProps<typeof LayoutMesh>;

  readonly PixiApplication: DefineComponent<{
    width: number;
    height: number;
    layout: Omit<LayoutOptions, "target">;
    onAppResize: (
      ...payload: Parameters<Parameters<Renderer["on"]>[1]>
    ) => void;
  }>;

  readonly PixiContainer: layoutWithoutBgColor<typeof Container>;
  readonly PixiGraphics: layoutWithoutBgColor<
    typeof Graphics,
    {
      draw: (graphics: Graphics) => void;
    }
  >;
  readonly PixiText: layoutWithoutBgColor<typeof Text>;
  readonly PixiSprite: layoutWithoutBgColor<typeof Sprite>;
  readonly PixiBitmapText: layoutWithoutBgColor<typeof BitmapText>;
  readonly PixiHtmlText: layoutWithoutBgColor<typeof HTMLText>;

  readonly PixiAnimatedSprite: layoutWithoutBgColor<typeof AnimatedSprite>;
  readonly PixiTilingSprite: layoutWithoutBgColor<typeof TilingSprite>;
  readonly PixiNineSliceSprite: layoutWithoutBgColor<typeof NineSliceSprite>;
  readonly PixiMesh: layoutWithoutBgColor<typeof Mesh>;
}
