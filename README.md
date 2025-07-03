## [my blog](https://taiwan.im/article/release-open-source-pixi-vue.html)

## how to install

npm i @khmer-chi/pixi-vue

## support

1. pixi.js@8
2. vue@3
3. @pixi/layout@3

## how to use

### step1: vite.config.ts

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { isPixiVueElement } from "@khmer-chi/pixi-vue";

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: isPixiVueElement,
        },
      },
    }),
  ],
});
```

### step2: main.ts

```ts
import App from "./App.vue";
createPixiApp(App, document.getElementById("app")!);
```

### step3: App.vue

```vue
<template>
  <PixiApplication
    :layout="{
      justifyContent: 'center',
      alignItems: 'center',
    }"
    @appResize="
      (...args) => {
        console.log(args);
      }
    "
  >
    <PixiRwdContainer
      :width="500"
      :height="500"
      :layout="{
        backgroundColor: '#1099bb',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }"
    >
      <LayoutText
        text="12123243"
        :layout="{ width: 200, height: 100, backgroundColor: '#000fff' }"
        :style="{
          fill: '#fff000',
        }"
      />
    </PixiRwdContainer>
  </PixiApplication>
</template>
```

### step4: index.html

```html
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>pixi-vue demo</title>
    <style>
      html,
      body {
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: #000;
      }
    </style>
  </head>

  <body>
    <div id="app"></div>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

## to do list

1. unit test
