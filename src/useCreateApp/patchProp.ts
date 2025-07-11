import { LayoutView } from "@pixi/layout/components";
import {
  Application,
  type Container,
  Graphics,
  Sprite,
  Text,
  Texture,
} from "pixi.js";
import type { Ref, RendererOptions } from "vue";

export const patchProp = (
  payload: Parameters<
    RendererOptions["patchProp"]
  >,
  application: Application,
  rwdWidth: Ref<number>,
  rwdHeight: Ref<number>,
) => {

  const [el, key, prevValue, nextValue] = payload;
  if (key == "onResize") {
    if (prevValue)
      application.renderer.off("resize", prevValue);
    application.renderer.on("resize", nextValue);
    return;
  }
  if (key == "onTick") {
    if (prevValue)
      application.ticker.remove(prevValue)
    application.ticker.add(nextValue)
    return
  }
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

  if (prevValue === undefined) return;
  if (prevValue === null) return;

  switch (key) {
    case "texture": {
      if (el instanceof LayoutView) {
        el.slot.texture = Texture.from(nextValue);
      } else if (el instanceof Sprite) {
        el.texture = Texture.from(nextValue);
      }
      break;
    }
    case "text": {
      if (el instanceof LayoutView) {
        el.slot.text = nextValue;
      } else if (el instanceof Text) {
        el.text = nextValue;
      }
      break;
    }
    case "style": {
      if (el instanceof LayoutView) {
        el.slot.style = nextValue;
      } else if (el instanceof Text) {
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
    case "origin":

    case "pivot":
    case "width":
    case "height":
    case "x":
    case "y":
    case "rotation":
    case "angle":

    case "scale":
    case "alpha": {
      if (el instanceof Application) {
        if (key == "width")
          rwdWidth.value = nextValue
        if (key == "height")
          rwdHeight.value = nextValue
        break;
      }
      if (key == "rotation" || key == "angle") {
        el[key] = nextValue - prevValue;
      } else {
        el[key] = nextValue;
      }
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
