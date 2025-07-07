import type { Graphics } from "pixi.js";
import type { RendererNode } from "vue";
import type { Node } from "yoga-layout";
import type { Layout } from "#/schema/Layout";

export type WeakMapObject = {
  childrenElMap: WeakMap<RendererNode, RendererNode[]>;
  parentElMap: WeakMap<RendererNode, RendererNode>;
  elScaleMap: WeakMap<RendererNode, number>;
  elScaleEffectMap: WeakMap<RendererNode, number>;
  elAbortControllerMap: WeakMap<RendererNode, AbortController>;
  elYogaNodeMap: WeakMap<RendererNode, Node>;
  elBgMap: WeakMap<RendererNode, Graphics>;
  elLayoutDataMap: WeakMap<RendererNode, Layout>;
};
