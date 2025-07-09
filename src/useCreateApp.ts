import type { Application } from "pixi.js";
import { createRenderer, type RendererElement, type RendererNode } from "vue";
import "@pixi/layout";
import { createElement } from "#/useCreateApp/createElement";
import { insert } from "#/useCreateApp/insert";
import { patchProp } from "#/useCreateApp/patchProp";
import { remove } from "#/useCreateApp/remove";

export const useCreateApp = (application: Application) => {
  return createRenderer<RendererNode | null, RendererElement>({
    createElement: (...args) => createElement(args, application),
    patchProp: (...args) => patchProp(args),
    insert: (...args) => insert(args),
    remove: (...args) => remove(args),
    createText: () => null,
    setElementText: () => null,
    parentNode: (node) => node ? node.parent : undefined,
    nextSibling: () => null,
    createComment: () => null,
    setText: () => null,
  });
};
