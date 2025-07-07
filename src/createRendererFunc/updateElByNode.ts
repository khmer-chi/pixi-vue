import { type Container, Graphics } from "pixi.js";
import type { RendererElement } from "vue";
import { Direction } from "yoga-layout";
import type { WeakMapObject } from "#/schema/WeakMapObject";

export const updateElByNode = (
  el: RendererElement,
  weakMapObject: WeakMapObject,
  isRoot = true,
) => {
  const { elYogaNodeMap, elLayoutDataMap, elBgMap } = weakMapObject;
  const node = elYogaNodeMap.get(el);
  if (!node) return;

  if (isRoot) node.calculateLayout(undefined, undefined, Direction.LTR);

  const computedLayout = node.getComputedLayout();
  const _el = el as Container;
  _el.x = computedLayout.left;
  _el.y = computedLayout.top;

  // console.log("--------------");
  // console.log(el, computedLayout);
  const layout = elLayoutDataMap.get(el);
  if (layout) {
    if (layout.backgroundColor) {
      if (!elBgMap.has(el)) {
        elBgMap.set(el, new Graphics())
      }
      const graphics = elBgMap.get(el) as Graphics
      graphics.clear()
      graphics.rect(0, 0, computedLayout.width, computedLayout.height)
      graphics.fill({ color: layout.backgroundColor })
      el.addChildAt(graphics, el.children.length);
      console.log(el, computedLayout.width, computedLayout.height);
    }
  }


  const children = el.children;
  for (let i = 0; i < children.length; i++) {
    updateElByNode(children[i], weakMapObject, false);
  }
};
