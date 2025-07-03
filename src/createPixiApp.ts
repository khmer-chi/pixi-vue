import "@pixi/layout";
import { Application, type ApplicationOptions } from "pixi.js";
import type { Component } from "vue";
import { useCreateApp } from "#/useCreateApp";
export async function createPixiApp(
  rootComponent: Component,
  el: HTMLElement,
  appInitOption?: Partial<ApplicationOptions>,
) {
  const pixiApplication = new Application();
  await pixiApplication.init({
    backgroundAlpha: 0,
    resizeTo: window,
    ...appInitOption,
  });
  const { createApp } = useCreateApp(pixiApplication);
  createApp(rootComponent).mount(el);
}
