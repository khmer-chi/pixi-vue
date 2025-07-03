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

type VueDefineProps<T extends abstract new (...args: any) => any> = UnwrapRef<
  DefineComponent<ConstructParam<T>>
>;

export interface CustomVueComponent {
  readonly LayoutContainer: VueDefineProps<typeof LayoutContainer>;
  readonly LayoutSprite: VueDefineProps<typeof LayoutSprite>;
  readonly LayoutText: VueDefineProps<typeof LayoutText>;
  readonly LayoutView: VueDefineProps<typeof LayoutView>;
  readonly LayoutBitmapText: VueDefineProps<typeof LayoutBitmapText>;
  readonly LayoutHtmlText: VueDefineProps<typeof LayoutHTMLText>;

  readonly PixiApplication: DefineComponent<{
    layout: Omit<LayoutOptions, "target" | "backgroundColor">;
    onAppResize: (
      ...payload: Parameters<Parameters<Renderer["on"]>[1]>
    ) => void;
  }>;
  readonly PixiContainer: VueDefineProps<typeof Container>;
  readonly PixiGraphics: VueDefineProps<typeof Graphics>;
  readonly PixiText: VueDefineProps<typeof Text>;
  readonly PixiSprite: VueDefineProps<typeof Sprite>;
  readonly PixiBitmapText: VueDefineProps<typeof BitmapText>;
  readonly PixiHtmlText: VueDefineProps<typeof HTMLText>;

  readonly PixiAnimatedSprite: VueDefineProps<typeof AnimatedSprite>;
  readonly PixiTilingSprite: VueDefineProps<typeof TilingSprite>;
  readonly PixiNineSliceSprite: VueDefineProps<typeof NineSliceSprite>;
  readonly PixiMesh: VueDefineProps<typeof Mesh>;

  readonly LayoutAnimatedSprite: VueDefineProps<typeof LayoutAnimatedSprite>;
  readonly LayoutTilingSprite: VueDefineProps<typeof LayoutTilingSprite>;
  readonly LayoutNineSliceSprite: VueDefineProps<typeof LayoutNineSliceSprite>;
  readonly LayoutMesh: VueDefineProps<typeof LayoutMesh>;
}
