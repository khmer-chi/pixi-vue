import { Application, Container } from "pixi.js";
import type { RendererNode } from "vue";
import type { Node } from "yoga-layout";

export const remove = (
  el: RendererNode,
  elYogaNodeMap: WeakMap<RendererNode, Node>,
  elAbortControllerMap: WeakMap<RendererNode, AbortController>,
) => {
  if (!el) return;
  const parent = el.parent as RendererNode;

  if (parent instanceof Container && el instanceof Container) {
    parent.removeChild(el);
  } else if (el instanceof Application && parent instanceof HTMLElement) {
    parent.removeChild(el.canvas);
  } else if (el instanceof Container && parent instanceof Application) {
    parent.stage.removeChild(el);
  }
  const yogaNode = elYogaNodeMap.get(el);
  const parentYogaNode = elYogaNodeMap.get(parent);
  if (yogaNode && parentYogaNode) {
    parentYogaNode.removeChild(yogaNode);
  }
  if (el instanceof Container) {
    el.destroy();
  }
  const AbortController = elAbortControllerMap.get(el);
  if (AbortController) {
    AbortController.abort();
  }
};
