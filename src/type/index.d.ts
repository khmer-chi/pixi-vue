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
  Ticker,
  TilingSprite,
} from "pixi.js";
import type { DefineComponent, UnwrapRef } from "vue";

type CommonProps = {
  onResize?: (...payload: Parameters<Parameters<Renderer["on"]>[1]>) => void;
  onTick?: (ticker: Ticker) => void;
};
type VueDefineProps<
  T extends abstract new (
    ...args: any
  ) => any,
  U = unknown,
> = UnwrapRef<
  DefineComponent<
    Exclude<ConstructorParameters<T>[0], undefined> & U & CommonProps
  >
>;

type layoutWithoutBgColor<
  T extends abstract new (
    ...args: any
  ) => any,
  U = unknown,
> = UnwrapRef<
  DefineComponent<
    Omit<Exclude<ConstructorParameters<T>[0], undefined>, "layout"> & {
      layout?: Omit<LayoutOptions, "target" | "backgroundColor">;
    } & U &
    CommonProps
  >
>;

export interface CustomVueComponent {
  readonly PixiApplication: DefineComponent<
    {
      width: number;
      height: number;
      layout?: Omit<LayoutOptions, "target">;
    } & CommonProps
  >;
  readonly PixiLayoutContainer: VueDefineProps<typeof LayoutContainer>;
  readonly PixiLayoutSprite: VueDefineProps<typeof LayoutSprite>;
  readonly PixiLayoutText: VueDefineProps<typeof LayoutText>;
  readonly PixiLayoutView: VueDefineProps<typeof LayoutView>;
  readonly PixiLayoutBitmapText: VueDefineProps<typeof LayoutBitmapText>;
  readonly PixiLayoutHtmlText: VueDefineProps<typeof LayoutHTMLText>;
  readonly PixiLayoutGraphics: VueDefineProps<typeof LayoutGraphics>;
  readonly PixiLayoutAnimatedSprite: VueDefineProps<
    typeof LayoutAnimatedSprite
  >;
  readonly PixiLayoutTilingSprite: VueDefineProps<typeof LayoutTilingSprite>;
  readonly PixiLayoutNineSliceSprite: VueDefineProps<
    typeof LayoutNineSliceSprite
  >;
  readonly PixiLayoutMesh: VueDefineProps<typeof LayoutMesh>;

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
