import {
  Application,
  Container,
  Graphics,
  Sprite,
  Text,
  Texture,
} from "pixi.js";
import type { RendererElement, RendererNode } from "vue";
import { RwdContainer } from "#/createRendererFunc/RwdContainer";

const checkCommon = <T>(el: T): Container | false => {
  if (el instanceof Container) return el;
  if (el instanceof Sprite) return el;
  if (el instanceof Text) return el;
  if (el instanceof Graphics) return el;
  if (el instanceof Application) return el.stage;
  return false;
};
export const patchProp = async (
  el: RendererElement,
  key: string,
  prevValue: any,
  nextValue: any,
  elScaleMap: WeakMap<RendererNode, number>,
  parentElMap: WeakMap<RendererNode, RendererNode>,
  elScaleEffectMap: WeakMap<RendererNode, number>,
  childrenElMap: WeakMap<RendererNode, RendererNode[]>,
) => {
  // const setScaleEffect = (object: Container, scaleEffect: number) => {
  //   console.log({ scaleEffect });
  //   elScaleEffectMap.set(object, scaleEffect);
  //   const children = childrenElMap.get(object) ?? [];
  //   for (let i = 0; i < children?.length; i++) {
  //     const el = children[i];

  //     el.scale = (elScaleMap.get(el) ?? 1) * scaleEffect;
  //     const background = el.background;
  //     const computedLayout = el.layout.computedLayout;
  //     console.log("------------------");
  //     console.log(background.width, background.height);
  //     console.log(computedLayout.width, computedLayout.height);
  //     console.log("------------------");
  //   }
  // };
  if (!prevValue) return;
  switch (key) {
    case "on:appResize": {
      if (el instanceof Application) {
        el.renderer.on("resize", nextValue);
        el.renderer.off("resize", prevValue);
      }
      break;
    }
    // case "scaleEffect": {
    //   if (el instanceof RwdContainer) {
    //     setScaleEffect(el, nextValue);
    //   }
    //   break;
    // }
    case "texture": {
      if (el instanceof Sprite) {
        el.texture = Texture.from(nextValue);
      }
      break;
    }
    case "text": {
      // if (el instanceof LayoutText) {
      //   el.slot.text = nextValue;
      // }
      if (el instanceof Text) {
        el.text = nextValue;
      }

      break;
    }
    case "style": {
      // if (el instanceof LayoutText) {
      //   el.slot.style = nextValue;
      // }
      if (el instanceof Text) {
        el[key] = nextValue;
      }
      break;
    }

    // case "layout": {
    //   const newEl = checkCommon(el);
    //   if (!newEl) return;
    //   newEl[key] = nextValue;
    //   break;
    // }
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
          newEl.orignalW = nextValue;
        } else if (key == "height") {
          newEl.orignalH = nextValue;
        }
        // newEl.layout = {
        //   aspectRatio: newEl.orignalW / newEl.orignalH
        // }
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
};
