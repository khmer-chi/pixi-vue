import type { Application } from "pixi.js";
import {
  createRenderer,
  type RendererNode,
  ref,
} from "vue";
import "@pixi/layout";
import { createElement } from "#/useCreateApp/createElement";
import { insert } from "#/useCreateApp/insert";
import { patchProp } from "#/useCreateApp/patchProp";
import { remove } from "#/useCreateApp/remove";

export const useCreateApp = (application: Application) => {
  const rwdWidth = ref(0);
  const rwdHeight = ref(0);
  return createRenderer<RendererNode | null>({
    createElement: (...args) =>
      createElement(args, application, rwdWidth, rwdHeight),
    patchProp: (...args) => patchProp(args, application, rwdWidth, rwdHeight),
    insert: (...args) => insert(args),
    remove: (...args) => remove(args),
    createText: () => null,
    setElementText: () => null,
    parentNode: (node) => (node ? node.parent : undefined),
    nextSibling: () => null,
    createComment: () => null,
    setText: () => null,
  });
};
