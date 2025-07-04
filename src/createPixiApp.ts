// import "@pixi/layout";
import { Application, type ApplicationOptions } from "pixi.js";
import type { Component } from "vue";
import { loadYoga } from "yoga-layout/load";
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
  const yoga = (await loadYoga())
  const { createApp } = useCreateApp(pixiApplication, yoga);
  createApp(rootComponent).mount(el);
}
