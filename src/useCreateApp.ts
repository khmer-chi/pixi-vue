import {
  Application,
  BitmapText,
  Container,
  Graphics,
  HTMLText,
  Sprite,
  Text,
  Texture,
} from "pixi.js";
import { createRenderer, type RendererNode, ref, toRaw, watch } from "vue";
import "@pixi/layout";
import {
  LayoutBitmapText,
  LayoutContainer,
  LayoutHTMLText,
  LayoutSprite,
  LayoutText,
  LayoutView,
} from "@pixi/layout/components";
import { toKebabCase } from "#/toKebabCase";

const checkCommon = <T>(el: T): Container | false => {
  if (el instanceof Container) return el;
  if (el instanceof Sprite) return el;
  if (el instanceof Text) return el;
  if (el instanceof Graphics) return el;
  if (el instanceof LayoutContainer) return el;
  return false;
};

export const useCreateApp = () => {
  const childrenElMap = new WeakMap<RendererNode, RendererNode[]>();
  const parentElMap = new WeakMap<RendererNode, RendererNode>();
  const elScaleMap = new WeakMap<RendererNode, number>();
  const elScaleEffectMap = new WeakMap<RendererNode, number>();
  const appRef = ref<Application>();
  return createRenderer<RendererNode | null>({
    createElement(type): RendererNode {
      switch (toKebabCase(type)) {
        case "div": {
          return document.createElement("div");
        }
        case "layout-view": {
          return new LayoutView({});
        }
        case "layout-container": {
          return new LayoutContainer();
        }
        case "layout-text": {
          return new LayoutText({});
        }
        case "layout-sprite": {
          return new LayoutSprite({});
        }
        case "layout-bitmap-text": {
          return new LayoutBitmapText({})
        }
        case "layout-html-text": {
          return new LayoutHTMLText({})
        }

        case "pixi-container": {
          return new Container();
        }
        case "pixi-sprite": {
          return new Sprite();
        }
        case "pixi-text": {
          return new Text();
        }
        case "pixi-graphics": {
          return new Graphics();
        }
        case "bitmap-text": {
          return new BitmapText();
        }
        case "html-text": {
          return new HTMLText()
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
      switch (key) {
        case "app": {
          if (nextValue instanceof Application) {
            appRef.value = nextValue;
          }
          break;
        }
        case "appLayout": {
          if (appRef.value) {
            toRaw(appRef.value).stage.layout = nextValue;
          } else {
            watch(
              appRef,
              () => {
                if (!appRef.value) return;
                toRaw(appRef.value).stage.layout = nextValue;
              },
              { once: true },
            );
          }
          break;
        }
        case "onAppResize": {
          if (nextValue instanceof Function) {
            if (appRef.value) {
              appRef.value.renderer.on("resize", nextValue);
            } else {
              watch(
                appRef,
                () => {
                  if (!appRef.value) return;
                  appRef.value.renderer.on("resize", nextValue);
                },
                { once: true },
              );
            }
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
