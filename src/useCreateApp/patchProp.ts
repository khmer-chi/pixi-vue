import { LayoutText } from "@pixi/layout/components";
import {
  Application,
  type Container,
  Graphics,
  Sprite,
  Text,
  Texture,
} from "pixi.js";
import type { Ref, RendererElement, RendererNode, RendererOptions } from "vue";

export const patchProp = (
  payload: Parameters<
    RendererOptions<RendererNode | null, RendererElement>["patchProp"]
  >,
  rwdWidth: Ref<number>,
  rwdHeight: Ref<number>,
) => {
  const [el, key, prevValue, nextValue] = payload;
  if (!(el instanceof Application)) {
    if (key.startsWith("on")) {
      const eventName = key.replace(/^on/, "").toLowerCase();
      if (prevValue) {
        el.off(eventName, prevValue);
      }
      el.on(eventName, nextValue);
      return;
    }
  }


  if (!prevValue) return;
  switch (key) {
    case "onResize": {
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
      if (el instanceof Application) {
        if (key == "width")
          rwdWidth.value = nextValue
        if (key == "height")
          rwdHeight.value = nextValue
        break;
      }

      el[key] = nextValue;
      break;
    }
    case "anchor": {
      if (el instanceof Sprite) {
        el.anchor.set(nextValue.x, nextValue.y);
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
};
