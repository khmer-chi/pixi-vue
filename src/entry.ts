import { createPixiApp } from "#/createPixiApp";
import { isPixiVueElement } from "#/isPixiVueElement";
import PixiRwdContainer from "#/PixiRwdContainer.vue";
import type { CustomVueComponent } from "../src/type/index";

export { createPixiApp, PixiRwdContainer, isPixiVueElement };
export type { CustomVueComponent };

declare module "vue" {
  interface ComponentCustomProperties extends CustomVueComponent { }
}
