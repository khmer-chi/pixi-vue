import type { LayoutOptions } from "@pixi/layout";
import type {
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

type VueDefineProps<T extends abstract new (...args: any) => any, U = any> = UnwrapRef<
  DefineComponent<ConstructParam<T> & U>
>;

export interface CustomVueComponent {
  readonly PixiLayoutContainer: VueDefineProps<typeof LayoutContainer>;
  readonly PixiLayoutSprite: VueDefineProps<typeof LayoutSprite>;
  readonly PixiLayoutText: VueDefineProps<typeof LayoutText>;
  readonly PixiLayoutView: VueDefineProps<typeof LayoutView>;
  readonly PixiLayoutBitmapText: VueDefineProps<typeof LayoutBitmapText>;
  readonly PixiLayoutHtmlText: VueDefineProps<typeof LayoutHTMLText>;

  readonly PixiApplication: DefineComponent<{
    layout: Omit<LayoutOptions, "target" | "backgroundColor">;
    onAppResize: (
      ...payload: Parameters<Parameters<Renderer["on"]>[1]>
    ) => void;
  }>;
  readonly PixiContainer: VueDefineProps<typeof Container>;
  readonly PixiGraphics: VueDefineProps<typeof Graphics, { draw: (graphics: Graphics) => void }>;
  readonly PixiText: VueDefineProps<typeof Text>;
  readonly PixiSprite: VueDefineProps<typeof Sprite>;
  readonly PixiBitmapText: VueDefineProps<typeof BitmapText>;
  readonly PixiHtmlText: VueDefineProps<typeof HTMLText>;

  readonly PixiAnimatedSprite: VueDefineProps<typeof AnimatedSprite>;
  readonly PixiTilingSprite: VueDefineProps<typeof TilingSprite>;
  readonly PixiNineSliceSprite: VueDefineProps<typeof NineSliceSprite>;
  readonly PixiMesh: VueDefineProps<typeof Mesh>;

  readonly PixiLayoutGraphics: VueDefineProps<typeof Graphics, { draw: (graphics: Graphics) => void }>;
  readonly PixiLayoutAnimatedSprite: VueDefineProps<typeof LayoutAnimatedSprite>;
  readonly PixiLayoutTilingSprite: VueDefineProps<typeof LayoutTilingSprite>;
  readonly PixiLayoutNineSliceSprite: VueDefineProps<typeof LayoutNineSliceSprite>;
  readonly PixiLayoutMesh: VueDefineProps<typeof LayoutMesh>;

  readonly PixiRwdContainer: DefineComponent<{ layout: Omit<LayoutOptions, "target">, width: number, height: number }>;
}
