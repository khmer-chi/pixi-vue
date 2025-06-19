import { Application, Container, Sprite, Text, Texture } from "pixi.js";
import { type Component, createRenderer, type RendererNode } from "vue";

export async function createPixiApp(rootComponent: Component, el: HTMLElement) {
  // 初始化 Pixi.js 應用
  const pixiApp = new Application();
  await pixiApp.init({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
  });
  // 將畫布添加到 DOM
  el.appendChild(pixiApp.canvas);

  // 定義自定義渲染器
  const { createApp } = createRenderer({
    // 創建節點
    createElement(type) {
      switch (type) {
        case "pixi-container":
          return new Container();
        case "pixi-sprite":
          return new Sprite();
        case "pixi-text":
          return new Text();
        default:
          throw new Error(`Unknown element type: ${type}`);
      }
    },

    // 更新節點屬性
    patchProp(el, key, prevValue, nextValue) {
      switch (key) {
        case "texture":
          if (el instanceof Sprite) {
            el.texture = Texture.from(nextValue);
          }
          break;
        case "text":
          if (el instanceof Text) {
            el.text = nextValue;
          }
          break;
        case "x":
        case "y":
        case "rotation":
        case "scale":
        case "alpha":
          el[key] = nextValue;
          break;
        case "anchor":
          if (el instanceof Sprite) {
            el.anchor.set(nextValue.x, nextValue.y);
          }
          break;
        case "onClick":
          // 移除舊的事件監聽器
          if (prevValue) {
            el.off("pointerdown", prevValue);
          }
          // 添加新的事件監聽器
          if (nextValue) {
            el.on("pointerdown", nextValue);
          }
          break;
        default:
          console.warn(`Property ${key} not supported`);
      }
    },

    // 插入節點
    insert(el, parent) {
      if (parent instanceof Container) {
        parent.addChild(el as Container);
      }
    },

    // 移除節點
    remove(el) {
      if (el.parent) {
        el.parent.removeChild(el);
        el.destroy();
      }
    },

    // 創建文本節點
    createText() {
      throw new Error("createText not implemented.");
    },

    // 更新文本內容
    setElementText(el, text) {
      if (el instanceof Text) {
        el.text = text;
      }
    },

    // 返回父節點
    parentNode(node) {
      return node.parent;
    },

    // 兄弟節點（Pixi.js 不需要）
    nextSibling(_node) {
      throw new Error("nextSibling not implemented.");
    },

    createComment: (_text: string): RendererNode => {
      throw new Error("createComment not implemented.");
    },
    setText: (_node: RendererNode, _text: string): void => {
      throw new Error("setText not implemented.");
    },
  });
  const app = createApp(rootComponent);

  return app.mount(pixiApp.stage);
}
