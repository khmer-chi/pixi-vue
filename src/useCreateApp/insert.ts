import { Application, Container } from "pixi.js";
import type { RendererElement, RendererNode, RendererOptions } from "vue";

export const insert = (payload: Parameters<RendererOptions<RendererNode | null, RendererElement>["insert"]>) => {
  const [el, parent] = payload;
  if (parent instanceof Container && el instanceof Container) {
    parent.addChild(el);
  } else if (el instanceof Application && parent instanceof HTMLElement) {
    parent.appendChild(el.canvas);
  } else if (el instanceof Container && parent instanceof Application) {
    parent.stage.children[0].addChild(el);
  }
};
