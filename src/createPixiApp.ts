import "@pixi/layout";
import { Application, type ApplicationOptions } from "pixi.js";
import type { Component } from "vue";
import { toKebabCase } from "#/toKebabCase";
import { useCreateApp } from "#/useCreateApp";
export async function createPixiApp(
  rootComponent: Component,
  el: HTMLElement,
  appInitOption?: Partial<ApplicationOptions>,
) {
  const { createApp } = useCreateApp();

  const pixiApplication = new Application();
  await pixiApplication.init({
    backgroundAlpha: 0,
    resizeTo: window,
    ...appInitOption,
  });

  pixiApplication.stage.layout = {
    justifyContent: "center",
    alignItems: "center",
  };

  pixiApplication.renderer.on("resize", (width, height) => {
    pixiApplication.stage.layout = {
      width,
      height,
    };
  });

  pixiApplication.resize();
  el.appendChild(pixiApplication.canvas);
  const app = createApp(rootComponent, { app: pixiApplication });
  app.config.compilerOptions.isCustomElement = (tag) => {
    console.log(tag)
    const name = toKebabCase(tag);
    if (name.startsWith("pixi-rwd-container")) return false;
    if (name.startsWith("pixi-")) return true;
    if (name.startsWith("layout-")) return true;
    return false;
  };

  app.mount(pixiApplication.stage);
}
