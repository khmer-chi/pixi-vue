import { Application, Container } from "pixi.js";
import type { RendererElement, RendererNode } from "vue";
import { Direction, type Node } from "yoga-layout";

const insertNode = (
  el: Container,
  parent: Container,
  elYogaNodeMap: WeakMap<RendererNode, Node>,
) => {
  const yogaNode = elYogaNodeMap.get(el);
  const parentYogaNode = elYogaNodeMap.get(parent);
  if (!yogaNode) return
  if (!parentYogaNode) return

  parentYogaNode.insertChild(yogaNode, parentYogaNode.getChildCount());
};

export const insert = (
  el: RendererElement,
  parent: RendererElement,
  elYogaNodeMap: WeakMap<RendererNode, Node>,
  childrenElMap: WeakMap<RendererNode, RendererNode[]>,
  parentElMap: WeakMap<RendererNode, RendererNode>,
) => {
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
    const node = elYogaNodeMap.get(parent.stage)
    if (node) {
      node.calculateLayout(undefined, undefined, Direction.LTR)
      updateElByNode(parent.stage, elYogaNodeMap)
      console.log(node.getComputedLayout(), node.getChild(0).getComputedLayout(), node.getChild(0).getChild(0).getComputedLayout())
    }
  }
};
const updateElByNode = (el: RendererElement, elYogaNodeMap: WeakMap<RendererNode, Node>) => {
  const node = elYogaNodeMap.get(el) as Node;

  const computedLayout = node.getComputedLayout()
  const _el = el as Container
  _el.x = computedLayout.left
  _el.y = computedLayout.top
  console.log('--------------');
  console.log(el, computedLayout)

  const children = el.children
  for (let i = 0; i < children.length; i++) {
    updateElByNode(children[i], elYogaNodeMap);
  }
}