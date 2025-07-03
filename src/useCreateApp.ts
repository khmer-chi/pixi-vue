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
  LayoutGraphics,
  LayoutHTMLText,
  LayoutMesh,
  LayoutNineSliceSprite,
  LayoutSprite,
  LayoutText,
  LayoutTilingSprite,
  LayoutView,
} from "@pixi/layout/components";
import { toKebabCase } from "#/toKebabCase";

class RwdContainer extends LayoutContainer {
  orignalW = -1;
  orignalH = -1;
}
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
  const elAbortControllerMap = new WeakMap<RendererNode, AbortController>();


  const setScaleEffect = (object: Container, scaleEffect: number) => {
    elScaleEffectMap.set(object, scaleEffect);
    const children = childrenElMap.get(object) ?? [];
    for (let i = 0; i < children?.length; i++) {
      const el = children[i];
      console.log(el)
      el.scale = (elScaleMap.get(el) ?? 1) * scaleEffect;
    }
  };

  return createRenderer<RendererNode | null>({
    createElement(
      type,
      _namespace,
      _isCustomizedBuiltIn,
      vnodeProps,
    ): RendererNode {
      console.log({ type })
      const map = new Map<string, unknown>([
        ["pixi-layout-view", LayoutView],
        ["pixi-layout-container", LayoutContainer],
        ["pixi-layout-text", LayoutText],
        ["pixi-layout-sprite", LayoutSprite],
        ["pixi-layout-bitmap-text", LayoutBitmapText],
        ["pixi-layout-html-text", LayoutHTMLText],
        ["pixi-layout-pixi-animated-sprite", LayoutAnimatedSprite],
        ["pixi-layout-pixi-tiling-sprite", LayoutTilingSprite],
        ["pixi-layout-pixi-nine-slice-sprite", LayoutNineSliceSprite],
        ["pixi-layout-pixi-mesh", LayoutMesh],
        ["pixi-layout-graphics", LayoutGraphics],

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

        ["pixi-rwd-container", RwdContainer],
      ]);

      const classFunc = map.get(toKebabCase(type));
      if (classFunc) {
        const classArgsOptions = { ...(vnodeProps as any) };
        if (classFunc == RwdContainer) {
          delete classArgsOptions.width;
          delete classArgsOptions.height;

          classArgsOptions.layout = {
            ...vnodeProps?.layout,
            height: "100%",
            aspectRatio: (vnodeProps as any).width / (vnodeProps as any).height,
          };
        }

        const object = new (classFunc as any)(classArgsOptions);

        if (vnodeProps?.scale) elScaleMap.set(object, vnodeProps.scale);

        if (object instanceof RwdContainer) {
          const controller = new AbortController();
          object.orignalW = (vnodeProps as any).width;
          object.orignalH = (vnodeProps as any).height;
          object.on(
            "layout",
            (event) => {
              console.log(event.computedLayout.width, (vnodeProps as any).width)
              const _scaleX =
                event.computedLayout.width / (vnodeProps as any).width;
              console.log({ _scaleX })

              const scaleEffect = _scaleX > 1 ? 1 : _scaleX;
              setScaleEffect(object, scaleEffect);
            },
            { signal: controller.signal },
          );
          elAbortControllerMap.set(object, controller);
        }
        if (object instanceof Graphics) {
          (vnodeProps as any).draw(object);
        }

        return object;
      }
      switch (toKebabCase(type)) {
        case "pixi-application": {
          if (vnodeProps) {
            const { layout } = vnodeProps;
            if (layout) application.stage.layout = layout;
            const onAppResize = vnodeProps["on:appResize"];

            application.renderer.on("resize", (...args) => {
              const [width, height] = args;
              application.stage.layout = {
                width,
                height,
              };
              onAppResize(...args);
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
      if (!prevValue) return;
      switch (key) {
        case "on:appResize": {
          if (el instanceof Application) {
            el.renderer.on("resize", nextValue);
            el.renderer.off("resize", prevValue);
          }
          break;
        }
        case "scaleEffect": {
          if (el instanceof RwdContainer) {
            setScaleEffect(el, nextValue);
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
          if (newEl instanceof RwdContainer) {

            if (key == "width") {
              newEl.orignalW = nextValue
            } else if (key == "height") {
              newEl.orignalH = nextValue
            }
            newEl.layout = {
              aspectRatio: newEl.orignalW / newEl.orignalH
            }
            break;
          }
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
          newEl.off("pointerdown", prevValue);
          newEl.on("pointerdown", nextValue);
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
        (childrenElMap.get(parent) ?? []).push(el);

        parentElMap.set(el, parent);
        parent.addChild(el);
      } else if (el instanceof Application && parent instanceof HTMLElement) {
        parent.appendChild(el.canvas);
      } else if (el instanceof Container && parent instanceof Application) {
        parent.stage.addChild(el);
      }
    },

    remove(el) {
      if (!el) return
      const parent = el.parent as RendererNode

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
      const AbortController = elAbortControllerMap.get(el)
      if (AbortController) {
        AbortController.abort();
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
