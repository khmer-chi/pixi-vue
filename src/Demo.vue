<script setup lang="ts">
import { Layout } from "@pixi/layout";
import { LayoutContainer, LayoutText } from "@pixi/layout/components";
import { Application } from "pixi.js";
import { onMounted, ref, toRaw } from "vue";

const width = ref(500);
const text = ref("12122322s211");
// setTimeout(() => {
//   width.value = 400;
//   text.value = "5512";
// }, 1000);
const resize = ref(() => {
  // console.log("resize");
});
setTimeout(() => {
  resize.value = () => {
    // console.log("resize1");
  };
}, 500);
const rotation = ref((90 * Math.PI) / 180);
setTimeout(() => {
  rotation.value = (180 * Math.PI) / 180;
}, 1000);
// const text1 = ref<LayoutText>();
// onMounted(() => {
//   const aa = toRaw(text1.value);
//   if (aa) {
//     aa.rotation = (90 * Math.PI) / 180;
//   }
// });
// const app = ref<Application>();
// onMounted(() => {
//   const appRaw = toRaw(app.value);
//   if (appRaw) {
//     (appRaw.stage.getChildAt(0) as LayoutContainer).addChild(
//       new LayoutText({
//         text: "Hello Pixi!",
//         layout: {
//           width: 250,
//           height: 250,
//           backgroundColor: "#000fff",
//         },
//         rotation: (90 * Math.PI) / 180,
//         style: {
//           fill: "#fff000",
//         },
//       })
//     );
//   }
// });
</script>
<template>
  <PixiApplication
    ref="app"
    :width
    :height="500"
    :layout="{
      backgroundColor: '#1099bb',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    }"
  >
    <!-- <PixiLayoutText
      ref="text1"
      :rotation
      :text
      :layout="{ width: 250, height: 250, backgroundColor: '#000fff' }"
      :style="{
        fill: '#fff000',
      }"
      @resize="resize"
    /> -->
    <PixiLayoutText
      :rotation
      :text
      :layout="{ width: 250, height: 250, backgroundColor: '#000fff' }"
      :style="{
        fill: '#fff000',
      }"
    />
  </PixiApplication>
</template>
