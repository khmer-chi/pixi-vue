import type {
  LayoutBitmapText,
  LayoutContainer,
  LayoutHTMLText,
  LayoutSprite,
  LayoutText,
  LayoutView,
} from "@pixi/layout/components";
import type { BitmapText, Container, Graphics, HTMLText, Sprite, Text } from "pixi.js";
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

  readonly PixiContainer: VueDefineProps<typeof Container>;
  readonly PixiGraphics: VueDefineProps<typeof Graphics>;
  readonly PixiText: VueDefineProps<typeof Text>;
  readonly PixiSprite: VueDefineProps<typeof Sprite>;
  readonly PixiBitmapText: VueDefineProps<typeof BitmapText>;
  readonly PixiHtmlText: VueDefineProps<typeof HTMLText>;
}
