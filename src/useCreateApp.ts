import type { Application } from "pixi.js";
import { createRenderer, type RendererNode } from "vue";
import type { Node, Yoga } from "yoga-layout/load";
import { createElement } from "#/createRendererFunc/createElement";
import { insert } from "#/createRendererFunc/insert";
import { patchProp } from "#/createRendererFunc/patchProp";
import { remove } from "#/createRendererFunc/remove";

export const useCreateApp = (application: Application, yoga: Yoga) => {
  const childrenElMap = new WeakMap<RendererNode, RendererNode[]>();
  const parentElMap = new WeakMap<RendererNode, RendererNode>();
  const elScaleMap = new WeakMap<RendererNode, number>();
  const elScaleEffectMap = new WeakMap<RendererNode, number>();
  const elAbortControllerMap = new WeakMap<RendererNode, AbortController>();
  const elYogaNodeMap = new WeakMap<RendererNode, Node>();

  return createRenderer<RendererNode | null>({
    createElement(type, _namespace, _isCustomizedBuiltIn, vnodeProps) {
      return createElement(
        type,
        vnodeProps,
        yoga,
        application,
        elScaleMap,
        elAbortControllerMap,
        elYogaNodeMap,
      );
    },

    patchProp(el, key, prevValue, nextValue, _namespace, _parentComponent) {
      if (!prevValue) return;
      return patchProp(
        el,
        key,
        prevValue,
        nextValue,
        elScaleMap,
        parentElMap,
        elScaleEffectMap,
        childrenElMap,
      );
    },

    insert(el, parent) {
      if (!el) return;
      insert(el, parent, elYogaNodeMap, childrenElMap, parentElMap);
    },

    remove(el) {
      if (!el) return;
      remove(el, elYogaNodeMap, elAbortControllerMap);
    },

    createText() {
      return null;
    },

    setElementText() {
      return null;
    },

    parentNode(node) {
      if (node) return node.parent;
    },

    nextSibling(_node) {
      return null;
    },

    createComment: () => {
      return null;
    },
    setText: () => {
      return null;
    },
  });
};
