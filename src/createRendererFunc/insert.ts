import { Application, Container, Graphics } from "pixi.js";
import type { RendererElement, RendererNode } from "vue";
import type { Node } from "yoga-layout";
import { updateElByNode } from "#/createRendererFunc/updateElByNode";
import type { WeakMapObject } from "#/schema/WeakMapObject";

const insertNode = (
  el: Container,
  parent: Container,
  elYogaNodeMap: WeakMap<RendererNode, Node>,
) => {
  const yogaNode = elYogaNodeMap.get(el);
  const parentYogaNode = elYogaNodeMap.get(parent);
  if (!yogaNode) return;
  if (!parentYogaNode) return;

  parentYogaNode.insertChild(yogaNode, parentYogaNode.getChildCount());
};

export const insert = (
  el: RendererElement,
  parent: RendererElement,
  weakMapObject: WeakMapObject,
) => {
  const {
    elYogaNodeMap,
    childrenElMap,
    parentElMap,
  } = weakMapObject;
  if (!el) return;
  if (parent instanceof Container && el instanceof Container) {
    if (!childrenElMap.has(parent)) childrenElMap.set(parent, []);
    (childrenElMap.get(parent) ?? []).push(el);
    parentElMap.set(el, parent);

    parent.addChild(el);
    insertNode(el, parent, elYogaNodeMap);
  } else if (el instanceof Application && parent instanceof HTMLElement) {
    parent.appendChild(el.canvas);
  } else if (el instanceof Container && parent instanceof Application) {
    parent.stage.addChild(el);
    insertNode(el, parent.stage, elYogaNodeMap);
    updateElByNode(parent.stage, weakMapObject);
  }
};
