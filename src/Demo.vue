<script setup lang="ts">
import { ref } from "vue";

const width = ref(500);
const text = ref("12122322s211");
setTimeout(() => {
  width.value = 400;
  text.value = "5512";
}, 1000);
const resize = ref(() => {
  // console.log("resize");
});
setTimeout(() => {
  resize.value = () => {
    console.log("resize1");
  };
}, 500);
</script>
<template>
  <PixiApplication
    :width
    :height="500"
    :layout="{
      backgroundColor: '#1099bb',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    }"
    @resize="resize"
  >
    <PixiLayoutText
      :rotation="(90 * Math.PI) / 180"
      :text
      :layout="{ width: 250, height: 250, backgroundColor: '#000fff' }"
      :style="{
        fill: '#fff000',
      }"
    />
    <PixiLayoutText
      :text
      :layout="{ width: 250, height: 250, backgroundColor: '#000fff' }"
      :style="{
        fill: '#fff000',
      }"
    />
  </PixiApplication>
</template>
