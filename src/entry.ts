import { createPixiApp } from "#/createPixiApp";
import { isPixiVueElement } from "#/isPixiVueElement";
import type { CustomVueComponent } from "../src/type/index";

export { createPixiApp, isPixiVueElement };
export type { CustomVueComponent };

declare module "vue" {
  interface ComponentCustomProperties extends CustomVueComponent { }
}
