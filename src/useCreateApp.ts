import {
  AnimatedSprite,
  Application,
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
import { createRenderer, type RendererNode } from "vue";
import "@pixi/layout";
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
import { toKebabCase } from "#/toKebabCase";

const checkCommon = <T>(el: T): Container | false => {
  if (el instanceof Container) return el;
  if (el instanceof Sprite) return el;
  if (el instanceof Text) return el;
  if (el instanceof Graphics) return el;
  if (el instanceof Application) return el.stage;
  return false;
};

export const useCreateApp = (application: Application) => {
  const childrenElMap = new WeakMap<RendererNode, RendererNode[]>();
  const parentElMap = new WeakMap<RendererNode, RendererNode>();
  const elScaleMap = new WeakMap<RendererNode, number>();
  const elScaleEffectMap = new WeakMap<RendererNode, number>();
  return createRenderer<RendererNode | null>({
    createElement(
      type,
      _namespace,
      _isCustomizedBuiltIn,
      vnodeProps,
    ): RendererNode {
      const map = new Map<string, unknown>([
        ['layout-view', LayoutView],
        ['layout-container', LayoutContainer],
        ['layout-text', LayoutText],
        ['layout-sprite', LayoutSprite],
        ['layout-bitmap-text', LayoutBitmapText],
        ['layout-text', LayoutHTMLText],
        ['layout-pixi-animated-sprite', LayoutAnimatedSprite],
        ['layout-pixi-tiling-sprite', LayoutTilingSprite],
        ['layout-pixi-nine-slice-sprite', LayoutNineSliceSprite],
        ['layout-pixi-mesh', LayoutMesh],

        ['pixi-container', Container],
        ['pixi-sprite', Sprite],
        ['pixi-text', Text],
        ['pixi-graphics', Graphics],
        ['pixi-bitmap-text', BitmapText],
        ['pixi-html-text', HTMLText],
        ['pixi-animated-sprite', AnimatedSprite],
        ['pixi-tiling-sprite', TilingSprite],
        ['pixi-nine-slice-sprite', NineSliceSprite],
        ['pixi-mesh', Mesh],
      ]);

      const classFunc = map.get(toKebabCase(type));
      if (classFunc) {
        return new (classFunc as any)(vnodeProps as any)
      }
      switch (toKebabCase(type)) {
        case "pixi-application": {
          if (vnodeProps) {
            const { layout } = vnodeProps
            if (layout)
              application.stage.layout = layout
            const onAppResize = vnodeProps['on:appResize']

            application.renderer.on("resize", (...args) => {
              const [width, height] = args
              application.stage.layout = {
                width,
                height,
              };
              onAppResize(...args)
            });
            application.resize();
          }

          return application;
        }
        default: {
          throw new Error(`Unknown element type: ${type}`);
        }
      }
    },

    async patchProp(
      el,
      key,
      prevValue,
      nextValue,
      _namespace,
      _parentComponent,
    ) {
      if (!prevValue) return
      // console.log(el, key, { prevValue, nextValue })
      switch (key) {
        case "on:appResize": {
          if (el instanceof Application) {
            if (nextValue)
              el.renderer.on("resize", nextValue);

            if (prevValue)
              el.renderer.off("resize", prevValue);
          }
          break;
        }
        case "scaleEffect": {
          if (el instanceof Container) {
            elScaleEffectMap.set(el, nextValue);
            const children = childrenElMap.get(el) ?? [];
            for (let i = 0; i < children?.length; i++) {
              const el = children[i];
              el.scale = (elScaleMap.get(el) ?? 1) * nextValue;
            }
          }
          break;
        }
        case "texture": {
          if (el instanceof Sprite) {
            el.texture = Texture.from(nextValue);
          }
          break;
        }
        case "text": {
          if (el instanceof LayoutText) {
            el.slot.text = nextValue;
          }
          if (el instanceof Text) {
            el.text = nextValue;
          }

          break;
        }
        case "style": {
          if (el instanceof LayoutText) {
            el.slot.style = nextValue;
          }
          if (el instanceof Text) {
            el[key] = nextValue;
          }
          break;
        }

        case "layout": {
          const newEl = checkCommon(el);
          if (!newEl) return;
          newEl[key] = nextValue;
          break;
        }
        case "width":
        case "height":
        case "x":
        case "y":
        case "rotation":
        case "scale":
        case "alpha": {
          const newEl = checkCommon(el);
          if (!newEl) return;
          if (key == "scale") {
            elScaleMap.set(newEl, nextValue);
            const parentEl = parentElMap.get(newEl);
            if (!parentEl) return;
            const scaleEffect = elScaleEffectMap.get(parentEl) ?? 0;
            newEl[key] = nextValue * scaleEffect;
          } else {
            newEl[key] = nextValue;
          }
          break;
        }
        case "anchor": {
          if (el instanceof Sprite) {
            el.anchor.set(nextValue.x, nextValue.y);
          }
          break;
        }
        case "onClick": {
          const newEl = checkCommon(el);
          if (!newEl) return;
          // 移除舊的事件監聽器
          if (prevValue) {
            newEl.off("pointerdown", prevValue);
          }
          // 添加新的事件監聽器
          if (nextValue) {
            newEl.on("pointerdown", nextValue);
          }
          break;
        }
        case "draw": {
          if (el instanceof Graphics) {
            nextValue(el);
          }
          break;
        }

        default: {
          console.warn(`Property ${key} not supported`);
        }
      }
    },

    insert(el, parent) {
      if (parent instanceof Container && el instanceof Container) {
        if (!childrenElMap.has(parent)) childrenElMap.set(parent, []);
        const array = childrenElMap.get(parent);
        if (!array) return;
        array.push(el);
        parentElMap.set(el, parent);
        parent.addChild(el);
      } else if (el instanceof Application && parent instanceof HTMLElement) {
        parent.appendChild(el.canvas)
      } else if (el instanceof Container && parent instanceof Application) {
        parent.stage.addChild(el)
      }
    },

    remove(el) {
      if (el?.parent) {
        el.parent.removeChild(el);
        el.destroy();
      }
    },

    createText() {
      return null;
    },

    setElementText() {
      return null;
    },

    parentNode(node) {
      if (node) return node.parent;
    },

    nextSibling(_node) {
      return null;
    },

    createComment: () => {
      return null;
    },
    setText: () => {
      return null;
    },
  });
};
