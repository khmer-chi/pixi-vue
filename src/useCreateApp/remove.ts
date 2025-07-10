import { Application, Container } from "pixi.js";
import type { RendererNode, RendererOptions } from "vue";
// RendererNode | null, RendererElement
export const remove = (payload: Parameters<RendererOptions<RendererNode | null>["remove"]>) => {
  const [el] = payload
  if (!el) return;
  const parent = el.parent as RendererNode;

  if (parent instanceof Container && el instanceof Container) {
    parent.removeChild(el);
  } else if (el instanceof Container && parent instanceof Application) {
    parent.stage.removeChild(el);
  }
  if (el instanceof Container) {
    el.destroy();
  }
}
