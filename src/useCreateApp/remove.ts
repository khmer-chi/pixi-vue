import { Application, Container } from "pixi.js";
import type { RendererElement, RendererNode, RendererOptions } from "vue";

export const remove = (payload: Parameters<RendererOptions<RendererNode | null, RendererElement>["remove"]>) => {
  const [el] = payload
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
}
