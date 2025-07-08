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
import { createRenderer, type RendererElement, type RendererNode } from "vue";
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

const componentMap = new Map<string, unknown>([
  ["layout-view", LayoutView],
  ["layout-container", LayoutContainer],
  ["layout-text", LayoutText],
  ["layout-html-text", LayoutHTMLText],
  ["layout-sprite", LayoutSprite],
  ["layout-bitmap-text", LayoutBitmapText],
  ["layout-text", LayoutText],
  ["layout-pixi-animated-sprite", LayoutAnimatedSprite],
  ["layout-pixi-tiling-sprite", LayoutTilingSprite],
  ["layout-pixi-nine-slice-sprite", LayoutNineSliceSprite],
  ["layout-pixi-mesh", LayoutMesh],

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
]);
//TODO:分離createRenderer内的代碼
export const useCreateApp = (application: Application) => {
  return createRenderer<RendererNode | null, RendererElement>({
    createElement(
      type,
      _namespace,
      _isCustomizedBuiltIn,
      vnodeProps,
    ): RendererNode {
      const newType = toKebabCase(type);
      switch (newType) {
        case "pixi-application": {
          application.stage.layout = {
            justifyContent: "center",
            alignItems: "center",
            transformOrigin: "left top",
          };
          const rwdContainer = new LayoutContainer();
          rwdContainer.layout = {
            ...vnodeProps?.layout,
            height: "100%",
            aspectRatio: (vnodeProps as any).width / (vnodeProps as any).height,
          };

          application.stage.addChild(rwdContainer as unknown as Container);

          application.renderer.on("resize", (...args) => {
            const [width, height] = args;
            const scaleX = width / (vnodeProps as any).width;
            const scaleY = height / (vnodeProps as any).height;
            const scale = scaleX > scaleY ? scaleY : scaleX;
            application.stage.layout = {
              width: width / scale,
              height: height / scale,
            };
            application.stage.scale = scale;
            vnodeProps?.["on:appResize"](...args);
          });
          application.resize();
          return application;
        }
        default: {
          const classFunc = componentMap.get(newType);
          if (classFunc) {
            const classArgsOptions = { ...(vnodeProps as any) };
            const object = new (classFunc as any)(classArgsOptions);
            if (object instanceof Graphics) {
              vnodeProps?.draw(object);
            }
            return object;
          }
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
      if (!prevValue) return;
      switch (key) {
        case "on:appResize": {
          if (el instanceof Application) {
            el.renderer.on("resize", nextValue);
            el.renderer.off("resize", prevValue);
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
          if (el instanceof Application) {
            (el.stage.getChildAt(0) as Container)[key] = nextValue;
            break;
          }
          el[key] = nextValue;
          break;
        }
        case "width":
        case "height":
        case "x":
        case "y":
        case "rotation":
        case "scale":
        case "alpha": {
          el[key] = nextValue;
          break;
        }
        case "anchor": {
          if (el instanceof Sprite) {
            el.anchor.set(nextValue.x, nextValue.y);
          }
          break;
        }
        case "onClick": {
          el.off("pointerdown", prevValue);
          el.on("pointerdown", nextValue);
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
        parent.addChild(el);
      } else if (el instanceof Application && parent instanceof HTMLElement) {
        parent.appendChild(el.canvas);
      } else if (el instanceof Container && parent instanceof Application) {
        parent.stage.children[0].addChild(el);
      }
    },

    remove(el) {
      if (!el) return;
      const parent = el.parent as RendererNode;

      if (parent instanceof Container && el instanceof Container) {
        parent.removeChild(el);
      } else if (el instanceof Application && parent instanceof HTMLElement) {
        parent.removeChild(el.canvas);
      } else if (el instanceof Container && parent instanceof Application) {
        parent.stage.removeChild(el);
      }
      if (el instanceof Container) {
        el.destroy();
      }
    },

    createText() { return null; },
    setElementText() { return null; },
    parentNode(node) { if (node) return node.parent; },
    nextSibling() { return null; },
    createComment() { return null; },
    setText() { return null; },
  });
};
